const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const paddleWidth = 10, paddleHeight = 100;
const ballRadius = 10;
let upPressed = false, downPressed = false;
let playerScore = 0, playerLives = 3;

const player = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, dy: 5 };
const computer = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, dy: 5 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: ballRadius, speed: 4, dx: 4, dy: 4 };

function drawPaddle(x, y, width, height) {
    context.fillStyle = "#FFF";
    context.fillRect(x, y, width, height);
}

function drawBall(x, y, radius) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = "#FFF";
    context.fill();
    context.closePath();
}

function movePaddle(paddle) {
    if (upPressed && paddle.y > 0) {
        paddle.y -= paddle.dy;
    } else if (downPressed && paddle.y < canvas.height - paddle.height) {
        paddle.y += paddle.dy;
    }
}

function moveComputerPaddle() {
    if (ball.y < computer.y + computer.height / 2) {
        computer.y -= computer.dy;
    } else if (ball.y > computer.y + computer.height / 2) {
        computer.y += computer.dy;
    }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    if (ball.x - ball.radius < player.x + player.width && ball.y > player.y && ball.y < player.y + player.height) {
        ball.dx *= -1;
        playerScore++;
        document.getElementById("score").innerText = "Score: " + playerScore;
    } else if (ball.x + ball.radius > computer.x && ball.y > computer.y && ball.y < computer.y + computer.height) {
        ball.dx *= -1;
    }

    if (ball.x - ball.radius < 0) {
        playerLives--;
        if (playerLives === 0) {
            document.getElementById("message").innerText = "Game Over";
            document.location.reload();
        } else {
            resetBall();
        }
    } else if (ball.x + ball.radius > canvas.width) {
        ball.dx *= -1;
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(player.x, player.y, player.width, player.height);
    drawPaddle(computer.x, computer.y, computer.width, computer.height);
    drawBall(ball.x, ball.y, ball.radius);
}

function update() {
    movePaddle(player);
    moveComputerPaddle();
    moveBall();
}

function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        upPressed = true;
    } else if (event.key === "ArrowDown") {
        downPressed = true;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowUp") {
        upPressed = false;
    } else if (event.key === "ArrowDown") {
        downPressed = false;
    }
});

gameLoop();

