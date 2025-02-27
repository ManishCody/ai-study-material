"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Spinner from "../../_components/Spinner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const CourseLayout = () => {
  const { courseid } = useParams();
  const [courseLayout, setCourseLayout] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({ completedChapters: new Set(), percentage: 0 });
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(0);
  const fetchCourseLayout = async () => {
    try {
      const response = await axios.get(`/api/courses?courseid=${courseid}`);
      setCompleted(response?.data?.course?.Complete)
      setCourseLayout(response?.data?.course?.courseLayout);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching course layout:", error);
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentChapterIndex < courseLayout?.chapters?.length - 1) {
      setCurrentChapterIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prevIndex) => prevIndex - 1);
    }
  };

  useEffect(() => {
    fetchCourseLayout();
  }, [courseid]);

  if (loading) {
    return <Spinner size="large" color="blue" />;
  }

  if (!courseLayout) {
    return <div>Error: Course layout not available.</div>;
  }

  const totalChapters = courseLayout?.chapters?.length;
  const currentChapter = courseLayout?.chapters[currentChapterIndex];
  const progressPercentage = ((currentChapterIndex + 1) / totalChapters) * 100;

  const handleComplete = async () => {
    if (completing || currentChapter?.isComplete) return;

    setCompleting(true);

    try {

      const notesWeightage = 40; // Total weightage assigned to notes
      const topicWeightage = notesWeightage / totalChapters; // Weightage per topic

      const newProgress = parseFloat(completed) + parseFloat(topicWeightage); 

      const updatedComplete = Math.min(newProgress, notesWeightage);

      const response = await axios.patch(`/api/update-complete-progress?id=${courseid}`, {
        Complete: updatedComplete.toFixed(2),
        isComplete: true,
        chapter_id: currentChapter._id,
        isNotes: true,
      });
      

      if (response.status === 200) {
        setProgressData((prev) => ({
          ...prev,
          percentage: updatedComplete.toFixed(2),
          completedChapters: new Set([...prev.completedChapters, currentChapterIndex + 1]),
        }));
        fetchCourseLayout();
      }
    } catch (error) {
      console.log("Error updating progress:", error);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold"> Notes</h1>
      <div className="flex justify-center items-center gap-5 mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentChapterIndex === 0}
          className={`px-2 py-1 rounded-lg font-medium ${currentChapterIndex === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
            }`}
        >
          Previous
        </button>
        <div className="w-[70vw] bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <button
          onClick={handleNext}
          disabled={currentChapterIndex === totalChapters - 1}
          className={`px-2 py-1 rounded-lg font-medium ${currentChapterIndex === totalChapters - 1
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
            }`}
        >
          Next
        </button>
      </div>

      <p className="text-gray-600">
        Chapter {currentChapterIndex + 1} of {totalChapters}
      </p>

      <div className="border p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{currentChapter?.chapterTitle}</h2>

        {currentChapter?.topics?.map((topic, topicIndex) => (
          <div
            key={topicIndex}
            className={`${topicIndex !== 0 ? "border-t-4 border-black" : ""} pt-4 mt-4`}
          >
            <h2 className="text-xl text-blue-500 font-semibold mb-2">{topic?.title} :- </h2>
            <div
              className="prose prose-blue md:text-start text-center"
              dangerouslySetInnerHTML={{ __html: topic?.htmlContent?.summary }}
            ></div>

            {topic?.htmlContent?.keyPoints?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Key Points</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {topic?.htmlContent?.keyPoints?.map((point, pointIndex) => (
                    <li
                      key={pointIndex}
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ __html: point }}
                    ></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-row justify-between items-center  md:gap-0">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentChapterIndex === 0}
          className={`px-2 py-1 rounded-lg font-medium ${currentChapterIndex === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
            }`}
        >
          Previous
        </button>

        {/* Center Section */}
        <div className="flex flex-wrap justify-center items-center gap-4">
          <button
            disabled={completing || currentChapter?.isComplete}
            onClick={handleComplete}
            className={`px-4 py-2 flex justify-center items-center rounded-lg bg-green-500 text-white font-semibold transition-colors duration-300 
    ${currentChapter?.isComplete || completing ? "cursor-not-allowed grayscale" : "hover:bg-green-600"}`}
          >
            {completing ? <>
              <AiOutlineLoading3Quarters className="animate-spin" size={20} />
            </> : "Complete"}
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentChapterIndex === totalChapters - 1}
            className={`px-2 py-1 rounded-lg font-medium ${currentChapterIndex === totalChapters - 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
              }`}
          >
            Next
          </button>

          {/* Go to Top Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="p-2 w-10 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300"
            title="Go to Top"
          >
            <p className="font-semibold text-xl">↑</p>
          </button>
        </div>
      </div>

    </div>
  );
};

export default CourseLayout;
