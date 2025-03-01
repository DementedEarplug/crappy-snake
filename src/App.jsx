import React, { useState, useEffect, useCallback } from 'react'

// Game constants
const GRID_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_FOOD = { x: 15, y: 15 }
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [food, setFood] = useState(INITIAL_FOOD)
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  // Handle key presses for snake direction
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (DIRECTIONS[e.key] && !isOppositeDirection(direction, DIRECTIONS[e.key])) {
        setDirection(DIRECTIONS[e.key])
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [direction])

  // Game loop and movement
  useEffect(() => {
    if (gameOver) return

    const moveSnake = () => {
      const newSnake = [...snake]
      const head = { 
        x: (newSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE, 
        y: (newSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE 
      }
      
      // Check for self-collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true)
        return
      }

      newSnake.unshift(head)

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setScore(score + 1)
        generateNewFood(newSnake)
      } else {
        newSnake.pop()
      }

      setSnake(newSnake)
    }

    const gameInterval = setInterval(moveSnake, 200)
    return () => clearInterval(gameInterval)
  }, [snake, direction, food, gameOver])

  // Generate new food that doesn't overlap with snake
  const generateNewFood = useCallback((currentSnake) => {
    let newFood
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (currentSnake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    ))
    setFood(newFood)
  }, [])

  // Check if directions are opposite
  const isOppositeDirection = (current, next) => {
    return current.x + next.x === 0 && current.y + next.y === 0
  }

  // Restart game
  const restartGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(INITIAL_FOOD)
    setDirection(DIRECTIONS.ArrowRight)
    setScore(0)
    setGameOver(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl mb-4">Snake Game</h1>
      <div className="text-xl mb-4">Score: {score}</div>
      
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center flex-col">
          <div className="text-4xl mb-4">Game Over!</div>
          <button 
            onClick={restartGame}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          >
            Restart Game
          </button>
        </div>
      )}

      <div 
        className={`grid grid-cols-game grid-rows-game gap-1 bg-gray-800 p-1 
        ${gameOver ? 'opacity-50' : ''}`}
        style={{ width: '400px', height: '400px' }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE
          const y = Math.floor(index / GRID_SIZE)
          
          const isSnake = snake.some(segment => segment.x === x && segment.y === y)
          const isHead = snake[0].x === x && snake[0].y === y
          const isFood = food.x === x && food.y === y

          return (
            <div 
              key={index} 
              className={`
                w-full h-full 
                ${isSnake ? (isHead ? 'bg-green-600' : 'bg-green-400') : ''}
                ${isFood ? 'bg-red-500' : ''}
                ${!isSnake && !isFood ? 'bg-gray-700' : ''}
              `}
            />
          )
        })}
      </div>
    </div>
  )
}

export default App
