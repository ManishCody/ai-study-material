"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Spinner from "../../_components/Spinner";
import { motion } from 'framer-motion';
import { Loader2 } from "lucide-react";


const IncorrectAnswer = ({ question, selectedOption, correct_answer }) => {
    return (
        <div className="mb-3 p-4 border border-red-500 rounded-lg bg-red-50 shadow-md">
            <div className="flex gap-2">
                <p className="text-gray-800 font-semibold">Question:</p>
                <p className="text-gray-800 mb-2">{question}</p>
            </div>
            <div className="flex gap-2">
                <p className="text-red-500 font-semibold">Your Answer:</p>
                <p className="text-red-500 mb-2">{selectedOption}</p>
            </div>
            <div className="flex gap-2">
                <p className="text-green-500 font-semibold">Correct Answer:</p>
                <p className="text-green-500">{correct_answer}</p>
            </div>
        </div>
    );
};

const QuizPage = () => {
    const { courseid } = useParams();
    const [quizData, setQuizData] = useState([]);
    const [quiz, setQuiz] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [wrongAnswer, setWrongAnswer] = useState([]);
    const [loading, setLoading] = useState(true);
    const [Completed, setCompleted] = useState(0);
    const [isCompleteLoading,setIsCompletedLoading] = useState(false);

    const fetchQuizData = async () => {
        try {
            const response = await axios.get(`/api/courses?courseid=${courseid}`);
            setLoading(false);
            
            setCompleted(response?.data?.course?.Complete);
            setQuizData(response?.data?.course?.quizs|| []);
            setQuiz(response?.data?.course?.quizs?.data[0]?.questions || []);
        } catch (error) {
            console.error("Error fetching quiz data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (courseid) {
            fetchQuizData();
        }
    }, [courseid]);

    if (loading) {
        return <Spinner size="large" color="blue" />;
    }

    const handleNext = () => {
        if (selectedOption === quiz[currentQuestionIndex].correct_answer) {
            setScore(score + 1);
        } else {
            setWrongAnswer((prev) => [...prev, {
                ...quiz[currentQuestionIndex],
                selectedOption: selectedOption,
            },])

        }
        setSelectedOption(null);
        if (currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResult(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setSelectedOption(null);
        }
    };

    const progressPercentage =
        ((currentQuestionIndex + 1) / quiz.length) * 100;

    const handleComplete = async () => {
        const newTotalPercentage = Math.min(Completed + 20, 100).toFixed(2);

        try {
            setIsCompletedLoading(true);
            const response = await axios.patch(`/api/update-complete-progress?id=${courseid}`, {
                Complete: newTotalPercentage,
                isQuiz: true,
            });

            if (response.status === 200) {
                fetchQuizData();
            }
        } catch (error) {
            console.error("Error updating progress:", error);
        } finally {
            setIsCompletedLoading(false);
        }

    };

    return (
        <div className="p-6">
            <motion.h1
                className="text-3xl font-bold text-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                CSS Quiz
            </motion.h1>

            {quiz.length > 0 && !showResult ? (
                <>
                    <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <motion.div
                                className="bg-blue-600 h-4 rounded-full"
                                style={{ width: `${progressPercentage}%` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 0.5 }}
                            ></motion.div>
                        </div>
                        <motion.p
                            className="text-center mt-2 text-gray-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Question {currentQuestionIndex + 1} of {quiz.length}
                        </motion.p>
                    </div>

                    <motion.div
                        className="p-4 border rounded-lg shadow-md bg-gray-100"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-xl font-medium mb-4">
                            {quiz[currentQuestionIndex].question}
                        </h2>
                        <div className="space-y-2">
                            {quiz[currentQuestionIndex].options.map((option, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => setSelectedOption(option)}
                                    className={`block w-full px-4 py-2 rounded-lg border text-left ${selectedOption === option
                                        ? "bg-blue-500 text-white"
                                        : "bg-white hover:bg-gray-200"
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {option}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    <div className="flex justify-between mt-6">
                        <motion.button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className={`px-4 py-2 rounded-lg font-medium ${currentQuestionIndex === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                                }`}
                            whileHover={{ scale: currentQuestionIndex === 0 ? 1 : 1.05 }}
                            whileTap={{ scale: currentQuestionIndex === 0 ? 1 : 0.95 }}
                        >
                            Previous
                        </motion.button>

                        <motion.button
                            onClick={handleNext}
                            disabled={!selectedOption}
                            className={`px-4 py-2 rounded-lg font-medium ${!selectedOption
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                                }`}
                            whileHover={{ scale: !selectedOption ? 1 : 1.05 }}
                            whileTap={{ scale: !selectedOption ? 1 : 0.95 }}
                        >
                            {currentQuestionIndex === quiz.length - 1
                                ? "Submit"
                                : "Next"}
                        </motion.button>
                    </div>
                </>
            ) : (
                showResult && (
                    <motion.div
                        className="p-6 text-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
                        <p className="text-lg mb-6">
                            You scored {score} out of {quiz.length}.
                        </p>
                        <motion.button
                            onClick={() => {
                                setShowResult(false);
                                setCurrentQuestionIndex(0);
                                setScore(0);
                                setWrongAnswer([]);
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Retake Quiz
                        </motion.button>
                        {wrongAnswer?.length > 0 && (
                            <div className="text-left mt-6">
                                <h3 className="text-xl font-semibold mb-2">Incorrect Answers:</h3>
                                <ol className="space-y-4">
                                    {wrongAnswer?.map((question, index) => (
                                        <IncorrectAnswer
                                            key={index}
                                            question={question?.question}
                                            selectedOption={question?.selectedOption}
                                            correct_answer={question?.correct_answer}
                                        />
                                    ))}
                                </ol>
                            </div>
                        )}
                        <motion.button
                            onClick={handleComplete}
                            className={`px-4 py-2 mt-2 rounded-lg transition-colors duration-300 ${quizData.isComplete
                                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                    : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                            disabled={quizData.isComplete}
                        >
                           {isCompleteLoading ? <Loader2 className="animate-spin" /> : quizData.isComplete ? 'Completed':'Complete'}
                        </motion.button>

                    </motion.div>
                )
            )}
        </div>
    );
};

export default QuizPage;
