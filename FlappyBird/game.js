const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

let birdImage = new Image();
birdImage.src = 'ami.png'; // Replace with the path to your bird image
let jumpSound = new Audio('jumpSound.mp3');
let gameOverSound = new Audio('GameOver.mp3');
let bird = {
    x: 0,
    y: 0,
    width: 60, // Adjust width to fit your image size
    height: 60, // Adjust height to fit your image size
    gravity: 0.4,
    lift: -8,
    velocity: 0
};

let pipes = [];
let pipeWidth = 40;
let pipeGap = 200;
let frame = 0;
let score = 0;
let gameOver = false;
let gameStarted = false;
let resetTimeout = null;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bird.x = canvas.width / 4 - bird.width / 2; // Adjust bird's x position to be at 1/4th of canvas width
    bird.y = canvas.height / 2 - bird.height / 2;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawBird() {
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    context.fillStyle = 'green';
    pipes.forEach(pipe => {
        context.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        context.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

function drawScore() {
    context.fillStyle = 'white';
    context.font = '30px Arial';
    context.fillText(`Score: ${score}`, 10, 25);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        endGame();
    }
}

function updatePipes() {
    if (frame % 90 === 0) {
        let top = Math.random() * (canvas.height / 2);
        let bottom = canvas.height - top - pipeGap;
        pipes.push({ x: canvas.width, top: top, bottom: bottom, passed: false });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;

        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            score++;
            pipe.passed = true;
        }

        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
        }
    });

    pipes.forEach(pipe => {
        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
            endGame();
        }
    });
}

function resetGame() {
    bird.y = canvas.height / 2 - bird.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frame = 0;
    gameOver = false;
    gameStarted = false;
    console.log('Game reset');
}

function endGame() {
    gameOver = true;
    gameOverSound.play();
    if (!resetTimeout) {
        console.log('Game over');
        resetTimeout = setTimeout(() => {
            resetGame();
            resetTimeout = null;
        }, 3000); // 3 seconds delay before reset
    }
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (!gameStarted) {
            gameStarted = true;
            console.log('Game started');
        } else if (!gameOver) {
            bird.velocity = bird.lift;
            jumpSound.play();
            console.log('Bird jumps');
        } else if (gameOver && !resetTimeout) {
            resetGame();
        }
    }
});
// Adding touch support
canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    if (!gameStarted && countdown <= 0) {
        gameStarted = true;
        console.log('Game started');
    } else if (!gameOver && gameStarted) {
        bird.velocity = bird.lift;
        jumpSound.play(); // Play the jump sound
        console.log('Bird jumps');
    } else if (gameOver && !resetTimeout) {
        resetGame();
    }
});

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (gameStarted) {
        if (!gameOver) {
            updateBird();
            updatePipes();
            drawBird();
            drawPipes();
            drawScore();
            frame++;
        } else {
            context.fillStyle = 'white';
            context.font = '30px Arial';
            context.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2 - 20);
            context.fillText(`Score: ${score}`, canvas.width / 2 - 50, canvas.height / 2 + 20);
            context.fillText('Wait for 3 seconds to ', canvas.width / 2 - 140, canvas.height / 2 + 60);
            context.fillText('Restart', canvas.width / 2 - 50, canvas.height / 2 + 90);

        }
    } else {
        context.fillStyle = 'white';
        context.font = '30px Arial';
        context.fillText('TAP TO START', canvas.width / 2 - 140, canvas.height / 2);
    }

    requestAnimationFrame(gameLoop);
}

console.log('Starting game loop');
gameLoop();





