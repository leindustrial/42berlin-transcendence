export function offlineAI_handler() {
	const offlineAIHtml = `
    <style>
        canvas {
            display: block;
            margin: auto;
            background-color: #000;
            position: relative;
            top: 52px;
        }
    </style>
    <h3 class="player_name_off" id="name1_ai">🤖 ${AI}</h3>
    <h3 class="player_name_off" id="name2_ai">${HUMAN}</h3>
    <canvas id="pongCanvas" width="900" height="600">
    </canvas>
`
    setElementinnerHTML(document.getElementById('offline-ai'), offlineAIHtml);
	showElement(document.getElementById('offline-ai'));

    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');

    // Paddle and ball dimensions
    let paddleWidth = 10, paddleHeight = 100, ballSize = 15;

    // Initial positions
    let paddle1Y = (canvas.height - paddleHeight) / 2;
    let paddle2Y = (canvas.height - paddleHeight) / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 7;
    let ballSpeedY = 7;
    let gamestate = "stop";
    let gameStarted = false;
    let score1 = 0;
    let score2 = 0;
    let endScore = 1;
    let upPressed = false;
    let downPressed = false;
    let paddleSpeed = 6.5;

    function drawRect(x, y, width, height, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }

    function drawCircle(x, y, radius, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.fill();
    }

    function movePaddles() {
        // AI controls the left paddle
        if (ballSpeedX < 0 && ballX < canvas.width / 2 + (canvas.width / 2) / 2) {
            if (ballY > paddle1Y + paddleHeight / 2) {
                paddle1Y += paddleSpeed;
            } else if (ballY < paddle1Y + paddleHeight / 2) {
                paddle1Y -= paddleSpeed;
            }
        }

        // Player controls the right paddle
        if (upPressed && paddle2Y > 0) {
            paddle2Y -= 7;
        } else if (downPressed && paddle2Y < canvas.height - paddleHeight) {
            paddle2Y += 7;
        }

    }

    function moveBall() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Ball collision with top and bottom
        if (ballY <= 0 || ballY >= canvas.height) {
            ballSpeedY = -ballSpeedY;
        }

        // Ball collision with paddles
        if (ballX <= paddleWidth) {
            if (ballY >= paddle1Y && ballY <= paddle1Y + paddleHeight) {
                ballSpeedX = -ballSpeedX;
            } else {
                score2++;
                if (score2 !== endScore)
                    resetBall();
            }
        }

        if (ballX >= canvas.width - paddleWidth) {
            if (ballY >= paddle2Y && ballY <= paddle2Y + paddleHeight) {
                ballSpeedX = -ballSpeedX;
            } else {
                score1++;
                if (score1 !== endScore)
                    resetBall();
            }
        }
    }

    function checkScores() {
        if (score1 >= endScore || score2 >= endScore) {
            // Draw the game over message
            ctx.fillStyle = "#7d7fac";
            ctx.font = 'normal 11pt monospace';
            ctx.textAlign = "center";
            ctx.fillText(`${GAME_OVER}`.toUpperCase(), canvas.width / 2, canvas.height / 2 + 60);
            
            // Draw the winner message
            if (score1 == endScore) {
                // AI won
                ctx.fillStyle = "#ff56d8";
                ctx.font = 'normal 15pt monospace';
                ctx.textAlign = "center";
                ctx.fillText(`${AI_WON}`.toUpperCase(), canvas.width / 2, canvas.height / 2 - 50);

            } else {
                // Human won
                ctx.fillStyle = "#ff56d8"; 
                ctx.font = 'normal 15pt monospace';
                ctx.textAlign = "center";
                ctx.fillText(`${HUMAN_WON}`.toUpperCase(), canvas.width / 2, canvas.height / 2 - 50);

            }
            gamestate = "stop";
        }
    }
    

    function resetBall() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX;
    }

    function drawScores() {

        ctx.fillStyle = '#1faced';
        ctx.font = '30pt monospace';
        ctx.fillText(score1, 20, 40); // Draw left player (AI) score

        ctx.fillStyle = '#bf2bdd';
        ctx.fillText(score2, canvas.width - 20, 40); // Draw right player (You) score
    }

    function draw() {
        // Clear canvas
        drawRect(0, 0, canvas.width, canvas.height, '#fff');
        drawRect(2, 2, canvas.width - 4, canvas.height - 4, '#232222');


        // Draw paddles
        drawRect(10, paddle1Y, paddleWidth, paddleHeight, '#1faced');
        drawRect(canvas.width - paddleWidth - 10, paddle2Y, paddleWidth, paddleHeight, '#bf2bdd');

        // Draw ball
        drawCircle(ballX, ballY, ballSize, '#FFF');
        drawScores(); // Draw scores on the canvas
        checkScores();
    }

    function startMessage() {

        ctx.fillStyle = "#7d7fac";
        ctx.font = 'normal 11pt monospace';
        ctx.textAlign = "center";

        ctx.fillText(`${PRESS_ENTER}`.toUpperCase(), canvas.width / 2, canvas.height / 2 + 65);
    }
    

    function gameLoop() {
        if (gameStarted == false) {
            draw();
            startMessage();
        }
        if (gamestate == "start") {
            movePaddles();
            moveBall();
            draw();
        }
        requestAnimationFrame(gameLoop);
    }

    // Event listeners for player control
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            upPressed = true;
        } else if (e.key === 'ArrowDown') {
            downPressed = true;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp') {
            upPressed = false;
        } else if (e.key === 'ArrowDown') {
            downPressed = false;
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key == 'Escape' && gamestate == "start" && gameStarted == true && (score1 < endScore && score2 < endScore))
            gamestate = "stop";
        else if (e.key == 'Escape' && gamestate == "stop" && gameStarted == true && (score1 < endScore && score2 < endScore))
            gamestate = "start";
        else if (e.key == 'Enter' && gameStarted === false) {
            gameStarted = true;
            gamestate = "start";
        }
        else if (e.key == 'Enter' && gamestate == "stop" && gameStarted == true && (score1 == endScore || score2 == endScore)) {
            resetBall();
            gameStarted = false;
            score1 = 0;
            score2 = 0;

            paddle1Y = (canvas.height - paddleHeight) / 2;
            paddle2Y = (canvas.height - paddleHeight) / 2;
        }
    });

    gameLoop();
}
