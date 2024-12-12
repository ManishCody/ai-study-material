"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Spinner from "../../_components/Spinner";

const QuizPage = () => {
    const { courseid } = useParams();
    const [quizData, setQuizData] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [wrongAnswer, setWrongAnswer] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (courseid) {
            const fetchQuizData = async () => {
                try {
                    const response = await axios.get(`/api/courses?courseid=${courseid}`);
                    setLoading(false);
                    setQuizData(response?.data?.course?.quizs?.data[0]?.questions || []);
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



    const handleNext = () => {
        if (selectedOption === quizData[currentQuestionIndex].correct_answer) {
            setScore(score + 1);
        } else {
            setWrongAnswer((prev) => [...prev, {
                ...quizData[currentQuestionIndex],
                selectedOption: selectedOption,
            },])
            console.log(wrongAnswer);

        }
        setSelectedOption(null);
        if (currentQuestionIndex < quizData.length - 1) {
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
        ((currentQuestionIndex + 1) / quizData.length) * 100;

    const handleComplete = () => {
        const currentPercentage = parseFloat(localStorage.getItem(courseid)) || 0;
        const newTotalPercentage = Math.min(currentPercentage + 20, 100).toFixed(2);

        localStorage.setItem(courseid, newTotalPercentage);

    };
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">CSS Quiz</h1>

            {quizData.length > 0 && !showResult ? (
                <>
                    <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-blue-600 h-4 rounded-full"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <p className="text-center mt-2 text-gray-600">
                            Question {currentQuestionIndex + 1} of {quizData.length}
                        </p>
                    </div>

                    <div className="p-4 border rounded-lg shadow-md bg-gray-100">
                        <h2 className="text-xl font-medium mb-4">
                            {quizData[currentQuestionIndex].question}
                        </h2>
                        <div className="space-y-2">
                            {quizData[currentQuestionIndex].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedOption(option)}
                                    className={`block w-full px-4 py-2 rounded-lg border text-left ${selectedOption === option
                                        ? "bg-blue-500 text-white"
                                        : "bg-white hover:bg-gray-200"
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className={`px-4 py-2 rounded-lg font-medium ${currentQuestionIndex === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                                }`}
                        >
                            Previous
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={!selectedOption}
                            className={`px-4 py-2 rounded-lg font-medium ${!selectedOption
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                                }`}
                        >
                            {currentQuestionIndex === quizData.length - 1
                                ? "Submit"
                                : "Next"}
                        </button>
                    </div>
                </>
            ) : (
                showResult && (
                    <div className="p-6 text-center">
                        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
                        <p className="text-lg mb-6">
                            You scored {score} out of {quizData.length}.
                        </p>
                        <button
                            onClick={() => {
                                setShowResult(false);
                                setCurrentQuestionIndex(0);
                                setScore(0);
                                setWrongAnswer([]);
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                        >
                            Retake Quiz
                        </button>
                        {wrongAnswer?.length > 0 && (
                            <div className="text-left">
                                <h3 className="text-xl font-semibold mb-2">Incorrect Answers:</h3>
                                <ol type="A" className="">
                                    {wrongAnswer?.map((question, index) => (
                                        <li key={index} className="mb-3">
                                            <p className="text-gray-800">
                                                <span className="font-semibold">Question:</span> {question?.question}
                                            </p>
                                            <p className="text-red-500">
                                                <span className="font-semibold">Your Answer:</span> {question?.selectedOption}
                                            </p>
                                            <p className="text-green-500">
                                                <span className="font-semibold">Correct Answer:</span> {question?.correct_answer}
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                        <button
                            onClick={handleComplete}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                        >
                            Complete
                        </button>
                    </div>
                )
            )}
        </div>
    );
};

export default QuizPage;
