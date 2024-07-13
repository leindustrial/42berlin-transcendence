document.addEventListener('DOMContentLoaded', function () {
    let gameState = 'start';
    let paddle_1, paddle_2, board, ball, score_1, score_2, message;
    let paddle_1_coord, paddle_2_coord, ball_coord, board_coord, paddle_common;
    let dx, dy, dxd, dyd;
    let player1Name = 'Player 1'; // Default names
    let player2Name = 'Player 2';
    let paddle1Velocity = 0, paddle2Velocity = 0;
    const paddleSpeed = 10;

    // Input fields and start button
    let player1Input = document.getElementById('player1NameInput');
    let player2Input = document.getElementById('player2NameInput');
    let startGameBtn = document.getElementById('startGameBtn');

    // Event listener for start button click
    startGameBtn.addEventListener('click', function() {
        if (player1Input.value && player2Input.value) {
            document.getElementById('player1Name').innerHTML = player1Input.value;
            document.getElementById('player2Name').innerHTML = player2Input.value;
            player1Name = player1Input.value;
            player2Name = player2Input.value;
            // Hide the name form
            document.getElementById('name_form').style.display = 'none';
            startGame();

        } else {
            alert('Please enter names for both players.');
        }
    });

    function startGame() {

        // Game initialization logic
        initializeElements();
        updatePaddlePositions();

        // Listen for Enter key to start the game
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                if (gameState === 'start' || gameState === 'stop') {
                    gameState = 'play';
                    message.textContent = 'Game Started';
                    resetBallPosition();
                    requestAnimationFrame(() => {
                        dx = Math.floor(Math.random() * 4) + 3;
                        dy = Math.floor(Math.random() * 4) + 3;
                        dxd = Math.floor(Math.random() * 2);
                        dyd = Math.floor(Math.random() * 2);
                        moveBall(dx, dy, dxd, dyd);
                    });
                }
            }
        });
    }

    function initializeElements() {
        paddle_1 = document.querySelector('.paddle_1');
        paddle_2 = document.querySelector('.paddle_2');
        board = document.querySelector('.board');
        ball = document.querySelector('.ball');
        score_1 = document.querySelector('.player_1_score');
        score_2 = document.querySelector('.player_2_score');
        message = document.querySelector('.message');
        paddle_1_coord = paddle_1.getBoundingClientRect();
        paddle_2_coord = paddle_2.getBoundingClientRect();
        ball_coord = ball.getBoundingClientRect();
        board_coord = board.getBoundingClientRect();
        paddle_common = document.querySelector('.paddle').getBoundingClientRect();

        dx = Math.floor(Math.random() * 4) + 3;
        dy = Math.floor(Math.random() * 4) + 3;
        dxd = Math.floor(Math.random() * 2);
        dyd = Math.floor(Math.random() * 2);
    }

    function resetScores() {
        score_1.innerHTML = '0';
        score_2.innerHTML = '0';
    }

    // function checkScores() {
    //     if (parseInt(score_1.innerHTML) >= 3 || parseInt(score_2.innerHTML) >= 3) {
    //         gameState = 'stop';
    //         resetScores(); // Reset the scores
    //         message.innerHTML = 'Game Over! Press Enter to Play Again';
    //         return true; // Indicate the game should stop
    //     }
    //     return false; // Indicate the game should continue
    // }
    function checkScores() {
        if (parseInt(score_1.innerHTML) >= 3) {
            displayWinner(player1Name);
            return true;
        } else if (parseInt(score_2.innerHTML) >= 3) {
            displayWinner(player2Name);
            return true;
        }
        return false;
    }

    function displayWinner(winnerName) {
        gameState = 'stop';
        winnerMessage.style.display = 'block';
        winnerMessage.querySelector('#winnerName').innerHTML = `${winnerName} wins!`;
        gameState = 'start';
        resetScores();
        resetBallPosition();
        message.innerHTML = 'Game Over! Press Enter to Play Again';
        // setTimeout(() => {
        //     winnerMessage.style.display = 'none';
        //     gameState = 'start';
        //     resetScores();
        //     resetBallPosition();
        //     message.innerHTML = 'Game Over! Press Enter to Play Again';
        // }, 1000); // Hide winner message after 1 second
    }

    function resetBallPosition() {
        ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
        ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
        ball_coord = ball.getBoundingClientRect();
    }

    function moveBall(dx, dy, dxd, dyd) {
        ball_coord = ball.getBoundingClientRect();

        if (ball_coord.top <= board_coord.top || ball_coord.bottom >= board_coord.bottom) {
            dyd = 1 - dyd; // Reverse vertical direction
        }

        if (ball_coord.left <= paddle_1_coord.right && ball_coord.top >= paddle_1_coord.top && ball_coord.bottom <= paddle_1_coord.bottom) {
            dxd = 1; // Move ball to the right
            dx = Math.floor(Math.random() * 4) + 3;
            dy = Math.floor(Math.random() * 4) + 3;
        }

        if (ball_coord.right >= paddle_2_coord.left && ball_coord.top >= paddle_2_coord.top && ball_coord.bottom <= paddle_2_coord.bottom) {
            dxd = 0; // Move ball to the left
            dx = Math.floor(Math.random() * 4) + 3;
            dy = Math.floor(Math.random() * 4) + 3;
        }

        if (ball_coord.left <= board_coord.left || ball_coord.right >= board_coord.right) {
            if (ball_coord.left <= board_coord.left) {
                score_2.innerHTML = +score_2.innerHTML + 1;
            } else {
                score_1.innerHTML = +score_1.innerHTML + 1;
            }
            if (checkScores()) return;
            gameState = 'reset';
            resetBallPosition();
            setTimeout(() => {
                gameState = 'play';
                moveBall(dx, dy, dxd, dyd);
            }, 1000);
            return;
        }

        if ((ball_coord.top <= board_coord.top && ball_coord.left <= board_coord.left) ||
            (ball_coord.top <= board_coord.top && ball_coord.right >= board_coord.right) ||
            (ball_coord.bottom >= board_coord.bottom && ball_coord.left <= board_coord.left) ||
            (ball_coord.bottom >= board_coord.bottom && ball_coord.right >= board_coord.right)) {
            gameState = 'stop';
            message.innerHTML = 'Game Over! Press Enter to Play Again';
            return;
        }

        ball.style.top = ball_coord.top + dy * (dyd === 0 ? -1 : 1) + 'px';
        ball.style.left = ball_coord.left + dx * (dxd === 0 ? -1 : 1) + 'px';

        requestAnimationFrame(() => {
            moveBall(dx, dy, dxd, dyd);
        });
    }

    function updatePaddlePositions() {
        paddle_1.style.top = Math.min(Math.max(board_coord.top, paddle_1_coord.top + paddle1Velocity), board_coord.bottom - paddle_1_coord.height) + 'px';
        paddle_2.style.top = Math.min(Math.max(board_coord.top, paddle_2_coord.top + paddle2Velocity), board_coord.bottom - paddle_2_coord.height) + 'px';

        paddle_1_coord = paddle_1.getBoundingClientRect();
        paddle_2_coord = paddle_2.getBoundingClientRect();

        requestAnimationFrame(updatePaddlePositions);
    }

    // function updatePlayerNames() {
    //     document.getElementById('player1Name').innerHTML = player1Name;
    //     document.getElementById('player2Name').innerHTML = player2Name;
    // }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            if (gameState === 'stop') {
                // Hide winner message and reset game state
                winnerMessage.style.display = 'none';
                gameState = 'start';
                resetScores();
            }
            if (gameState === 'start') {
                if (player1Input.value && player2Input.value) {
                    gameState = 'play';
                    message.innerHTML = 'Game Started';
                    resetBallPosition();
                    requestAnimationFrame(() => {
                        dx = Math.floor(Math.random() * 4) + 3;
                        dy = Math.floor(Math.random() * 4) + 3;
                        dxd = Math.floor(Math.random() * 2);
                        dyd = Math.floor(Math.random() * 2);
                        moveBall(dx, dy, dxd, dyd);
                    });
                    document.getElementById('name_form').style.display = 'none';
                    //nameForm.style.display = 'none';
                    winnerMessage.style.display = 'none';
                    setTimeout(() => {
                        message.innerHTML = '';
                    }, 1000);
                } else {
                    alert('Please enter names for both players.');
                }
            }
        }
        if (e.key === 'w') {
            if (gameState === 'play') {
                paddle1Velocity = -paddleSpeed;
            }
        }
        if (e.key === 's') {
            if (gameState === 'play') {
                paddle1Velocity = paddleSpeed;
            }
        }
        if (e.key === 'ArrowUp') {
            if (gameState === 'play') {
                paddle2Velocity = -paddleSpeed;
            }
        }
        if (e.key === 'ArrowDown') {
            if (gameState === 'play') {
                paddle2Velocity = paddleSpeed;
            }
        }
    });

    document.addEventListener('keyup', function(e) {
        if (e.key === 'w' || e.key === 's') {
            paddle1Velocity = 0;
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            paddle2Velocity = 0;
        }
    });

    initializeElements();
    updatePaddlePositions();
    updatePlayerNames();
});
