window.onload = function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const snakeSize = 20; // Size of the snake blocks
    let snake = [{ x: 100, y: 100 }];
    let direction = 'right';
    let food = { x: 200, y: 200 };
    let score = 0;
    let gameOver = false;

    // Keydown event to control the snake
    document.addEventListener("keydown", changeDirection);

    // Draw the snake on the canvas
    function drawSnake() {
        ctx.fillStyle = "#00F"; // Snake color (Blue)
        snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
        });
    }

    // Draw the food (double cross)
    function drawFood() {
        ctx.fillStyle = "#F00"; // Food color (Red)
        ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
    }

    // Generate random position for the food
    function generateFood() {
        food.x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
        food.y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
    }

    // Change the direction of the snake
    function changeDirection(event) {
        if (event.key === "ArrowUp" && direction !== "down") direction = "up";
        if (event.key === "ArrowDown" && direction !== "up") direction = "down";
        if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
        if (event.key === "ArrowRight" && direction !== "left") direction = "right";
    }

    // Move the snake
    function moveSnake() {
        const head = { ...snake[0] };

        if (direction === "up") head.y -= snakeSize;
        if (direction === "down") head.y += snakeSize;
        if (direction === "left") head.x -= snakeSize;
        if (direction === "right") head.x += snakeSize;

        snake.unshift(head); // Add the new head to the snake

        // Check for food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            generateFood();
        } else {
            snake.pop(); // Remove the last segment if no food is eaten
        }
    }

    // Check if the snake collides with the walls or itself
    function checkCollision() {
        const head = snake[0];

        // Check if snake hits the wall
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            gameOver = true;
        }

        // Check if snake collides with itself
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver = true;
            }
        }
    }

    // Draw the score
    function drawScore() {
        document.getElementById("score").textContent = `Score: ${score}`;
    }

    // Main game loop
    function gameLoop() {
        if (gameOver) {
            ctx.fillStyle = "red";
            ctx.font = "30px Arial";
            ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        drawSnake();
        drawFood();
        moveSnake();
        checkCollision();
        drawScore();

        setTimeout(gameLoop, 100); // Call the game loop again after a short delay
    }

    // Start the game
    gameLoop();
};
