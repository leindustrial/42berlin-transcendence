// document.addEventListener('DOMContentLoaded', function () {
//     let gameState = 'begin';
//     let pl1_name = 'Player 1';
//     let pl2_name = 'Player 2';
//     let pl3_name = 'Player 3';
//     let pl4_name = 'Player 4';
//     let table_name1 = document.getElementById('table_name1');
//     let table_name2 = document.getElementById('table_name2');
//     let table_name3 = document.getElementById('table_name3');
//     let table_name4 = document.getElementById('table_name4');
//     let paddle_1, paddle_2, board, ball, score_1, score_2, message;
//     let paddle_1_coord, paddle_2_coord, ball_coord, board_coord, paddle_common;
//     let dx, dy, dxd, dyd;
//     let winner1, winner2, winner_final;

//     let paddle1Velocity = 0, paddle2Velocity = 0;
//     const paddleSpeed = 5;

//     let pl1_input = document.getElementById('player1NameInput');
//     let pl2_input = document.getElementById('player2NameInput');
//     let pl3_input = document.getElementById('player3NameInput');
//     let pl4_input = document.getElementById('player4NameInput');
//     let startGameBtn = document.getElementById('startGameBtn');

//     // Event listener for start button click
//     startGameBtn.addEventListener('click', function() {
//         if (areNotUnique(pl1_input.value, pl2_input.value, pl3_input.value, pl4_input.value)) {
//             alert('Please enter unique names for all players.');
//         }
//         else if (pl1_input.value && pl2_input.value && pl3_input.value && pl4_input.value) {
//             pl1_name = pl1_input.value;
//             pl2_name = pl2_input.value;
//             pl3_name = pl3_input.value;
//             pl4_name = pl4_input.value;
//             table_name1.textContent = pl1_name;
//             table_name2.textContent = pl2_name;
//             table_name3.textContent = pl3_name;
//             table_name4.textContent = pl4_name;
//             // Hide / show :
//             document.getElementById('player_form').style.display = 'none';
//             document.getElementById('tournament-table').style.display = 'block';
//             startTournament();
//         } else {
//             alert('Please enter unique names for all players.');
//         }
//     });

//     document.addEventListener('keydown', function(e) {
//         if (e.key === 'Enter' && gameState === 'begin') {
//             if (areNotUnique(pl1_input.value, pl2_input.value, pl3_input.value, pl4_input.value)) {
//                 alert('Please enter unique names for all players.');
//             }
//             else if (pl1_input.value && pl2_input.value && pl3_input.value && pl4_input.value) {
//                 pl1_name = pl1_input.value;
//                 pl2_name = pl2_input.value;
//                 pl3_name = pl3_input.value;
//                 pl4_name = pl4_input.value;
//                 table_name1.textContent = pl1_name;
//                 table_name2.textContent = pl2_name;
//                 table_name3.textContent = pl3_name;
//                 table_name4.textContent = pl4_name;
//                 // Hide the name form
//                 document.getElementById('player_form').style.display = 'none';
//                 document.getElementById('tournament-table').style.display = 'block';
//                 startTournament();
//             } else {
//                 alert('Please enter unique names for all players.');
//             }
//         }
//     });

//     function startTournament() {
//         document.getElementById('go-to-match').addEventListener('click', function() {
//             document.getElementById('tournament-table').style.display = 'none';
//             document.getElementById('tournament-game').style.display = 'block';
//             document.getElementById('tour_header').style.display = 'none';
//             gameState = 'start';
//             let player1 = document.getElementById('player1Name');
//             let player2 = document.getElementById('player2Name');
//             if(!winner1)
//             {
//                 player1.textContent = pl1_name;
//                 player2.textContent = pl2_name;
//                 winnerMessage.style.display = 'block';
//                 winnerMessage.querySelector('#winnerName').innerHTML = `${pl1_name} vs ${pl2_name}!`;
//                 start_game();
//             }
//             else if(!winner2)
//             {
//                 player1.textContent = pl3_name;
//                 player2.textContent = pl4_name;
//                 winnerMessage.style.display = 'block';
//                 winnerMessage.querySelector('#winnerName').innerHTML = `${pl3_name} vs ${pl4_name}!`;
//                 start_game();
//             }
//             else if(!winner_final)
//             {
//                 player1.textContent = winner1;
//                 player2.textContent = winner2;
//                 winnerMessage.style.display = 'block';
//                 winnerMessage.querySelector('#winnerName').innerHTML = `${winner1} vs ${winner2}!`;
//                 start_game();
//             }
//         });
//     }

