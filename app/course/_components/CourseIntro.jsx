import { Progress } from '@/components/ui/progress';
import React, { useState, useEffect } from 'react';

const CourseIntro = ({ course }) => {
  const [progress, setProgress] = useState(localStorage.getItem(course._id) || 0);



  return (
    <div className="flex flex-col sm:flex-row gap-5 items-center p-6 sm:p-10 border shadow-md rounded-md bg-white">
      <img
        src={course?.topicImage || 'https://i.postimg.cc/158Hpvj6/vector-design-online-learn-study-260nw-2428847413-removebg-preview.png'}
        alt="Course Topic"
        className="w-auto h-20 object-fill"
        onError={(e) => {
          e.target.src =
            "https://i.postimg.cc/158Hpvj6/vector-design-online-learn-study-260nw-2428847413-removebg-preview.png";
        }}
      />
      <div className="text-center sm:text-left">
        <h2 className="font-bold text-xl sm:text-2xl text-gray-800">{course?.topic}</h2>
        <p className="text-gray-600 mt-2">{course?.course_summary || "No summary available."}</p>
        <div className='mt-5'>
          <Progress value={progress} />
        </div>
        <p className='mt-3'>Total Chapters {course?.courseLayout?.chapters?.length} & Total Topics Covered {course?.courseLayout?.chapters?.reduce((total, chapter) => total + chapter.topics.length, 0)}</p>
      </div>
    </div>
  );
};

export default CourseIntro;
