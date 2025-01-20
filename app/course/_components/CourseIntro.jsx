import { Progress } from '@/components/ui/progress';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CourseIntro = ({ course }) => {
  const [progress, setProgress] = useState(localStorage.getItem(course._id) || 0);

  return (
    <motion.div
      className="flex flex-col sm:flex-row gap-5 items-center p-6 sm:p-10 border shadow-md rounded-lg bg-gradient-to-r from-blue-50 to-white"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <img
        src={course?.topicImage || 'https://i.postimg.cc/158Hpvj6/vector-design-online-learn-study-260nw-2428847413-removebg-preview.png'}
        alt="Course Topic"
        className="w-auto h-20 sm:h-28 object-cover rounded-md shadow-lg"
        onError={(e) => {
          e.target.src =
            "https://i.postimg.cc/158Hpvj6/vector-design-online-learn-study-260nw-2428847413-removebg-preview.png";
        }}
      />
      <div className="text-center sm:text-left">
        <h2 className="font-bold text-2xl sm:text-3xl text-gray-800">{course?.topic}</h2>
        <p className="text-gray-600 mt-2">{course?.course_summary || "No summary available."}</p>
        <div className="mt-5">
          <Progress value={progress} />
        </div>
        <p className="mt-3 font-medium text-gray-700">
          Total Chapters: <span className="font-bold">{course?.courseLayout?.chapters?.length}</span> &nbsp; | &nbsp;
          Total Topics Covered:{" "}
          <span className="font-bold">
            {course?.courseLayout?.chapters?.reduce((total, chapter) => total + chapter.topics.length, 0)}
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default CourseIntro;
