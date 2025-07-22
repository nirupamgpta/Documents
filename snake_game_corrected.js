const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
let score = 0;
let level = 1;
let foodItems = [];
let direction;
let snake = [{ x: 9 * box, y: 10 * box }];

function placeFood(count) {
  foodItems = [];
  for (let i = 0; i < count; i++) {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box,
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    foodItems.push(newFood);
  }
}

function draw() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#00ffcc" : "#4caf50";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "#ff007f";
  foodItems.forEach(food => {
    ctx.fillRect(food.x, food.y, box, box);
  });

  // Calculate new head position
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;

  let newHead = { x: headX, y: headY };

  // FIXED: Check collisions BEFORE modifying the snake
  if (
    headX < 0 || headY < 0 || headX >= canvas.width || headY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert("💀 Game Over. Refresh to play again!");
    return; // Exit the function to prevent further execution
  }

  // Add new head first
  snake.unshift(newHead);

  // Check for food collision
  let foodEaten = false;
  for (let i = foodItems.length - 1; i >= 0; i--) {
    if (headX === foodItems[i].x && headY === foodItems[i].y) {
      score++;
      foodItems.splice(i, 1);
      document.getElementById("score").textContent = score;
      foodEaten = true;

      let newLevel = Math.floor(score / 5) + 1;
      if (newLevel !== level) {
        level = newLevel;
        document.getElementById("level").textContent = level;
        placeFood(level);
      }
      break; // Only eat one food item per move
    }
  }

  // FIXED: Only remove tail if no food was eaten
  if (!foodEaten) {
    snake.pop();
  }

  // Ensure there's always food on the board
  if (foodItems.length === 0) {
    placeFood(level);
  }
}

function collision(head, body) {
  return body.some(part => part.x === head.x && part.y === head.y);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

placeFood(level);
const game = setInterval(draw, 150);