"use client";

import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CourseIntro from '../_components/CourseIntro';
import StudyMaterial from '../_components/StudyMaterial';
import CourseIndex from '../_components/CourseIndex';
import Spinner from '../_components/Spinner';
import { Share } from 'lucide-react';

const Course = () => {
  const { courseid } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const getCourseDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/courses?courseid=${courseid}`);
      setCourse(response?.data?.course);
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
    try {
      console.log(`Generating ${key} for course ID: ${courseid}`);
      const response = await axios.post(`/api/generate-${key}`, { topic: course?.topic, studyMaterialId: courseid });
      setCourse((prevCourse) => ({
        ...prevCourse,
        [key]: true,
      }));
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error('Error generating study material:', error);
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

  if (loading) {
    return <Spinner size="large" color="blue" />;
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 font-bold">
        Error: Unable to load course details.
      </div>
    );
  }

  const materialsAvailability = {
    notes: course?.notes,
    flashcard: course?.flashcards?.exists,
    quiz: course?.quizs?.exists,
    questionPaper: course?.questions?.exists,
  };

  return (
    <div className="min-h-screen p-0 md:p-4">
      <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 mt-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{course?.title}</h1>
          <button
            onClick={handleShare}
            className="bg-blue-500 mb-3 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            <p className='flex justify-center items-center gap-2'>< Share size={20} /> Share</p>
          </button>
        </div>
        <CourseIntro course={course} />
        <StudyMaterial
          courseid={courseid}
          initialAvailability={{
            notes: course?.notes,
            flashcard: course?.flashcards?.exists,
            quiz: course?.quizs?.exists,
            questionPaper: course?.questions?.exists,
          }}
          handelGenerate={handelGenerate}
        />

        <CourseIndex courseLayout={course?.courseLayout} />
      </div>
    </div>
  );
};

export default Course;
