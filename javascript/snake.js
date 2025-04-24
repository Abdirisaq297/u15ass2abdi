window.onload = function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const snakeSize = 20; // Size of each block on the grid
    let snake = [{ x: 100, y: 100 }];
    let direction = 'right';
    let food = { x: 200, y: 200 };
    let score = 0;
    let gameOver = false;

    // Enemy that chases the snake
    let enemy = { x: 300, y: 300 };

    // Game helpers:
    // enemyMoveCounter controls the frequency of enemy movement (enemy moves every 5 loops)
    let enemyMoveCounter = 0;
    // damageCooldown prevents rapid repeated collisions by adding a brief delay (in game loops)
    let damageCooldown = 0;
    // playerHits counts how many times the enemy has hit the player; 3 hits mean game over
    let playerHits = 0;

    // Listen for key presses to control the snake
    document.addEventListener("keydown", changeDirection);

    // Draw the snake on the canvas
    function drawSnake() {
        ctx.fillStyle = "#00F"; // Blue color for the snake
        snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
        });
    }

    // Draw the food on the canvas
    function drawFood() {
        ctx.fillStyle = "#F00"; // Red color for food
        ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
    }

    // Draw the enemy on the canvas
    function drawEnemy() {
        if (!enemy) return;
        ctx.fillStyle = "#0F0"; // Green color for the enemy
        ctx.fillRect(enemy.x, enemy.y, snakeSize, snakeSize);
    }

    // Generate a random grid position for the food
    function generateFood() {
        food.x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
        food.y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
    }

    // Change the snake’s direction based on arrow key input
    function changeDirection(event) {
        if (event.key === "ArrowUp" && direction !== "down") direction = "up";
        if (event.key === "ArrowDown" && direction !== "up") direction = "down";
        if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
        if (event.key === "ArrowRight" && direction !== "left") direction = "right";
    }

    // Move the snake in the current direction
    function moveSnake() {
        let head = { ...snake[0] };

        if (direction === "up") head.y -= snakeSize;
        if (direction === "down") head.y += snakeSize;
        if (direction === "left") head.x -= snakeSize;
        if (direction === "right") head.x += snakeSize;

        snake.unshift(head); // Add the new head position

        // Check for food collision: increase score and generate a new food position
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            generateFood();
        } else {
            snake.pop(); // Remove the tail if no food is eaten
        }
    }

    // Move the enemy toward the snake's head position
    function moveEnemy() {
        if (!enemy) return;
        const target = snake[0];

        // Move one block in the x-direction toward the snake's head
        if (enemy.x < target.x) {
            enemy.x += snakeSize;
        } else if (enemy.x > target.x) {
            enemy.x -= snakeSize;
        }

        // Move one block in the y-direction toward the snake's head
        if (enemy.y < target.y) {
            enemy.y += snakeSize;
        } else if (enemy.y > target.y) {
            enemy.y -= snakeSize;
        }
    }

    // Check collisions with walls, itself, and the enemy hit count
    function checkCollision() {
        const head = snake[0];

        // Check for collision with walls
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            gameOver = true;
        }

        // Check for collision with the snake's own body
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver = true;
            }
        }

        // Check collision with the enemy: apply damage if the cooldown has expired
        if (enemy && head.x === enemy.x && head.y === enemy.y) {
            if (damageCooldown === 0) {
                playerHits++;
                damageCooldown = 3; // Set a cooldown lasting 3 game loops to avoid multiple hits at once

                // If the enemy has attacked three times, the player dies
                if (playerHits >= 3) {
                    gameOver = true;
                }
            }
        }
    }

    // Display score and the player's hit count
    function drawScore() {
        document.getElementById("score").textContent = `Score: ${score} | Hits: ${playerHits} / 3`;
    }

    // Main game loop: update positions, check collisions, then redraw the canvas
    function gameLoop() {
        // Reduce damage cooldown if it's active
        if (damageCooldown > 0) {
            damageCooldown--;
        }

        moveSnake();

        // Slow enemy movement: only move the enemy every fifth game loop iteration
        if (enemy && enemyMoveCounter === 0) {
            moveEnemy();
        }
        enemyMoveCounter = (enemyMoveCounter + 1) % 5;

        checkCollision();

        // Clear the canvas and redraw elements
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
        drawFood();
        drawEnemy();
        drawScore();

        if (!gameOver) {
            setTimeout(gameLoop, 100); // Continue the game loop
        } else {
            ctx.fillStyle = "red";
            ctx.font = "30px Arial";
            ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
        }
    }

    // Start the game loop
    gameLoop();
};

