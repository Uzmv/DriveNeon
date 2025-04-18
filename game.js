const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.6;
canvas.height = window.innerHeight;

const carImg = new Image();
carImg.src = "./assets/car.png";

const obstacleImg = new Image();
obstacleImg.src = "./assets/obstacle.png";

let car = { x: canvas.width / 2 - 25, y: canvas.height - 150, width: 50, height: 100 };
let obstacles = [];
let keys = {};
let score = 0;
let speed = 4;
let gameRunning = false;

document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("menu").style.display = "none";
  gameRunning = true;
  gameLoop();
});

function drawCar() {
  ctx.drawImage(carImg, car.x, car.y, car.width, car.height);
}

function drawObstacles() {
  obstacles.forEach(obs => {
    ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);
  });
}

function updateObstacles() {
  if (Math.random() < 0.02) {
    obstacles.push({
      x: Math.random() * (canvas.width - 60),
      y: -120,
      width: 50,
      height: 100
    });
  }
  obstacles.forEach(obs => {
    obs.y += speed;
  });
  obstacles = obstacles.filter(obs => obs.y < canvas.height);
}

function checkCollision() {
  return obstacles.some(obs => (
    car.x < obs.x + obs.width &&
    car.x + car.width > obs.x &&
    car.y < obs.y + obs.height &&
    car.y + car.height > obs.y
  ));
}

function updateDifficulty() {
  if (score % 100 === 0) speed += 0.2;
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCar();
  drawObstacles();
  updateObstacles();

  // Controls
  if (keys["ArrowLeft"] || keys["a"]) car.x -= 6;
  if (keys["ArrowRight"] || keys["d"]) car.x += 6;

  // Keep car inside road
  car.x = Math.max(0, Math.min(car.x, canvas.width - car.width));

  // Score and difficulty
  score++;
  updateDifficulty();

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  // Collision
  if (checkCollision()) {
    gameOver();
    return;
  }

  requestAnimationFrame(gameLoop);
}

function gameOver() {
  gameRunning = false;
  const highscore = parseInt(localStorage.getItem("carGameHighScore") || "0");
  if (score > highscore) {
    localStorage.setItem("carGameHighScore", score);
  }
  document.getElementById("highscore").textContent = localStorage.getItem("carGameHighScore");
  document.getElementById("menu").style.display = "block";
  score = 0;
  speed = 4;
  car.x = canvas.width / 2 - 25;
  obstacles = [];
}

document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// Mobile Touch Controls
canvas.addEventListener("touchstart", e => {
  const touchX = e.touches[0].clientX;
  if (touchX < canvas.width / 2) keys["a"] = true;
  else keys["d"] = true;
});

canvas.addEventListener("touchend", () => {
  keys["a"] = false;
  keys["d"] = false;
});
