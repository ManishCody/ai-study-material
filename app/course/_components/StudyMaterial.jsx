import Link from 'next/link';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const StudyMaterial = ({ courseid, materialsAvailability, setMaterialsAvailability, loadingKeys, setLoadingKeys, handelGenerate}) => {
  const materials = [
    { key: 'notes', title: 'Notes', description: 'Read notes to prepare for the exam.', image: '/notes.png' },
    { key: 'flashcard', title: 'Flashcards', description: 'Memorize with flipping flashcards.', image: '/study.png' },
    { key: 'quiz', title: 'Quiz', description: 'Test knowledge with quizzes.', image: '/quiz.png' },
    { key: 'questionPaper', title: 'Question & Answer', description: 'Practice with frequently asked questions.', image: '/Q&A.png' },
  ];

  const handleMaterialGenerate = async (key) => {
    setLoadingKeys((prev) => ({ ...prev, [key]: true })); // Start loading

    try {
      await handelGenerate(key);
      setMaterialsAvailability((prev) => ({
        ...prev,
        [key]: true, // Mark material as available
      }));
    } catch (error) {
      console.log(`Error generating ${key}:`, error);
    } finally {
      setLoadingKeys((prev) => ({ ...prev, [key]: false })); // Stop loading
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
      {materials.map((material) => {
        const isAvailable = materialsAvailability[material.key];
        const isLoading = loadingKeys[material.key];

        return (
          <motion.div
            key={material.key}
            className={`p-6 border rounded-lg shadow-md flex flex-col items-center space-y-4 ${
              isAvailable ? 'bg-white hover:shadow-lg' : 'bg-gray-200 text-gray-500'
            }`}
            whileHover={{ scale: isAvailable ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-bold text-lg">{material.title}</h3>
            <img src={material.image} alt={material.title} className="w-24 h-24 rounded-md" />
            <p className="text-center">{material.description}</p>

            {isAvailable ? (
              <Link className="w-full" href={`/course/${courseid}/${material.key}`}>
                <motion.button className="px-6 py-1 w-full rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                  View
                </motion.button>
              </Link>
            ) : (
              <button
                className={`px-6 py-1 w-full rounded-lg ${isLoading ? 'bg-blue-400' : 'bg-gray-400'}`}
                onClick={() => handleMaterialGenerate(material.key)}
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default StudyMaterial;


