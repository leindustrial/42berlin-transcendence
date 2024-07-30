document.addEventListener('DOMContentLoaded', function () {
        const section2 = document.getElementById('offline-tournament');
        if (!section2 || window.getComputedStyle(section2).display !== 'block') return;
    
        console.log('We are in the tournament');
    
        let gameStateTour = 'begin';
        const paddleSpeedTour = 5;
        let paddle1VelocityTour = 0, paddle2VelocityTour = 0;
        let player1InputTour = document.getElementById('player1NameInput_4');
        let player2InputTour = document.getElementById('player2NameInput_4');
        let player3InputTour = document.getElementById('player3NameInput_4');
        let player4InputTour = document.getElementById('player4NameInput_4');
        let startTourBtn = document.getElementById('startTourBtn');
        let table_name1 = document.getElementById('table_name1_4');
        let table_name2 = document.getElementById('table_name2_4');
        let table_name3 = document.getElementById('table_name3_4');
        let table_name4 = document.getElementById('table_name4_4');
        let name1, name2;
        let winner1 = null;
        let winner2 = null;
        let winner_final = null;
        let pl1Name, pl2Name, pl3Name, pl4Name;
    
        let messageTour = document.getElementById('message_off_4');
        let winnerMessageTour = document.getElementById('winnerMessage_4')
    
    
        let paddle_1Tour, paddle_2Tour, boardTour, ballTour, score_1Tour, score_2Tour;
        let paddle_1_coordTour, paddle_2_coordTour, ball_coordTour, board_coordTour;
        let dx, dy, dxd, dyd;
        
        let exitOffTourBtn = document.getElementById('exitOffTourBtn');
    
        exitOffTourBtn.addEventListener('click', function () {
            gameStateTour = 'reset';
            // initializeGameElements();
            // updatePaddlePositions();
            // resetBallPosition();
            // resetScores();
            // resetPlayers();
            // // resetPaddles();
            // document.getElementById('message_off_1x1').innerHTML = 'Press Enter to Play'
            // document.getElementById('message_off_1x1').style.display = 'block';
            // document.getElementById('winnerMessage_off_1x1').style.display = 'none';
            // document.getElementById('player_form_1x1').style.display = 'block';
            // document.getElementById('player1Name_off_1x1').innerHTML = 'Player 1';
            // document.getElementById('player2Name_off_1x1').innerHTML = 'Player 2';
            // gameState = 'begin';
            window.location.hash = 'offline-choose-mode';
        });
    
        // Event listener for start button click
        startTourBtn.addEventListener('click', startTournament);
    
        // Event listener for Enter key to start tournament
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && gameStateTour === 'begin') startTournament();
            else if (e.key === 'Enter' && gameStateTour === 'start') start_gameTour();
            if (e.key === 'w') paddle1VelocityTour = gameStateTour === 'play' ? -paddleSpeedTour : 0;
            if (e.key === 's') paddle1VelocityTour = gameStateTour === 'play' ? paddleSpeedTour : 0;
            if (e.key === 'ArrowUp') paddle2VelocityTour = gameStateTour === 'play' ? -paddleSpeedTour : 0;
            if (e.key === 'ArrowDown') paddle2VelocityTour = gameStateTour === 'play' ? paddleSpeedTour : 0;
        });
    
        // Event listener for keyup to stop paddle movement
        document.addEventListener('keyup', function (e) {
            if (e.key === 'w' || e.key === 's') paddle1VelocityTour = 0;
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') paddle2VelocityTour = 0;
        });
    
        function startTournament() {
            console.log('We are in start tournament');
    
            if (areNotUnique(player1InputTour.value, player2InputTour.value, player3InputTour.value, player4InputTour.value)) {
                console.log('alert');
                alert(':) Please enter unique names for all players.');
            } else if (player1InputTour.value && player2InputTour.value && player3InputTour.value && player4InputTour.value) {
                console.log('trying to start');
                pl1Name = player1InputTour.value;
                pl2Name = player2InputTour.value;
                pl3Name = player3InputTour.value;
                pl4Name = player4InputTour.value;
                table_name1.textContent = pl1Name;
                table_name2.textContent = pl2Name;
                table_name3.textContent = pl3Name;
                table_name4.textContent = pl4Name;
                document.getElementById('player_form_4').style.display = 'none';
                document.getElementById('tournament-table').style.display = 'block';
                document.getElementById('go-to-match').addEventListener('click', startMatch);
            } else {
                console.log('alert');
                alert('Please enter unique names for all players.');
            }
        }
    
        function startMatch() {
            document.getElementById('tournament-table').style.display = 'none';            
            document.getElementById('tournament-game').style.display = 'block';
            document.getElementById('tour_header').style.display = 'none';
            gameStateTour = 'start';
            let player1Tour = document.getElementById('player1Name_4');
            let player2Tour = document.getElementById('player2Name_4');
            winnerMessageTour = document.querySelector('#winnerMessage_4');
            if (winner1 === null) {
                player1Tour.textContent = pl1Name;
                name1 = pl1Name;
                player2Tour.textContent = pl2Name;
                name2 = pl2Name;
                winnerMessageTour.querySelector('#winnerName_4').innerHTML = `${pl1Name} vs ${pl2Name}!`;
                winnerMessageTour.style.display = 'block';
                //start_gameTour();
            } else if (winner2 === null) {
                player1Tour.textContent = pl3Name;
                name1 = pl3Name;
                player2Tour.textContent = pl4Name;
                name2 = pl4Name;
                winnerMessageTour.querySelector('#winnerName_4').innerHTML = `${pl3Name} vs ${pl4Name}!`;
                winnerMessageTour.style.display = 'block';
                //start_gameTour();
            } else if (winner_final === null) {
                player1Tour.textContent = winner1;
                name1 = winner1;
                player2Tour.textContent = winner2;
                name2 = winner2;
                winnerMessageTour.querySelector('#winnerName_4').innerHTML = `${winner1} vs ${winner2}!`;
                winnerMessageTour.style.display = 'block';
                //start_gameTour();
            }
        }
        
        function areNotUnique(str1, str2, str3, str4) {
            return str1 === str2 || str1 === str3 || str1 === str4 ||
            str2 === str3 || str2 === str4 ||
            str3 === str4;
        }
        
        function start_gameTour() {
            messageTour.style.display = 'block';
            winnerMessageTour.style.display = 'none';
            gameStateTour = 'play';
            messageTour.innerHTML = 'Game Started';
            setTimeout(() => messageTour.innerHTML = '', 1500);
            
            console.log('We are in the game tour');
            initializeElementsTour();
            updatePaddlePositionsTour();
            resetBallPositionTour();
            resetScoresTour();
            moveBallTour(dx, dy, dxd, dyd)
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
        
        function initializeElementsTour() {
            paddle_1Tour = document.getElementById('paddle1_off_4');
            paddle_2Tour = document.getElementById('paddle2_off_4');
            boardTour = document.getElementById('board_off_4');
            ballTour = document.getElementById('ball_off_4');
            score_1Tour = document.getElementById('score1_off_4');
            score_2Tour = document.getElementById('score1_off_4');
            paddle_1_coordTour = paddle_1Tour.getBoundingClientRect();
            paddle_2_coordTour = paddle_2Tour.getBoundingClientRect();
            ball_coordTour = ballTour.getBoundingClientRect();
            board_coordTour = boardTour.getBoundingClientRect();
            paddle_commonTour = document.querySelector('.paddle_off').getBoundingClientRect();
    
            dx = Math.floor(Math.random() * 4) + 3;
            dy = Math.floor(Math.random() * 4) + 3;
            dxd = Math.floor(Math.random() * 2);
            dyd = Math.floor(Math.random() * 2);
    
            ballTour.style.top = board_coordTour.top + (board_coordTour.height / 2) - (ball_coordTour.height / 2) + 'px';
            ballTour.style.left = board_coordTour.left + (board_coordTour.width / 2) - (ball_coordTour.width / 2) + 'px';
        }
    
        function resetScoresTour() {
            score_1Tour.innerHTML = '0';
            score_2Tour.innerHTML = '0';
        }
    
        function endTournament(winnerNameTour) {
            document.getElementById('megaWinner').style.display = 'block';
            document.getElementById('megaWinnerName').textContent = `🏆 ${winnerNameTour} wins the Tournament! 🏆`;
            document.getElementById('exitTour').style.display = 'block';
        }
    
        function resetBallPositionTour() {
            ballTour.style.top = board_coordTour.top + (board_coordTour.height / 2) - (ball_coordTour.height / 2) + 'px';
            ballTour.style.left = board_coordTour.left + (board_coordTour.width / 2) - (ball_coordTour.width / 2) + 'px';
            
            ball_coordTour = ballTour.getBoundingClientRect();
        }
    
        function moveBallTour(dx, dy, dxd, dyd) {
            ball_coordTour = ballTour.getBoundingClientRect();
    
            if (ball_coordTour.top <= board_coordTour.top || ball_coordTour.bottom >= board_coordTour.bottom) {
                dyd = 1 - dyd; // Reverse vertical direction
            }
    
            if (ball_coordTour.left <= paddle_1_coordTour.right && ball_coordTour.top >= paddle_1_coordTour.top && ball_coordTour.bottom <= paddle_1_coordTour.bottom) {
                dxd = 1; // Move ball to the right
                dx = Math.floor(Math.random() * 4) + 3;
                dy = Math.floor(Math.random() * 4) + 3;
            }
    
            if (ball_coordTour.right >= paddle_2_coordTour.left && ball_coordTour.top >= paddle_2_coordTour.top && ball_coordTour.bottom <= paddle_2_coordTour.bottom) {
                dxd = 0; // Move ball to the left
                dx = Math.floor(Math.random() * 4) + 3;
                dy = Math.floor(Math.random() * 4) + 3;
            }
    
            if (ball_coordTour.left <= board_coordTour.left || ball_coordTour.right >= board_coordTour.right) {
                if (ball_coordTour.left <= board_coordTour.left) {
                    score_2Tour.innerHTML = +score_2Tour.innerHTML + 1;
                } else {
                    score_1Tour.innerHTML = +score_1Tour.innerHTML + 1;
                }
                if (checkScoresTour()) return;
                gameStateTour = 'stop';
                resetBallPositionTour();
                setTimeout(() => {
                    gameStateTour = 'play';
                    moveBallTour(dx, dy, dxd, dyd);
                }, 1000);
                return;
            }
    
            function checkScoresTour() {
                if (parseInt(score_1Tour.innerHTML) >= 3) {
                    if (!winner1)
                    {
                        winner1 = name1;
                        gameStateTour = 'stop';
                        displayWinnerTour(name1, false);
                    }
                    else if (!winner2)
                    {
                        winner2 = name1;
                        gameStateTour = 'stop';
                        displayWinnerTour(name1, false);
                    }
                    else if (!winner_final)
                    {
                        winner_final = name1;
                        gameStateTour = 'end';
                        displayWinnerTour(name1, true);
                    }
                    return true;
                } 
                else if (parseInt(score_2Tour.innerHTML) >= 3) {
                    if (!winner1)
                    {
                        winner1 = name2;
                        gameStateTour = 'stop';
                        displayWinnerTour(name2, false);
                    }
                    else if (!winner2)
                    {
                        winner2 = name2;
                        gameStateTour = 'stop';
                        displayWinnerTour(name2, false);
                    }
                    else if (!winner_final)
                    {
                        winner_final = name2;
                        gameStateTour = 'end';
                        displayWinnerTour(name2, true);
                    }
                    return true;
                }
                return false;
            }
    
            function displayWinnerTour(winnerNameTour, isFinal) {
                if (isFinal === true) {
                    endTournament(winnerNameTour);
                } else {
                    winnerMessageTour.style.display = 'block';
                    winnerMessageTour.querySelector('#winnerName_4').innerHTML = `${winnerNameTour} wins!`;
                    resetScoresTour();
                    resetBallPositionTour();
                    document.getElementById('nextGame').style.display = 'block';
                    document.getElementById('nextGame').addEventListener('click', function() {
                        document.getElementById('nextGame').style.display = 'none';
                        startMatch();
                    });
                }
            }
    
            // if ((ball_coord.top <= board_coord.top && ball_coord.left <= board_coord.left) ||
            //     (ball_coord.top <= board_coord.top && ball_coord.right >= board_coord.right) ||
            //     (ball_coord.bottom >= board_coord.bottom && ball_coord.left <= board_coord.left) ||
            //     (ball_coord.bottom >= board_coord.bottom && ball_coord.right >= board_coord.right)) {
            //     gameStateTour = 'stop';
            //     message.innerHTML = 'Game Over! Press Enter to Play Again';
            //     return;
            // }
    
            ballTour.style.top = ball_coordTour.top + dy * (dyd === 0 ? -1 : 1) + 'px';
            ballTour.style.left = ball_coordTour.left + dx * (dxd === 0 ? -1 : 1) + 'px';
    
            requestAnimationFrame(() => {
                moveBallTour(dx, dy, dxd, dyd);
            });
        }
    
        function updatePaddlePositionsTour() {
            paddle_1Tour.style.top = Math.min(Math.max(board_coordTour.top, paddle_1_coordTour.top + paddle1VelocityTour), board_coordTour.bottom - paddle_1_coordTour.height) + 'px';
            paddle_2Tour.style.top = Math.min(Math.max(board_coordTour.top, paddle_2_coordTour.top + paddle2VelocityTour), board_coordTour.bottom - paddle_2_coordTour.height) + 'px';
    
            paddle_1_coordTour = paddle_1Tour.getBoundingClientRect();
            paddle_2_coordTour = paddle_2Tour.getBoundingClientRect();
    
            requestAnimationFrame(updatePaddlePositionsTour);
        }
    
});