//     function startMatch() {

//     }

//     function areNotUnique(str1, str2, str3, str4) {
//         return str1 === str2 || str1 === str3 || str1 === str4 ||
//         str2 === str3 || str2 === str4 ||
//         str3 === str4;
//     }

//     function start_game() {

//         // Game initialization logic
//         initializeElements();
//         updatePaddlePositions();

//         // Listen for Enter key to start the game
//         document.addEventListener('keydown', function(e) {
//             if (e.key === 'Enter') {
//                 if (gameState === 'start') {
//                     gameState = 'play';
//                     message.innerHTML = 'Game Started';
//                     resetBallPosition();
//                     requestAnimationFrame(() => {
//                         dx = Math.floor(Math.random() * 4) + 3;
//                         dy = Math.floor(Math.random() * 4) + 3;
//                         dxd = Math.floor(Math.random() * 2);
//                         dyd = Math.floor(Math.random() * 2);
//                         moveBall(dx, dy, dxd, dyd);
//                     });
//                     winnerMessage.style.display = 'none';
//                     setTimeout(() => {
//                         message.innerHTML = '';
//                     }, 1000);
//                 }
//             }
//             if (e.key === 'w') {
//                 if (gameState === 'play') {
//                     paddle1Velocity = -paddleSpeed;
//                 }
//             }
//             if (e.key === 's') {
//                 if (gameState === 'play') {
//                     paddle1Velocity = paddleSpeed;
//                 }
//             }
//             if (e.key === 'ArrowUp') {
//                 if (gameState === 'play') {
//                     paddle2Velocity = -paddleSpeed;
//                 }
//             }
//             if (e.key === 'ArrowDown') {
//                 if (gameState === 'play') {
//                     paddle2Velocity = paddleSpeed;
//                 }
//             }
//         });
    
//         document.addEventListener('keyup', function(e) {
//             if (e.key === 'w' || e.key === 's') {
//                 paddle1Velocity = 0;
//             }
//             if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
//                 paddle2Velocity = 0;
//             }
//         });
//     }

//     function initializeElements() {
//         paddle_1 = document.querySelector('.paddle_1_off');
//         paddle_2 = document.querySelector('.paddle_2_off');
//         board = document.querySelector('.board');
//         ball = document.querySelector('.ball');
//         score_1 = document.querySelector('.player_1_score');
//         score_2 = document.querySelector('.player_2_score');
//         message = document.querySelector('.message');
//         paddle_1_coord = paddle_1.getBoundingClientRect();
//         paddle_2_coord = paddle_2.getBoundingClientRect();
//         ball_coord = ball.getBoundingClientRect();
//         board_coord = board.getBoundingClientRect();
//         paddle_common = document.querySelector('.paddle_off').getBoundingClientRect();

//         dx = Math.floor(Math.random() * 4) + 3;
//         dy = Math.floor(Math.random() * 4) + 3;
//         dxd = Math.floor(Math.random() * 2);
//         dyd = Math.floor(Math.random() * 2);

//         ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
//         ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
//     }

//     function resetScores() {
//         score_1.innerHTML = '0';
//         score_2.innerHTML = '0';
//     }

