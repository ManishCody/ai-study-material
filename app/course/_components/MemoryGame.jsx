"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';

const CARDS = [
  '🌟', '🌙', '🌍', '🌈',
  '🦋', '🌺', '🍀', '🎨'
].flatMap(emoji => [emoji, emoji]);

const MemoryGame = () => {
  const [cards, setCards] = useState(() => 
    CARDS.sort(() => Math.random() - 0.5).map((content, index) => ({
      id: index,
      content,
      isFlipped: false,
      isMatched: false
    }))
  );
  
  const [selectedCards, setSelectedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);

  useEffect(() => {
    if (selectedCards.length === 2) {
      const [first, second] = selectedCards;
      setMoves(prev => prev + 1);
      
      if (cards[first].content === cards[second].content) {
        setCards(prev => prev.map((card, index) => 
          index === first || index === second
            ? { ...card, isMatched: true }
            : card
        ));
        setScore(prev => prev + 1);
        setSelectedCards([]);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((card, index) => 
            index === first || index === second
              ? { ...card, isFlipped: false }
              : card
          ));
          setSelectedCards([]);
        }, 1000);
      }
    }
  }, [selectedCards, cards]);

  useEffect(() => {
    if (score === CARDS.length / 2) {
      setIsGameComplete(true);
    }
  }, [score]);

  const handleCardClick = (index) => {
    if (
      selectedCards.length === 2 ||
      cards[index].isFlipped ||
      cards[index].isMatched
    ) return;

    setCards(prev => prev.map((card, i) => 
      i === index ? { ...card, isFlipped: true } : card
    ));
    
    setSelectedCards(prev => [...prev, index]);
  };

  const resetGame = () => {
    setCards(CARDS.sort(() => Math.random() - 0.5).map((content, index) => ({
      id: index,
      content,
      isFlipped: false,
      isMatched: false
    })));
    setSelectedCards([]);
    setScore(0);
    setMoves(0);
    setIsGameComplete(false);
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl w-[500px]">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          Memory Match
        </h1>
        <div className="flex justify-center gap-6 text-gray-600">
          <p>Score: {score}</p>
          <p>Moves: {moves}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className="aspect-square cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(index)}
          >
            <div className="relative w-full h-full">
              <AnimatePresence initial={false}>
                <motion.div
                  className={`absolute w-full h-full rounded-lg ${
                    card.isFlipped || card.isMatched
                      ? 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white'
                      : 'bg-gray-400'
                  } flex items-center justify-center text-3xl transform transition-all duration-300`}
                  initial={false}
                  animate={{
                    rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {(card.isFlipped || card.isMatched) && (
                    <span className="transform rotate-180">{card.content}</span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {isGameComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-green-600 mb-4">
            <Trophy className="w-6 h-6" />
            Congratulations!
          </div>
          <p className="text-gray-600 mb-4">
            You completed the game in {moves} moves!
          </p>
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            Play Again
          </button>
        </motion.div>
      )}

      {!isGameComplete && (
        <button
          onClick={resetGame}
          className="w-full mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Reset Game
        </button>
      )}
    </div>
  );
};

export default MemoryGame;