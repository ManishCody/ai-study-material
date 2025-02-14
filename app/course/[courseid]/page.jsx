"use client";

import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CourseIntro from '../_components/CourseIntro';
import StudyMaterial from '../_components/StudyMaterial';
import CourseIndex from '../_components/CourseIndex';
import Spinner from '../_components/Spinner';
import { Share } from 'lucide-react';
import MemoryGame from '../_components/MemoryGame';

const Course = () => {
  const { courseid } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showMemoryGame, setShowMemoryGame] = useState(false);

  // Lifted state
  const [materialsAvailability, setMaterialsAvailability] = useState({
    notes: false,
    flashcard: false,
    quiz: false,
    questionPaper: false,
  });

  const [loadingKeys, setLoadingKeys] = useState({}); // Track loading for materials

  const getCourseDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/courses?courseid=${courseid}`);
      

      setCourse(response?.data?.course);
      
      setMaterialsAvailability({
        notes: response?.data?.course?.notes || false,
        flashcard: response?.data?.course?.flashcards?.exists || false,
        quiz: response?.data?.course?.quizs?.exists || false,
        questionPaper: response?.data?.course?.questions?.exists || false,
      });
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourseDetail();
  }, [courseid, refreshKey]);

  const handelGenerate = async (key) => {
    setLoadingKeys((prev) => ({ ...prev, [key]: true })); // Start loading
    setShowGameDialog(true);

    try {
      await axios.post(`/api/generate-${key}`, { topic: course?.topic, studyMaterialId: courseid });

      setMaterialsAvailability((prev) => ({
        ...prev,
        [key]: true, // Mark material as available
      }));
    } catch (error) {
      console.error('Error generating study material:', error);
    } finally {
      setLoadingKeys((prev) => ({ ...prev, [key]: false })); // Stop loading
    }
  };

  const handleShare = () => {
    const shareData = {
      title: course?.title || 'Course',
      text: `Check out this course: ${course?.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log('Course shared successfully'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert('Course link copied to clipboard!');
    }
  };
  const handlePlayGame = () => {
    setShowGameDialog(false);
    setShowMemoryGame(true);
  }

  if (loading) {
    return <Spinner size="large" color="blue" />;
  }

  return (
    <div className="min-h-screen p-0 md:p-4">
      <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 mt-10">
        <h1 className="text-2xl font-bold">{course?.title}</h1>
        <button
          onClick={handleShare}
          className="bg-blue-500 mb-3 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          <p className='flex justify-center items-center gap-2'>< Share size={20} /> Share</p>
        </button>
        <CourseIntro course={course} />
        <StudyMaterial
          courseid={courseid}
          materialsAvailability={materialsAvailability}
          setMaterialsAvailability={setMaterialsAvailability}
          loadingKeys={loadingKeys}
          setLoadingKeys={setLoadingKeys}
          handelGenerate={handelGenerate}
        />

        <CourseIndex courseLayout={course?.courseLayout} />
      </div>
      {showGameDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Would you like to play a game while your notes are being prepared?</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handlePlayGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Yes, Play!
              </button>
              <button
                onClick={() => setShowGameDialog(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                No, Thanks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Memory Game */}
      {showMemoryGame && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="relative  p-4 sm:p-6 rounded-lg  w-[90%] max-w-sm">
            <MemoryGame />
            <button
              onClick={() => setShowMemoryGame(false)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
            >
              ✖
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Course;