import React from "react";
import { Progress } from "@radix-ui/react-progress";
import Link from "next/link";

const CourseCard = ({ courses }) => {

  const storeCourseInfo = (courseId, percentage) => {
    if (!localStorage.getItem(courseId)) {
      localStorage.setItem(courseId, percentage);
    }
  };

  const getProgressPercentage = (courseId) => {
    return courses
  };

  storeCourseInfo(courses?._id, 0);
  console.log(courses);
  
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-transform hover:scale-105 duration-300 hover:shadow-2xl">
      {/* Course Image */}
      <div className="relative h-48 flex justify-center items-center">
        <img
          src={
            courses?.topicImage ||
            "https://i.postimg.cc/158Hpvj6/vector-design-online-learn-study-260nw-2428847413-removebg-preview.png"
          } 
          alt={courses?.topic || "Course Image"}
          className="w-auto h-full"
          onError={(e) => {
            e.target.src =
              "https://i.postimg.cc/158Hpvj6/vector-design-online-learn-study-260nw-2428847413-removebg-preview.png";
          }}
        />
      </div>

      {/* Course Details */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-teal-600 mb-2 truncate">
          {courses?.topic || "Untitled Course"}
        </h2>

        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {courses?.course_summary ||
            "No description available for this course."}
        </p>

        {/* Additional Information */}
        <div className="text-sm text-gray-500 mb-4">
          <p>
            <strong>Type:</strong> {courses?.courseType || "N/A"}
          </p>
          <p>
            <strong>Difficulty:</strong> {courses?.difficultyLevel || "N/A"}
          </p>
          <p>
            <strong>Created At:</strong> {new Date(courses?.createdAt).toLocaleDateString() || "N/A"} -  {new Date(courses?.createdAt).toLocaleTimeString() || "N/A"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Completion Progress</p>
          <Progress
            value={courses.Complete || 0} 
            className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden"
          >
            <div
              className="absolute h-full bg-teal-500 rounded-full"
              style={{width: `${courses.Complete}%` }}
            ></div>
          </Progress>
        </div>

        <Link href={`/course/${courses._id}`} >
          <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors duration-300">
            View Course
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
