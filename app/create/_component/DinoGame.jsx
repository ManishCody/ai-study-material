"use client";
import React, { useRef, useEffect, useState } from "react";

const DinoGame = () => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const gameConfig = {
    character: { x: 50, y: 150, width: 30, height: 30, jumpHeight: 50 },
    gravity: 2,
    obstacles: [],
    obstacleWidth: 30,
    obstacleHeight: 30,
    obstacleSpeed: 3,
    characterImage: '', 
    obstacleImage: '',  // Placeholder for obstacle image
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const {
      character,
      gravity,
      obstacles,
      obstacleWidth,
      obstacleHeight,
      obstacleSpeed,
    } = gameConfig;

    let jump = false;
    let jumpCounter = 0;
    let animationFrameId;

    const loadAssets = () => {
      const characterImg = new Image();
      const obstacleImg = new Image();

      characterImg.src = "https://w7.pngwing.com/pngs/833/954/png-transparent-tyrannosaurus-dinosaur-triceratops-diplodocus-t-rex-terrestrial-animal-silhouette-velociraptor.png"; // Replace with your character image path
      obstacleImg.src = "https://chromedino.com/img/emojis/4-original.png";   // Replace with your obstacle image path

      gameConfig.characterImage = characterImg;
      gameConfig.obstacleImage = obstacleImg;
    };

    const handleKeyDown = (e) => {
      if (e.code === "Space" && !jump && !gameOver) {
        jump = true;
        jumpCounter = 0;
      }
    };

    const handleTouchStart = () => {
      if (!jump && !gameOver) {
        jump = true;
        jumpCounter = 0;
      }
    };

    const spawnObstacle = () => {
      const x = canvas.width;
      const y = canvas.height - obstacleHeight;
      obstacles.push({ x, y });
    };

    const updateGame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the character
      if (gameConfig.characterImage) {
        ctx.drawImage(
          gameConfig.characterImage,
          character.x,
          character.y,
          character.width,
          character.height
        );
      } else {
        ctx.fillStyle = "teal";
        ctx.fillRect(character.x, character.y, character.width, character.height);
      }

      // Handle jumping
      if (jump) {
        jumpCounter++;
        character.y -= gravity;
        if (jumpCounter > gameConfig.character.jumpHeight) {
          jump = false;
        }
      } else if (character.y < canvas.height - character.height) {
        character.y += gravity;
      }

      // Update and draw obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacleSpeed;

        if (gameConfig.obstacleImage) {
          ctx.drawImage(
            gameConfig.obstacleImage,
            obstacles[i].x,
            obstacles[i].y,
            obstacleWidth,
            obstacleHeight
          );
        } else {
          ctx.fillStyle = "red";
          ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacleWidth, obstacleHeight);
        }

        // Check for collisions
        if (
          character.x < obstacles[i].x + obstacleWidth &&
          character.x + character.width > obstacles[i].x &&
          character.y < obstacles[i].y + obstacleHeight &&
          character.y + character.height > obstacles[i].y
        ) {
          setGameOver(true);
          cancelAnimationFrame(animationFrameId);
          return;
        }

        // Remove obstacles that are off-screen
        if (obstacles[i].x + obstacleWidth < 0) {
          obstacles.splice(i, 1);
          setScore((prev) => prev + 1);
        }
      }
    };

    const loop = () => {
      updateGame();
      animationFrameId = requestAnimationFrame(loop);
    };

    // Start the game loop
    loadAssets();
    loop();

    // Spawn obstacles at regular intervals
    const obstacleInterval = setInterval(spawnObstacle, 2000);

    // Handle keyboard and touch input
    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("touchstart", handleTouchStart);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(obstacleInterval);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  const retryGame = () => {
    setGameOver(false);
    setScore(0);
    gameConfig.obstacles = [];
    gameConfig.character.y = 150;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-lg font-bold mb-2">
        {gameOver ? "Game Over!" : "Dino Jump Game"}
      </h2>
      {!gameOver &&<p className="text-gray-600">Score: {score}</p>}
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className={`border border-gray-300 ${gameOver ? "hidden" : ""}`}
      />
      {gameOver && (
        <div className="flex flex-col items-center">
          <p className="text-red-500 font-bold mb-4">You crashed!</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={retryGame}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default DinoGame;
