document.addEventListener('DOMContentLoaded', function () {
    let gameState = 'start';
    let paddle_1, paddle_2, board, ball, score_1, score_2, message;
    let paddle_1_coord, paddle_2_coord, ball_coord, board_coord, paddle_common;
    let dx, dy, dxd, dyd;

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

    function checkScores() {
        if (parseInt(score_1.innerHTML) >= 3 || parseInt(score_2.innerHTML) >= 3) {
            gameState = 'stop';
            resetScores(); // Reset the scores
            message.innerHTML = 'Game Over! Press Enter to Play Again';
            message.style.left = '30vw'; // Adjust message position if needed
            return true; // Indicate the game should stop
        }
        return false; // Indicate the game should continue
    }


    function resetBallPosition() {
        ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
        ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
        ball_coord = ball.getBoundingClientRect();
    }

    function moveBall(dx, dy, dxd, dyd) {
        if (ball_coord.top <= board_coord.top) {
            dyd = 1;
        }
        if (ball_coord.bottom >= board_coord.bottom) {
            dyd = 0;
        }
        if (ball_coord.left <= paddle_1_coord.right && ball_coord.top >= paddle_1_coord.top && ball_coord.bottom <= paddle_1_coord.bottom) {
            dxd = 1;
            dx = Math.floor(Math.random() * 4) + 3;
            dy = Math.floor(Math.random() * 4) + 3;
        }
        if (ball_coord.right >= paddle_2_coord.left && ball_coord.top >= paddle_2_coord.top && ball_coord.bottom <= paddle_2_coord.bottom) {
            dxd = 0;
            dx = Math.floor(Math.random() * 4) + 3;
            dy = Math.floor(Math.random() * 4) + 3;
        }
        if (ball_coord.left <= board_coord.left || ball_coord.right >= board_coord.right) {
            if (ball_coord.left <= board_coord.left) {
                score_2.innerHTML = +score_2.innerHTML + 1;
            } else {
                score_1.innerHTML = +score_1.innerHTML + 1;
            }
            if (checkScores()) return; // Check if game should stop
            gameState = 'start';
            resetBallPosition();
            message.innerHTML = 'Press Enter to Play';
            message.style.left = '38vw';
            return;
        }
        ball.style.top = ball_coord.top + dy * (dyd == 0 ? -1 : 1) + 'px';
        ball.style.left = ball_coord.left + dx * (dxd == 0 ? -1 : 1) + 'px';
        ball_coord = ball.getBoundingClientRect();
        requestAnimationFrame(() => {
            moveBall(dx, dy, dxd, dyd);
        });
    }

    initializeElements(); document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            if (gameState === 'start' || gameState === 'stop') { // Modified to handle 'stop' state
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
            }
        }
        if (gameState === 'play') {
            if (e.key === 'w') {
                paddle_1.style.top = Math.max(board_coord.top, paddle_1_coord.top - window.innerHeight * 0.06) + 'px';
                paddle_1_coord = paddle_1.getBoundingClientRect();
            }
            if (e.key === 's') {
                paddle_1.style.top = Math.min(board_coord.bottom - paddle_common.height, paddle_1_coord.top + window.innerHeight * 0.06) + 'px';
                paddle_1_coord = paddle_1.getBoundingClientRect();
            }
            if (e.key === 'ArrowUp') {
                paddle_2.style.top = Math.max(board_coord.top, paddle_2_coord.top - window.innerHeight * 0.1) + 'px';
                paddle_2_coord = paddle_2.getBoundingClientRect();
            }
            if (e.key === 'ArrowDown') {
                paddle_2.style.top = Math.min(board_coord.bottom - paddle_common.height, paddle_2_coord.top + window.innerHeight * 0.1) + 'px';
                paddle_2_coord = paddle_2.getBoundingClientRect();
            }
        }
    });

});
