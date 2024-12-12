"use client"
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FlipCard from 'react-card-flip';
import Spinner from '../../_components/Spinner';

const FlashcardPage = () => {
  const { courseid } = useParams();
  const [flashcardData, setFlashcardData] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const totalChapters = flashcardData.length;
  const progressPercentage = ((currentChapterIndex + 1) / totalChapters) * 100;
  const [loading, setLoading] = useState(true);
  const [flipPageWidth, setFlipPageWidth] = useState("");

    useEffect(() => {
    if (window.innerWidth > 1450) {
                    setFlipPageWidth("500");
                } else {
                    setFlipPageWidth("300px");
                }
    }, []);

  useEffect(() => {
    if (courseid) {
      const fetchFlashcardData = async () => {
        try {
          const response = await axios.get(`/api/courses?courseid=${courseid}`);
          setFlashcardData(response?.data?.course?.flashcards?.data[0]?.flashcards);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching flashcard data:', error);
          setLoading(false);
        }
      };

      fetchFlashcardData();
    }
  }, [courseid]);

  const handleNext = () => {
    if (currentChapterIndex < totalChapters - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleComplete = () => {
    const currentPercentage = parseFloat(localStorage.getItem(courseid)) || 0;
    const newTotalPercentage = Math.min(currentPercentage + 20, 100).toFixed(2);

    localStorage.setItem(courseid, newTotalPercentage);

  };

  if (loading) {
    return <Spinner size="large" color="blue" />;
  }

  const getRandomColor = () => {
    const colors = ['#FFD700', '#FF6347', '#3CB371', '#1E90FF', '#DA70D6'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className='mx-auto min-h-screen px-3 md:px-10 mt-5' >
      {flashcardData.length > 0 ? (
        <>
          <h1 className='text-2xl text-center'>Flashcard's</h1>
          <div className="flex mb-4 justify-center items-center gap-5 mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentChapterIndex === 0}
              className={`px-2 py-1 rounded-lg font-medium ${currentChapterIndex === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300'
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
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300'
                }`}
            >
              Next
            </button>
          </div>
          <div className="flashcard flex flex-col gap-3 justify-center items-center">
            <div className=''>
              <FlipCard
                isFlipped={isFlipped}
                flipDirection="horizontal"
                style={{ width: '370px', height: '600px' }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div
                  className={`flashcard-front flex justify-center  items-center p-4 w-full h-full rounded-lg shadow-md bg-gray-600`}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <p className="text-white text-center text-2xl ">{flashcardData[currentChapterIndex]?.front}</p>
                </div>
                <div
                  className={`flashcard-back flex justify-center items-center p-4 w-full h-full rounded-lg shadow-md bg-gray-600`}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <p className="text-white text-center text-2xl">{flashcardData[currentChapterIndex]?.back}</p>
                </div>
              </FlipCard>
            </div>
            {currentChapterIndex === totalChapters - 1 && (
              <div className="text-center mt-6">
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                >
                  Complete
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div><Spinner /></div>
      )}
    </div>
  );
};

export default FlashcardPage;
