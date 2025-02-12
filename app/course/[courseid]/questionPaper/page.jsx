"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Spinner from '../../_components/Spinner';
import { motion } from "framer-motion"; // Importing motion from framer-motion
import { Loader2 } from "lucide-react";

const QuizPage = () => {
  const { courseid } = useParams();
  const [questionData, setQuestionData] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showAnswers, setShowAnswers] = useState({}); // Tracks visibility of answers
  const [loading, setLoading] = useState(true);
  const [Completed, setCompleted] = useState(0);
  const [isCompleteLoading, setIsCompletedLoading] = useState(false);
  const [question,setQuestion] = useState();

  const fetchQuestionPaper = async () => {
    try {
      const response = await axios.get(`/api/courses?courseid=${courseid}`);
      setCompleted(response?.data?.course?.Complete);
      setQuestion(response?.data?.course?.questions)
      setQuestionData(response?.data?.course?.questions?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseid) {
      fetchQuestionPaper();
    }
  }, [courseid]);

  if (loading) {
    return <Spinner size="large" color="blue" />;
  }

  const handleNextSection = () => {
    if (currentSectionIndex < questionData.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      setShowAnswers({}); // Reset answers visibility when moving to the next section
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
  };

  const handleComplete = async () => {
    const newTotalPercentage = Math.min(Completed + 20, 100).toFixed(2);

    try {
      setIsCompletedLoading(true);
      const response = await axios.patch(`/api/update-complete-progress?id=${courseid}`, {
        Complete: newTotalPercentage,
        isComplete: true,
        isQuestion: true,
      });

      if (response.status === 200) {
        fetchQuestionPaper();
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setIsCompletedLoading(false);
    }
  };

  if (!questionData.length) {
    return <div>Loading...</div>;
  }

  const currentSection = questionData[currentSectionIndex];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.h1
        className="text-3xl font-bold text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {currentSection.section_title}
      </motion.h1>
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {currentSection.questions.map((question, index) => (
          <motion.div
            key={index}
            className="p-4 border rounded-lg shadow-sm"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
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
            <motion.button
              onClick={() => toggleAnswerVisibility(index)}
              className="mt-2 text-blue-500 underline"
              whileHover={{ scale: 1.1 }}
            >
              {showAnswers[index] ? "Hide Answer" : "Show Answer"}
            </motion.button>
            {showAnswers[index] && (
              <div className="mt-2 p-2 bg-green-50 border border-green-500 rounded-lg">
                <strong>Answer:</strong> {question.answer}
              </div>
            )}
          </motion.div>
        ))}
        {currentSectionIndex === questionData.length - 1 && (
          <div className="text-center mt-6">
            <motion.button
              onClick={handleComplete}
              className={`px-4 py-2 mt-2 rounded-lg transition-colors duration-300 ${question.isComplete
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCompleteLoading ? <Loader2 className="animate-spin" /> : question.isComplete ? 'Completed'  : 'Complete'}
            </motion.button>
          </div>
        )}
      </motion.div>
      <div className="flex justify-between mt-6">
        <motion.button
          onClick={handlePrevSection}
          disabled={currentSectionIndex === 0}
          className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-lg ${currentSectionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          whileHover={{ scale: currentSectionIndex === 0 ? 1 : 1.05 }}
        >
          Previous
        </motion.button>
        <motion.button
          onClick={handleNextSection}
          disabled={currentSectionIndex === questionData.length - 1}
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${currentSectionIndex === questionData.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          whileHover={{ scale: currentSectionIndex === questionData.length - 1 ? 1 : 1.05 }}
        >
          Next
        </motion.button>
      </div>
    </div>
  );
};

export default QuizPage;