//     function checkScores() {
//         if (parseInt(score_1.innerHTML) >= 3) {
//             displayWinner(pl1_name);
//             if (!winner1)
//                 winner1 = pl1_name;
//             else if (!winner2)
//                 winner2 = pl1_name;
//             else if (!winner_final)
//                 winner_final = pl1_name;
//             return true;
//         } else if (parseInt(score_2.innerHTML) >= 3) {
//             displayWinner(pl2_name);
//             if (!winner1)
//                 winner1 = pl2_name;
//             else if (!winner2)
//                 winner2 = pl2_name;
//             else if (!winner_final)
//                 winner_final = pl2_name;
//             return true;
//         }
//         return false;
//     }

//     function displayWinner(winnerName) {
//         gameState = 'stop';
//         winnerMessage.style.display = 'block';
//         winnerMessage.querySelector('#winnerName').innerHTML = `${winnerName} wins!`;
//         // gameState = 'start';
//         resetScores();
//         resetBallPosition();
//         document.getElementById('nextGame').style.display = 'block';
//         document.getElementById('nextGame').addEventListener('click', function() {
//             document.getElementById('nextGame').style.display = 'none';
//             startTournament();
//         });
//         // message.innerHTML = 'Game Over! Press Enter to Play Again';
//     }

//     function resetBallPosition() {
//         ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
//         ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
        
//         ball_coord = ball.getBoundingClientRect();
//     }

//     function moveBall(dx, dy, dxd, dyd) {
//         ball_coord = ball.getBoundingClientRect();

//         if (ball_coord.top <= board_coord.top || ball_coord.bottom >= board_coord.bottom) {
//             dyd = 1 - dyd; // Reverse vertical direction
//         }

//         if (ball_coord.left <= paddle_1_coord.right && ball_coord.top >= paddle_1_coord.top && ball_coord.bottom <= paddle_1_coord.bottom) {
//             dxd = 1; // Move ball to the right
//             dx = Math.floor(Math.random() * 4) + 3;
//             dy = Math.floor(Math.random() * 4) + 3;
//         }

//         if (ball_coord.right >= paddle_2_coord.left && ball_coord.top >= paddle_2_coord.top && ball_coord.bottom <= paddle_2_coord.bottom) {
//             dxd = 0; // Move ball to the left
//             dx = Math.floor(Math.random() * 4) + 3;
//             dy = Math.floor(Math.random() * 4) + 3;
//         }

//         if (ball_coord.left <= board_coord.left || ball_coord.right >= board_coord.right) {
//             if (ball_coord.left <= board_coord.left) {
//                 score_2.innerHTML = +score_2.innerHTML + 1;
//             } else {
//                 score_1.innerHTML = +score_1.innerHTML + 1;
//             }
//             if (checkScores()) return;
//             gameState = 'stop';
//             resetBallPosition();
//             setTimeout(() => {
//                 gameState = 'play';
//                 moveBall(dx, dy, dxd, dyd);
//             }, 1000);
//             return;
//         }

//         if ((ball_coord.top <= board_coord.top && ball_coord.left <= board_coord.left) ||
//             (ball_coord.top <= board_coord.top && ball_coord.right >= board_coord.right) ||
//             (ball_coord.bottom >= board_coord.bottom && ball_coord.left <= board_coord.left) ||
//             (ball_coord.bottom >= board_coord.bottom && ball_coord.right >= board_coord.right)) {
//             gameState = 'stop';
//             message.innerHTML = 'Game Over! Press Enter to Play Again';
//             return;
//         }

//         ball.style.top = ball_coord.top + dy * (dyd === 0 ? -1 : 1) + 'px';
//         ball.style.left = ball_coord.left + dx * (dxd === 0 ? -1 : 1) + 'px';

//         requestAnimationFrame(() => {
//             moveBall(dx, dy, dxd, dyd);
//         });
//     }

//     function updatePaddlePositions() {
//         paddle_1.style.top = Math.min(Math.max(board_coord.top, paddle_1_coord.top + paddle1Velocity), board_coord.bottom - paddle_1_coord.height) + 'px';
//         paddle_2.style.top = Math.min(Math.max(board_coord.top, paddle_2_coord.top + paddle2Velocity), board_coord.bottom - paddle_2_coord.height) + 'px';

