document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    // Load images
    const slovakFlag = new Image();
    slovakFlag.src = "../images/slovak-flag.png";

    const austriaHungaryFlag = new Image();
    austriaHungaryFlag.src = "../images/austria-hungary-flag.png";

    const church = new Image();
    church.src = "../images/church.png";

    // Player properties
    let player = {
        x: 50,
        y: 300,
        width: 50,
        height: 30,
        speed: 4,
        dy: 0,
        gravity: 0.5,
        jumpPower: -10,
        grounded: false
    };

    // Chaser properties
    let chaser = {
        x: -200, // Starts off-screen
        y: 250,
        width: 120,
        height: 70,
        speed: 0
    };

    let gameOver = false;
    let reachedGoal = false;
    let keys = {};

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
