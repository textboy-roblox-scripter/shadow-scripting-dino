const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let dino = {
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  vy: 0,
  gravity: 1.5,
  jumpForce: -20,
  grounded: true
};

let cactus = {
  x: canvas.width,
  y: 160,
  width: 20,
  height: 40,
  speed: 6
};

let score = 0;
let gameOver = false;
let cycleSpeed = 0.002; // Controls day-night speed
let timeOfDay = 0; // 0 = day, 1 = night (loop 0 to 1)

function drawDayNightCycle() {
  // Gradient from light blue to dark blue
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  const bgColor = timeOfDay < 0.5
    ? `rgb(${255 - timeOfDay * 255}, ${255 - timeOfDay * 255}, 255)`
    : `rgb(${timeOfDay * 255}, ${timeOfDay * 255}, ${255})`;

  gradient.addColorStop(0, bgColor);
  gradient.addColorStop(1, 'black');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawDino() {
  ctx.fillStyle = "black";
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
}

function drawCactus() {
  ctx.fillStyle = timeOfDay < 0.5 ? "green" : "darkgreen";
  ctx.fillRect(cactus.x, cactus.y, cactus.width, cactus.height);
}

function detectCollision() {
  return (
    dino.x < cactus.x + cactus.width &&
    dino.x + dino.width > cactus.x &&
    dino.y < cactus.y + cactus.height &&
    dino.y + dino.height > cactus.y
  );
}

function update() {
  if (gameOver) return;

  // Update time of day
  timeOfDay += cycleSpeed;
  if (timeOfDay > 1) timeOfDay = 0; // Reset when we reach night

  // Draw Day/Night Cycle
  drawDayNightCycle();

  // Dino jump physics
  dino.vy += dino.gravity;
  dino.y += dino.vy;
  if (dino.y > 150) {
    dino.y = 150;
    dino.vy = 0;
    dino.grounded = true;
  }

  // Move cactus
  cactus.x -= cactus.speed;
  if (cactus.x < -cactus.width) {
    cactus.x = canvas.width + Math.random() * 200;
    score++;
  }

  // Collision
  if (detectCollision()) {
    gameOver = true;
    alert("Game Over! Score: " + score);
    location.reload();
  }

  drawDino();
  drawCactus();

  // Score
  ctx.font = "20px monospace";
  ctx.fillText("Score: " + score, 650, 30);

  requestAnimationFrame(update);
}

document.addEventListener("keydown", e => {
  if (e.code === "Space" && dino.grounded) {
    dino.vy = dino.jumpForce;
    dino.grounded = false;
  }
});

update();
