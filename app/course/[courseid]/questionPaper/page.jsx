"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Spinner from '../../_components/Spinner';

const QuizPage = () => {
  const { courseid } = useParams();
  const [quizData, setQuizData] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showAnswers, setShowAnswers] = useState({}); // Tracks visibility of answers
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseid) {
      const fetchQuizData = async () => {
        try {
          const response = await axios.get(`/api/courses?courseid=${courseid}`);
          setQuizData(response?.data?.course?.questions?.data || []);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching quiz data:", error);
          setLoading(false);
        }
      };

      fetchQuizData();
    }
  }, [courseid]);

  if (loading) {
    return <Spinner size="large" color="blue" />;
  }

  const handleNextSection = () => {
    if (currentSectionIndex < quizData.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  };

  const toggleAnswerVisibility = (questionIndex) => {
    setShowAnswers((prev) => ({
      ...prev,
      [questionIndex]: !prev[questionIndex],
    }));
    console.log(showAnswers);

  };

  const handleComplete = () => {
    const currentPercentage = parseFloat(localStorage.getItem(courseid)) || 0;
    const newTotalPercentage = Math.min(currentPercentage + 20, 100).toFixed(2);

    localStorage.setItem(courseid, newTotalPercentage);

  };

  if (!quizData.length) {
    return <div>Loading...</div>;
  }

  const currentSection = quizData[currentSectionIndex];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        {currentSection.section_title}
      </h1>
      <div className="space-y-4">
        {currentSection.questions.map((question, index) => (
          <div key={index}>
            <div  className="p-4 border rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-2">
                {index + 1}. {question.question}
              </h2>
              {Array.isArray(question.options) ? (
                <div className="space-y-2">
                  {question.options.map((option, i) => (
                    <label
                      key={i}
                      className="block p-2 border rounded-lg cursor-pointer hover:bg-blue-50"
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  placeholder="Write your answer here..."
                  className="w-full p-2 border rounded-lg"
                />
              )}
              <button
                onClick={() => toggleAnswerVisibility(index)}
                className="mt-2 text-blue-500 underline"
              >
                {showAnswers[index] ? "Hide Answer" : "Show Answer"}
              </button>
              {showAnswers[index] && (
                <div className="mt-2 p-2 bg-green-50 border border-green-500 rounded-lg">
                  <strong>Answer:</strong> {question.answer}
                </div>
              )}

            </div>
           
          </div>
        ))}
         { currentSectionIndex === quizData.length - 1 && <div className="text-center mt-6">
              <button
                onClick={handleComplete}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
              >
                Complete
              </button>
            </div>
            }
      </div>
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevSection}
          disabled={currentSectionIndex === 0}
          className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-lg ${currentSectionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          Previous
        </button>
        <button
          onClick={handleNextSection}
          disabled={currentSectionIndex === quizData.length - 1}
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${currentSectionIndex === quizData.length - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
