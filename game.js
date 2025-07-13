const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PADDLE_SPEED = 7;
const BALL_SPEED = 7;
const AI_SPEED = 4;

// Game objects
let leftPaddle = {
  x: 0 + 10,
  y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT
};

let rightPaddle = {
  x: WIDTH - PADDLE_WIDTH - 10,
  y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT
};

let ball = {
  x: WIDTH / 2 - BALL_SIZE / 2,
  y: HEIGHT / 2 - BALL_SIZE / 2,
  size: BALL_SIZE,
  dx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
  dy: BALL_SPEED * (Math.random() * 2 - 1)
};

let playerScore = 0;
let aiScore = 0;

// Mouse control for left paddle
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  leftPaddle.y = mouseY - leftPaddle.height / 2;
  // Clamp paddle
  leftPaddle.y = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, leftPaddle.y));
});

// Game functions
function resetBall() {
  ball.x = WIDTH / 2 - BALL_SIZE / 2;
  ball.y = HEIGHT / 2 - BALL_SIZE / 2;
  ball.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  ball.dy = BALL_SPEED * (Math.random() * 2 - 1);
}

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = "32px Arial";
  ctx.fillText(text, x, y);
}

function draw() {
  // Clear
  drawRect(0, 0, WIDTH, HEIGHT, "#222");
  // Net
  for (let i = 20; i < HEIGHT; i += 40) {
    drawRect(WIDTH / 2 - 2, i, 4, 24, "#444");
  }
  // Paddles
  drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, "#eee");
  drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, "#eee");
  // Ball
  drawCircle(ball.x + BALL_SIZE / 2, ball.y + BALL_SIZE / 2, BALL_SIZE / 2, "#0af");
  // Scores
  drawText(playerScore, WIDTH / 2 - 60, 50, "#eee");
  drawText(aiScore, WIDTH / 2 + 30, 50, "#eee");
}

function collision(paddle, ball) {
  // AABB collision
  return ball.x < paddle.x + paddle.width &&
         ball.x + ball.size > paddle.x &&
         ball.y < paddle.y + paddle.height &&
         ball.y + ball.size > paddle.y;
}

function update() {
  // Ball movement
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball collisions with top/bottom
  if (ball.y <= 0 || ball.y + BALL_SIZE >= HEIGHT) {
    ball.dy = -ball.dy;
    ball.y = Math.max(0, Math.min(HEIGHT - BALL_SIZE, ball.y));
  }

  // Ball collision with left paddle
  if (collision(leftPaddle, ball)) {
    ball.dx = Math.abs(ball.dx);
    // Add some "spin"
    let hitPos = (ball.y + BALL_SIZE / 2 - (leftPaddle.y + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ball.dy = BALL_SPEED * hitPos;
  }

  // Ball collision with right paddle
  if (collision(rightPaddle, ball)) {
    ball.dx = -Math.abs(ball.dx);
    // Add some "spin"
    let hitPos = (ball.y + BALL_SIZE / 2 - (rightPaddle.y + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ball.dy = BALL_SPEED * hitPos;
  }

  // Score check
  if (ball.x < 0) {
    aiScore++;
    resetBall();
  } else if (ball.x + BALL_SIZE > WIDTH) {
    playerScore++;
    resetBall();
  }

  // AI paddle movement (tracks ball, but limited speed)
  let target = ball.y - (rightPaddle.height / 2 - ball.size / 2);
  if (rightPaddle.y < target) {
    rightPaddle.y += AI_SPEED;
  } else if (rightPaddle.y > target) {
    rightPaddle.y -= AI_SPEED;
  }
  rightPaddle.y = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, rightPaddle.y));
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();