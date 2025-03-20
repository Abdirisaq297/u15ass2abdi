document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Basket (player)
    const basket = {
        x: canvas.width / 2 - 40,
        y: canvas.height - 40,
        width: 80,
        height: 20,
        speed: 5
    };

    // Donations (falling items)
    let donations = [];
    const donationTypes = ["💰", "📚", "🥖"]; // Coins, books, food

    // Score
    let score = 0;
    let missed = 0;
    let gameRunning = true;

    function createDonation() {
        if (!gameRunning) return;
        const donation = {
            x: Math.random() * (canvas.width - 20),
            y: 0,
            width: 20,
            height: 20,
            type: donationTypes[Math.floor(Math.random() * donationTypes.length)],
            speed: Math.random() * 2 + 2
        };
        donations.push(donation);
    }

    function update() {
        if (!gameRunning) return;

        // Move basket
        if (keys["ArrowLeft"] && basket.x > 0) {
            basket.x -= basket.speed;
        }
        if (keys["ArrowRight"] && basket.x + basket.width < canvas.width) {
            basket.x += basket.speed;
        }

        // Move donations
        for (let i = 0; i < donations.length; i++) {
            donations[i].y += donations[i].speed;

            // Check if caught
            if (
                donations[i].y + donations[i].height >= basket.y &&
                donations[i].x + donations[i].width >= basket.x &&
                donations[i].x <= basket.x + basket.width
            ) {
                score += 10;
                donations.splice(i, 1);
                i--;
            }
            // Check if missed
            else if (donations[i].y > canvas.height) {
                missed++;
                donations.splice(i, 1);
                i--;
            }
        }

        // End game if too many are missed
        if (missed >= 5) {
            document.getElementById("message").innerText = "Game Over! You missed too many donations!";
            gameRunning = false;
        }

        document.getElementById("score").innerText = "Score: " + score;
        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw basket
        ctx.fillStyle = "brown";
        ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

        // Draw donations
        ctx.font = "20px Arial";
        for (let i = 0; i < donations.length; i++) {
            ctx.fillText(donations[i].type, donations[i].x, donations[i].y);
        }
    }

    function gameLoop() {
        if (gameRunning) {
            update();
            requestAnimationFrame(gameLoop);
        }
    }

    // Move basket
    let keys = {};
    document.addEventListener("keydown", (event) => keys[event.key] = true);
    document.addEventListener("keyup", (event) => keys[event.key] = false);

    // Create donations every second
    setInterval(createDonation, 1000);
    gameLoop();
});


    // Background music
    const backgroundMusic = document.getElementById("background-music");
    backgroundMusic.volume = 0.5;
    backgroundMusic.play();

    // Key event listeners
    document.addEventListener("keydown", (event) => keys[event.key] = true);
    document.addEventListener("keyup", (event) => keys[event.key] = false);

    function update() {
        if (gameOver || reachedGoal) return;

        // Move right
        if (keys["ArrowRight"]) {
            player.x += player.speed;
        }

        // Jump
        if (keys[" "] && player.grounded) {
            player.dy = player.jumpPower;
            player.grounded = false;
        }

        // Apply gravity
        player.dy += player.gravity;
        player.y += player.dy;

        // Prevent falling through the ground
        if (player.y >= 300) {
            player.y = 300;
            player.dy = 0;
            player.grounded = true;
        }

        // Start chaser when player reaches halfway
        if (player.x > 400) {
            chaser.speed = 2;
        }

        // Move chaser
        if (chaser.speed > 0) {
            chaser.x += chaser.speed;
        }

        // Check collision with chaser
        if (chaser.x + chaser.width > player.x && chaser.x < player.x + player.width) {
            gameOver = true;
            alert("You were caught! Try again.");
            location.reload();
        }

        // Check if player reaches the church
        if (player.x > 750) {
            reachedGoal = true;
            alert("You made it to the church! Slovakia is safe!");
            location.reload();
        }

        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw player (Slovak flag)
        ctx.drawImage(slovakFlag, player.x, player.y, player.width, player.height);

        // Draw chaser (Austria-Hungary flag)
        if (chaser.speed > 0) {
            ctx.drawImage(austriaHungaryFlag, chaser.x, chaser.y, chaser.width, chaser.height);
        }

        // Draw church at the goal
        ctx.drawImage(church, 750, 250, 50, 100);
    }

    function gameLoop() {
        update();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
