export function offlineGame_handler() {
	const offline1x1Html = `
		<div id="offline-1x1">
            <div class="container">
                <div class="container-fluid">
                    <div class="row justify-content-center align-items-center">
                        <div class="col-auto">
                            <div id="player_form_1x1">
                                <input type="text" class="form-control" id="input1_1x1" placeholder="Player 1 name" required maxlength="15">
                                <input type="text" class="form-control" id="input2_1x1" placeholder="Player 2 name" required maxlength="15">
                                <button id="startGameBtn_1x1" class="btn btn-primary offline-1x1">Start Game</button>
                            </div>
                            <div class="board_1x1" id="board_1x1">
                                <div class='ball_1x1' id="ball_1x1"></div>
                                <div class="paddle_off" id="paddle1_1x1"></div>
                                <div class="paddle_off" id="paddle2_1x1"></div>
                                <h3 class="scores_off" id="score1_1x1">0</h3>
                                <h3 class="scores_off" id="score2_1x1">0</h3>
                                <h3 class="player_name_off" id="name1_1x1">Player 1</h3>
                                <h3 class="player_name_off" id="name2_1x1">Player 2</h3>
                                <div id="winnerMessage_1x1">
                                    <h2 id="winnerName_1x1">Winner!</h2>
                                </div>
                                <p class="text-center"><h3 class="message" id="message_1x1" >Press Enter to Play</h3></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
	`
    setElementinnerHTML(document.getElementById('game-place'), offline1x1Html);
	showElement(document.getElementById('game-place'));

        
    let gameState_1x1;
    let input1_1x1 = document.getElementById('input1_1x1');
    let input2_1x1 = document.getElementById('input2_1x1');
    let name1_1x1 = document.getElementById('name1_1x1');
    let name2_1x1 = document.getElementById('name2_1x1');
    let message_1x1 = document.getElementById('message_1x1');
    let winnerMessage_1x1 = document.getElementById('winnerMessage_1x1');
    let winnerName_1x1 = document.getElementById('winnerName_1x1');
    let startGameBtn_1x1 = document.getElementById('startGameBtn_1x1');
    let score1_1x1 = document.getElementById('score1_1x1');
    let score2_1x1 = document.getElementById('score2_1x1');
    let board_1x1 = document.getElementById('board_1x1');
    let ball_1x1 = document.getElementById('ball_1x1');
    let paddle1_1x1 = document.getElementById('paddle1_1x1');
    let paddle2_1x1 = document.getElementById('paddle2_1x1');

    let paddle1_coord_1x1, paddle2_coord_1x1, paddle_common_1x1, ball_coord_1x1, board_coord_1x1;

    const paddleSpeed = 3;
    let velocity1_1x1 = 0, velocity2_1x1 = 0;

    let dx, dy, dxd, dyd;

    function initializeGameElements_1x1() {
        ball_coord_1x1 = ball_1x1.getBoundingClientRect();
        board_coord_1x1 = board_1x1.getBoundingClientRect();
        paddle1_coord_1x1 = paddle1_1x1.getBoundingClientRect();
        paddle2_coord_1x1 = paddle2_1x1.getBoundingClientRect();
        paddle_common_1x1 = document.querySelector('.paddle_off').getBoundingClientRect();

        dx = Math.floor(Math.random() * 4) + 3;
        dy = Math.floor(Math.random() * 4) + 3;
        dxd = Math.floor(Math.random() * 2);
        dyd = Math.floor(Math.random() * 2);

        ball_1x1.style.top = board_coord_1x1.top + (board_coord_1x1.height / 2) - (ball_coord_1x1.height / 2) + 'px';
        ball_1x1.style.left = board_coord_1x1.left + (board_coord_1x1.width / 2) - (ball_coord_1x1.width / 2) + 'px';
    }

    function updatePaddlePositions_1x1() {

        paddle1_1x1.style.top = Math.min(Math.max(board_coord_1x1.top, paddle1_coord_1x1.top + velocity1_1x1), board_coord_1x1.bottom - paddle1_coord_1x1.height) + 'px';
        paddle2_1x1.style.top = Math.min(Math.max(board_coord_1x1.top, paddle2_coord_1x1.top + velocity2_1x1), board_coord_1x1.bottom - paddle2_coord_1x1.height) + 'px';

        paddle1_coord_1x1 = paddle1_1x1.getBoundingClientRect();
        paddle2_coord_1x1 = paddle2_1x1.getBoundingClientRect();

        requestAnimationFrame(updatePaddlePositions_1x1);

    }

    function resetBallPosition_1x1() {
        ball_1x1.style.top = board_coord_1x1.top + (board_coord_1x1.height / 2) - (ball_coord_1x1.height / 2) + 'px';
        ball_1x1.style.left = board_coord_1x1.left + (board_coord_1x1.width / 2) - (ball_coord_1x1.width / 2) + 'px';   
        ball_coord_1x1 = ball_1x1.getBoundingClientRect();
    }

    function resetScores_1x1() {
        score1_1x1.innerHTML = '0';
        score2_1x1.innerHTML = '0';
    }

    function checkScores_1x1() {
        if (parseInt(score1_1x1.innerHTML) >= 3) {
            displayWinner_1x1(name1_1x1.textContent);
            return true;
        } else if (parseInt(score2_1x1.innerHTML) >= 3) {
            displayWinner_1x1(name2_1x1.textContent);
            return true;
        }
        return false;
    }

    function displayWinner_1x1(winnerName) {
        gameState_1x1 = 'stop';
        winnerName_1x1.innerHTML = `${winnerName} wins!`;
        winnerMessage_1x1.style.display = 'block';
        message_1x1.style.display = 'block';
        message_1x1.innerHTML = 'Game Over! Press Enter to Play Again';
        resetBallPosition_1x1();
        resetScores_1x1();
        gameState_1x1 = 'start';
    }

    function moveBall_1x1(dx, dy, dxd, dyd) {
        ball_coord_1x1 = ball_1x1.getBoundingClientRect();

        if (ball_coord_1x1.top <= board_coord_1x1.top || ball_coord_1x1.bottom >= board_coord_1x1.bottom) {
            dyd = 1 - dyd; // Reverse vertical direction
        }

        if (ball_coord_1x1.left <= paddle1_coord_1x1.right && ball_coord_1x1.top >= paddle1_coord_1x1.top && ball_coord_1x1.bottom <= paddle1_coord_1x1.bottom) {
            dxd = 1; // Move ball to the right
            dx = Math.floor(Math.random() * 4) + 3;
            dy = Math.floor(Math.random() * 4) + 3;
        }

        if (ball_coord_1x1.right >= paddle2_coord_1x1.left && ball_coord_1x1.top >= paddle2_coord_1x1.top && ball_coord_1x1.bottom <= paddle2_coord_1x1.bottom) {
            dxd = 0; // Move ball to the left
            dx = Math.floor(Math.random() * 4) + 3;
            dy = Math.floor(Math.random() * 4) + 3;
        }

        if (ball_coord_1x1.left <= board_coord_1x1.left || ball_coord_1x1.right >= board_coord_1x1.right) {
            if (ball_coord_1x1.left <= board_coord_1x1.left) {
                score2_1x1.innerHTML = +score2_1x1.innerHTML + 1;
            } else {
                score1_1x1.innerHTML = +score1_1x1.innerHTML + 1;
            }
            if (checkScores_1x1()) return;
            gameState_1x1 = 'reset';
            resetBallPosition_1x1();
            setTimeout(() => {
                gameState_1x1 = 'play';
                moveBall_1x1(dx, dy, dxd, dyd);
            }, 1000);
            return;
        }

        ball_1x1.style.top = ball_coord_1x1.top + dy * (dyd === 0 ? -1 : 1) + 'px';
        ball_1x1.style.left = ball_coord_1x1.left + dx * (dxd === 0 ? -1 : 1) + 'px';

        requestAnimationFrame(() => {
            moveBall_1x1(dx, dy, dxd, dyd);
        });
    }

    function startGame_1x1() {   
        console.log(gameState_1x1);
        message_1x1.style.display = 'block';
        winnerMessage_1x1.style.display = 'none';
        gameState_1x1 = 'play';
        message_1x1.innerHTML = 'Game Started';
        setTimeout(() => message_1x1.innerHTML = '', 1500);

        initializeGameElements_1x1();
        updatePaddlePositions_1x1();
        resetBallPosition_1x1();
        resetScores_1x1();
        moveBall_1x1(dx, dy, dxd, dyd);
    }

    startGameBtn_1x1.addEventListener('click', function () {
        if (input1_1x1.value === input2_1x1.value) {
            alert('Please enter different names for both players.');
        } else if (input1_1x1.value && input2_1x1.value) {
            document.getElementById('player_form_1x1').style.display = 'none';
            gameState_1x1 = 'start';
            name1_1x1.textContent = input1_1x1.value;
            name2_1x1.textContent = input2_1x1.value;
        } else {
            alert('Please enter names for both players.');
        }
    });
    
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && gameState_1x1 === 'start') startGame_1x1();
        if (e.key === 'w') velocity1_1x1 = gameState_1x1 === 'play' ? -paddleSpeed : 0;
        if (e.key === 's') velocity1_1x1 = gameState_1x1 === 'play' ? paddleSpeed : 0;
        if (e.key === 'ArrowUp') velocity2_1x1 = gameState_1x1 === 'play' ? -paddleSpeed : 0;
        if (e.key === 'ArrowDown') velocity2_1x1 = gameState_1x1 === 'play' ? paddleSpeed : 0;
    });

    document.addEventListener('keyup', function (e) {
        if (e.key === 'w' && gameState_1x1 === 'play' || e.key === 's' && gameState_1x1 === 'play') velocity1_1x1 = 0;
        if (e.key === 'ArrowUp' && gameState_1x1 === 'play' || e.key === 'ArrowDown'&& gameState_1x1 === 'play') velocity2_1x1 = 0;
    });

    // function offlineGameReset() {
    //     gameState_1x1 = 'begin';
    //     document.getElementById('player_form_1x1').style.display = 'block';
    //     input1_1x1.value = '';
    //     input2_1x1.value = '';
    //     name1_1x1.textContent = 'Player 1';
    //     name2_1x1.textContent = 'Player 2';
    //     message_1x1.style.display = 'block';
    //     message_1x1.innerHTML = 'Press Enter to Play';
    //     winnerMessage_1x1.style.display = 'none';
    //     initializeGameElements_1x1()
    //     resetScores_1x1();
    //     resetBallPosition_1x1();
    //     resetPaddlePositions_1x1();
    // }

    // function resetPaddlePositions_1x1() {

    //     paddle1_1x1.style.top = 360 + 'px';
    //     paddle2_1x1.style.top = 360 + 'px';

    //     paddle1_coord_1x1 = paddle1_1x1.getBoundingClientRect();
    //     paddle2_coord_1x1 = paddle2_1x1.getBoundingClientRect();
    // }
}