//         paddle_1_coord = paddle_1.getBoundingClientRect();
//         paddle_2_coord = paddle_2.getBoundingClientRect();

//         requestAnimationFrame(updatePaddlePositions);
//     }

//     // initializeElements();
//     // updatePaddlePositions();
//     // updatePlayerNames();
// });

document.addEventListener('DOMContentLoaded', function () {
    let gameState = 'begin';
    let name1, name2;
    let pl1_name = 'Player 1';
    let pl2_name = 'Player 2';
    let pl3_name = 'Player 3';
    let pl4_name = 'Player 4';
    let table_name1 = document.getElementById('table_name1');
    let table_name2 = document.getElementById('table_name2');
    let table_name3 = document.getElementById('table_name3');
    let table_name4 = document.getElementById('table_name4');
    let paddle_1, paddle_2, board, ball, score_1, score_2, message;
    let paddle_1_coord, paddle_2_coord, ball_coord, board_coord, paddle_common;
    let dx, dy, dxd, dyd;
    let winner1 = null;
    let winner2 = null;
    let winner_final = null;

    let paddle1Velocity = 0, paddle2Velocity = 0;
    const paddleSpeed = 5;

    let pl1_input = document.getElementById('player1NameInput');
    let pl2_input = document.getElementById('player2NameInput');
    let pl3_input = document.getElementById('player3NameInput');
    let pl4_input = document.getElementById('player4NameInput');
    let startGameBtn = document.getElementById('startGameBtn');

    // Event listener for start button click
    startGameBtn.addEventListener('click', function() {
        startTournament();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && gameState === 'begin') 
        {
                startTournament();
        } 
        else if (gameState === 'start')
        {
                if (gameState === 'start') {
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
                    winnerMessage.style.display = 'none';
                    setTimeout(() => {
                        message.innerHTML = '';
                    }, 1000);
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

    function startTournament() {
        if (areNotUnique(pl1_input.value, pl2_input.value, pl3_input.value, pl4_input.value)) {
            alert('Please enter unique names for all players.');
        }
        else if (pl1_input.value && pl2_input.value && pl3_input.value && pl4_input.value) {
            pl1_name = pl1_input.value;
            pl2_name = pl2_input.value;
            pl3_name = pl3_input.value;
            pl4_name = pl4_input.value;
            table_name1.textContent = pl1_name;
            table_name2.textContent = pl2_name;
            table_name3.textContent = pl3_name;
            table_name4.textContent = pl4_name;
            // Hide / show :
            document.getElementById('player_form').style.display = 'none';
            document.getElementById('tournament-table').style.display = 'block';
            document.getElementById('go-to-match').addEventListener('click', startMatch);
        } else {
            alert('Please enter unique names for all players.');
        }
    }

    function startMatch() {
        document.getElementById('tournament-table').style.display = 'none';
        document.getElementById('tournament-game').style.display = 'block';
        document.getElementById('tour_header').style.display = 'none';
        gameState = 'start';
        let player1 = document.getElementById('player1Name');
        let player2 = document.getElementById('player2Name');

        if (winner1 === null) {
            player1.textContent = pl1_name;
            name1 = pl1_name;
            player2.textContent = pl2_name;
            name2 = pl2_name;
            winnerMessage.querySelector('#winnerName').innerHTML = `${pl1_name} vs ${pl2_name}!`;
            winnerMessage.style.display = 'block';
            start_game(pl1_name, pl2_name, 'winner1');
        } else if (winner2 === null) {
            player1.textContent = pl3_name;
            name1 = pl3_name;
            player2.textContent = pl4_name;
            name2 = pl4_name
            winnerMessage.querySelector('#winnerName').innerHTML = `${pl3_name} vs ${pl4_name}!`;
            winnerMessage.style.display = 'block';
            start_game(pl3_name, pl4_name, 'winner2');
        } else if (winner_final === null) {
            player1.textContent = winner1;
            name1 = winner1;
            player2.textContent = winner2;
            name2 = winner2;
            winnerMessage.querySelector('#winnerName').innerHTML = `${winner1} vs ${winner2}!`;
            winnerMessage.style.display = 'block';
            start_game(winner1, winner2, 'winner_final');
        }
    }

    function areNotUnique(str1, str2, str3, str4) {
        return str1 === str2 || str1 === str3 || str1 === str4 ||
        str2 === str3 || str2 === str4 ||
        str3 === str4;
    }

    function start_game(player1Name, player2Name, winnerKey) {
        initializeElements();
        updatePaddlePositions();

        document.getElementById('nextGame').style.display = 'none';
        document.getElementById('nextGame').removeEventListener('click', startTournament);
        document.getElementById('nextGame').addEventListener('click', () => {
            document.getElementById('nextGame').style.display = 'none';
            startMatch();
        });
        // document.getElementById('exitTour').addEventListener('click', () => {
        //     document.getElementById('tournament-table').style.display = 'block';
        //     document.getElementById('tournament-game').style.display = 'none';
        // });
    }

    function initializeElements() {
        paddle_1 = document.querySelector('.paddle_1_off');
        paddle_2 = document.querySelector('.paddle_2_off');
        board = document.querySelector('.board');
        ball = document.querySelector('.ball');
        score_1 = document.querySelector('.player_1_score');
        score_2 = document.querySelector('.player_2_score');
        message = document.querySelector('.message');
        paddle_1_coord = paddle_1.getBoundingClientRect();
        paddle_2_coord = paddle_2.getBoundingClientRect();
        ball_coord = ball.getBoundingClientRect();
        board_coord = board.getBoundingClientRect();
        paddle_common = document.querySelector('.paddle_off').getBoundingClientRect();

        dx = Math.floor(Math.random() * 4) + 3;
        dy = Math.floor(Math.random() * 4) + 3;
        dxd = Math.floor(Math.random() * 2);
        dyd = Math.floor(Math.random() * 2);

        ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
        ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
    }

    function resetScores() {
        score_1.innerHTML = '0';
        score_2.innerHTML = '0';
    }


    function checkScores() {
        if (parseInt(score_1.innerHTML) >= 3) {
            if (!winner1)
            {
                winner1 = name1;
                gameState = 'stop';
                displayWinner(name1, false);
            }
            else if (!winner2)
            {
                winner2 = name1;
                gameState = 'stop';
                displayWinner(name1, false);
            }
            else if (!winner_final)
            {
                winner_final = name1;
                gameState = 'end';
                displayWinner(name1, true);
            }
            return true;
        } else if (parseInt(score_2.innerHTML) >= 3) {
            if (!winner1)
            {
                winner1 = name2;
                gameState = 'stop';
                displayWinner(name2, false);
            }
            else if (!winner2)
            {
                winner2 = name2;
                gameState = 'stop';
                displayWinner(name2, false);
            }
            else if (!winner_final)
            {
                winner_final = name2;
                gameState = 'end';
                displayWinner(name2, true);
            }
            return true;
        }
        return false;
    }
    function endTournament(winnerName) {
        document.getElementById('megaWinner').style.display = 'block';
        document.getElementById('megaWinnerName').textContent = `🏆 ${winnerName} wins the Tournament! 🏆`;
        document.getElementById('exitTour').style.display = 'block';
    }

    function displayWinner(winnerName, isFinal) {
        if (isFinal === true) {
            endTournament(winnerName);
        } else {
            winnerMessage.style.display = 'block';
            winnerMessage.querySelector('#winnerName').innerHTML = `${winnerName} wins!`;
            resetScores();
            resetBallPosition();
            document.getElementById('nextGame').style.display = 'block';
            document.getElementById('nextGame').addEventListener('click', function() {
                document.getElementById('nextGame').style.display = 'none';
                startMatch();
            });
        }
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
            gameState = 'stop';
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

    // initializeElements();
    // updatePaddlePositions();
    // updatePlayerNames();
});