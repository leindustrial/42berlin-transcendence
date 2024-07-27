console.log('JavaScript file is loaded');
function showSection(sectionId) {
    // Get all sections
    const sections = document.querySelectorAll('.content-section');
    let location;

    // Hide all sections
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show only selected (via click on button/link) section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        location = sectionId;
        console.log("location: ")
        console.log(location);
    }

    // Conditionally show/hide the logo and language
    const language = document.getElementById('language');
    const headerWelcome = document.getElementById('header-welcome');
    const footer = document.getElementById('footer-welcome')
    
    if (sectionId === 'offline-choose-mode' || sectionId === 'get-started') {
        if (language) language.style.display = 'block';
        if (headerWelcome) headerWelcome.style.display = 'block';
        if (footer) footer.style.display = 'block'
    } else {
        if (language) language.style.display = 'none';
        if (headerWelcome) headerWelcome.style.display = 'none';
        if (footer) footer.style.display = 'none'
    }

    const offHeaderGame = document.getElementById('off-header-game');
    if (sectionId === 'offline-1x1' || sectionId === 'offline-tournament' || sectionId === 'login') {
        if (offHeaderGame) offHeaderGame.style.display = 'block';
    } else {
        if (offHeaderGame) offHeaderGame.style.display = 'none';
    }
    const horNav = document.getElementById('hor-nav');
    if (sectionId === 'get-started') {
        if (horNav) horNav.style.display = 'block';
    } else {
        if (horNav) horNav.style.display = 'none';
    }
    const onHeaderGame = document.getElementById('online-header-game');
    if (sectionId === 'online-1x1' || sectionId === 'online-4' || sectionId === 'online-tournament') {
        if (onHeaderGame) onHeaderGame.style.display = 'block';
    } else {
        if (onHeaderGame) onHeaderGame.style.display = 'none';
    }
}

// Add event listener for hash change to handle browser navigation
window.addEventListener('hashchange', function() {
    console.log('JavaScript file is loaded');
    const sectionId = window.location.hash.substring(1);
    showSection(sectionId);
});

// On initial load, show the appropriate section
document.addEventListener('DOMContentLoaded', function() {
    const initialSection = window.location.hash.substring(1) || 'offline-choose-mode';
    showSection(initialSection);

    // Initialize offline games
    initializeOffline1x1Game();
    initializeOfflineTournament();

    // Event listener for start button click
    let startGameBtn = document.getElementById('startGameBtn');
    let exitOffGameBtn = document.getElementById('exitOffGameBtn');
    let player1Input = document.getElementById('player1NameInput');
    let player2Input = document.getElementById('player2NameInput');

    startGameBtn.addEventListener('click', function () {
        document.getElementById('player_form').style.display = 'none';
        gameState = 'start';
    });

    exitOffGameBtn.addEventListener('click', function () {
        gameState = 'stop';
        // resetScores();
        // resetBallPosition();
        resetPlayers();
        window.location.hash = 'offline-choose-mode';
    });

    function resetPlayers() {
        player1Input.value = '';
        player2Input.value = '';
    }
});


// Offline 1x1 game ========================================================================================================

// Initialize Offline 1x1 Game
function initializeOffline1x1Game() {
    const section1 = document.getElementById('offline-1x1');
    if (!section1 || window.getComputedStyle(section1).display !== 'block') return;
    // if (location !== 'offline-1x1')
    //     return;
    console.log('We are in the game');

    let gameState = 'begin';
    const paddleSpeed = 2;
    let paddle1Velocity = 0, paddle2Velocity = 0;
    const player1 = document.getElementById('player1Name');
    const player2 = document.getElementById('player2Name');
    let message = document.getElementById('offline-message');
    let player1Input = document.getElementById('player1NameInput');
    let player2Input = document.getElementById('player2NameInput');

    let paddle_1, paddle_2, board, ball, score_1, score_2;
    let paddle_1_coord, paddle_2_coord, ball_coord, board_coord, paddle_common;
    let dx, dy, dxd, dyd;
    let player1Name = 'Player 1'; // Default names
    let player2Name = 'Player 2';


    // Event listener for Enter key to start game
    document.addEventListener('keydown', function (e) {
        console.log("1x1 game location!");
        if (e.key === 'Enter' && gameState === 'begin')
        {
            document.getElementById('player_form').style.display = 'none';
            gameState = 'start'
        }
        else if (e.key === 'Enter' && gameState === 'start') startGame();
        if (e.key === 'w') paddle1Velocity = gameState === 'play' ? -paddleSpeed : 0;
        if (e.key === 's') paddle1Velocity = gameState === 'play' ? paddleSpeed : 0;
        if (e.key === 'ArrowUp') paddle2Velocity = gameState === 'play' ? -paddleSpeed : 0;
        if (e.key === 'ArrowDown') paddle2Velocity = gameState === 'play' ? paddleSpeed : 0;
    });

    // Event listener for keyup to stop paddle movement
    document.addEventListener('keyup', function (e) {
        if (e.key === 'w' || e.key === 's') paddle1Velocity = 0;
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') paddle2Velocity = 0;
    });

    function startGame() {
        message.style.display = 'block';
        if (player1Input.value === player2Input.value) {
            alert('Please enter different names for both players.');
        } else if (player1Input.value && player2Input.value) {
            winnerMessage = document.getElementById('winnerMessage');
            winnerMessage.style.display = 'none';
            player1.textContent = player1Input.value;
            player2.textContent = player2Input.value;
            player1Name = player1Input.value;
            player2Name = player2Input.value;
            document.getElementById('player_form').style.display = 'none';
            gameState = 'play';
            message.innerHTML = 'Game Started';
            setTimeout(() => message.innerHTML = '', 1500);
            initializeGameElements();
            updatePaddlePositions();
            resetBallPosition();
            resetScores();
            moveBall(dx, dy, dxd, dyd);
        } else {
            alert('Please enter names for both players.');
        }
    }

    function initializeGameElements() {
        paddle_1 = document.querySelector('.paddle_1_off');
        paddle_2 = document.querySelector('.paddle_2_off');
        board = document.querySelector('.board');
        ball = document.querySelector('.ball');
        score_1 = document.querySelector('.player_1_score');
        score_2 = document.querySelector('.player_2_score');
        // message = document.querySelector('.message');
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

    function updatePaddlePositions() {
        paddle_1.style.top = Math.min(Math.max(board_coord.top, paddle_1_coord.top + paddle1Velocity), board_coord.bottom - paddle_1_coord.height) + 'px';
        paddle_2.style.top = Math.min(Math.max(board_coord.top, paddle_2_coord.top + paddle2Velocity), board_coord.bottom - paddle_2_coord.height) + 'px';

        paddle_1_coord = paddle_1.getBoundingClientRect();
        paddle_2_coord = paddle_2.getBoundingClientRect();

        requestAnimationFrame(updatePaddlePositions);
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
        message.style.display = 'block';
        message.innerHTML = 'Game Over! Press Enter to Play Again';
        resetBallPosition();
        winnerMessage.style.display = 'block';
        document.getElementById('winnerName').innerHTML = `${winnerName} wins!`;
        resetScores();
        gameState = 'start';
    }

    function resetScores() {
        score_1.innerHTML = '0';
        score_2.innerHTML = '0';
    }
}

// Initialize Offline Tournament
function initializeOfflineTournament() {
    const section2 = document.getElementById('offline-tournament');
    if (!section2 || window.getComputedStyle(section2).display !== 'block') return;

    // if (location !== 'offline-tournament')
    //     return;
    console.log('We are in the tournament');
    let gameState = 'begin';
    const paddleSpeed = 5;
    let paddle1Velocity = 0, paddle2Velocity = 0;
    let player1Input = document.getElementById('player1NameInput_4');
    let player2Input = document.getElementById('player2NameInput_4');
    let player3Input = document.getElementById('player3NameInput_4');
    let player4Input = document.getElementById('player4NameInput_4');
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
    

    // Event listener for start button click
    startTourBtn.addEventListener('click', startTournament);

    // Event listener for Enter key to start tournament
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && gameState === 'begin') startTournament();
        // else if (e.key === 'Enter' && gameState = 'get_ready') 
        if (e.key === 'w') paddle1Velocity = gameState === 'play' ? -paddleSpeed : 0;
        if (e.key === 's') paddle1Velocity = gameState === 'play' ? paddleSpeed : 0;
        if (e.key === 'ArrowUp') paddle2Velocity = gameState === 'play' ? -paddleSpeed : 0;
        if (e.key === 'ArrowDown') paddle2Velocity = gameState === 'play' ? paddleSpeed : 0;
    });

    // Event listener for keyup to stop paddle movement
    document.addEventListener('keyup', function (e) {
        if (e.key === 'w' || e.key === 's') paddle1Velocity = 0;
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') paddle2Velocity = 0;
    });

    function startTournament() {
        if (areNotUnique(player1Input.value, player2Input.value, player3Input.value, player4Input.value)) {
            alert(':) Please enter unique names for all players.');
        } else if (player1Input.value && player2Input.value && player3Input.value && player4Input.value) {
            pl1Name = player1Input.value;
            pl2Name = player2Input.value;
            pl3Name = player3Input.value;
            pl4Name = player4Input.value;
            table_name1.textContent = pl1Name;
            table_name2.textContent = pl2Name;
            table_name3.textContent = pl3Name;
            table_name4.textContent = pl4Name;
            document.getElementById('player_form_4').style.display = 'none';
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
        let player1 = document.getElementById('player1Name_4');
        let player2 = document.getElementById('player2Name_4');
        winnerMessage = document.querySelector('#winnerMessage_4');
        if (winner1 === null) {
            player1.textContent = pl1Name;
            name1 = pl1Name;
            player2.textContent = pl2Name;
            name2 = pl2Name;
            winnerMessage.querySelector('#winnerName_4').innerHTML = `${pl1Name} vs ${pl2Name}!`;
            winnerMessage.style.display = 'block';
            start_game();
        } else if (winner2 === null) {
            player1.textContent = pl3Name;
            name1 = pl3Name;
            player2.textContent = pl4Name;
            name2 = pl4Name;
            winnerMessage.querySelector('#winnerName_4').innerHTML = `${pl3Name} vs ${pl4Name}!`;
            winnerMessage.style.display = 'block';
            start_game();
        } else if (winner_final === null) {
            player1.textContent = winner1;
            name1 = winner1;
            player2.textContent = winner2;
            name2 = winner2;
            winnerMessage.querySelector('#winnerName_4').innerHTML = `${winner1} vs ${winner2}!`;
            winnerMessage.style.display = 'block';
            start_game();
        }
    }
    
    function areNotUnique(str1, str2, str3, str4) {
        return str1 === str2 || str1 === str3 || str1 === str4 ||
        str2 === str3 || str2 === str4 ||
        str3 === str4;
    }
    
    function start_game() {
        console.log('We are in the game tour');
        initializeElements();
        updatePaddlePositions();
        moveBall(dx, dy, dxd, dyd)
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

    function endTournament(winnerName) {
        document.getElementById('megaWinner').style.display = 'block';
        document.getElementById('megaWinnerName').textContent = `🏆 ${winnerName} wins the Tournament! 🏆`;
        document.getElementById('exitTour').style.display = 'block';
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
            } 
            else if (parseInt(score_2.innerHTML) >= 3) {
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

        function displayWinner(winnerName, isFinal) {
            if (isFinal === true) {
                endTournament(winnerName);
            } else {
                winnerMessage = document.querySelector('#winnerMessage_4')
                winnerMessage.style.display = 'block';
                winnerMessage.querySelector('#winnerName_4').innerHTML = `${winnerName} wins!`;
                resetScores();
                resetBallPosition();
                document.getElementById('nextGame').style.display = 'block';
                document.getElementById('nextGame').addEventListener('click', function() {
                    document.getElementById('nextGame').style.display = 'none';
                    startMatch();
                });
            }
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
}
    

    
    // function startMatch() {
    //     document.getElementById('tournament-table').style.display = 'none';            document.getElementById('tournament-game').style.display = 'block';
    //     document.getElementById('tour_header').style.display = 'none';
    //     gameState = 'start';
    //     let player1 = document.getElementById('player1Name');
    //     let player2 = document.getElementById('player2Name');

    //     if (winner1 === null) {
    //         player1.textContent = pl1_name;
    //         name1 = pl1_name;
    //         player2.textContent = pl2_name;
    //         name2 = pl2_name;
    //         winnerMessage.querySelector('#winnerName').innerHTML = `${pl1_name} vs ${pl2_name}!`;
    //         winnerMessage.style.display = 'block';
    //         start_game(pl1_name, pl2_name, 'winner1');
    //     } else if (winner2 === null) {
    //         player1.textContent = pl3_name;
    //         name1 = pl3_name;
    //         player2.textContent = pl4_name;
    //         name2 = pl4_name
    //         winnerMessage.querySelector('#winnerName').innerHTML = `${pl3_name} vs ${pl4_name}!`;
    //         winnerMessage.style.display = 'block';
    //         start_game(pl3_name, pl4_name, 'winner2');
    //     } else if (winner_final === null) {
    //         player1.textContent = winner1;
    //         name1 = winner1;
    //         player2.textContent = winner2;
    //         name2 = winner2;
    //         winnerMessage.querySelector('#winnerName').innerHTML = `${winner1} vs ${winner2}!`;
    //         winnerMessage.style.display = 'block';
    //         start_game(winner1, winner2, 'winner_final');
    //     }
    // }
    
    // function areNotUnique(str1, str2, str3, str4) {
    //     return str1 === str2 || str1 === str3 || str1 === str4 ||
    //     str2 === str3 || str2 === str4 ||
    //     str3 === str4;
    // }
    
    // function start_game(player1Name, player2Name, winnerKey) {
    //     initializeElements();
    //     updatePaddlePositions();

    //     document.getElementById('nextGame').style.display = 'none';
    //     document.getElementById('nextGame').removeEventListener('click', startTournament);
    //     document.getElementById('nextGame').addEventListener('click', () => {
    //         document.getElementById('nextGame').style.display = 'none';
    //         startMatch();
    //     });
    //     // document.getElementById('exitTour').addEventListener('click', () => {
    //     //     document.getElementById('tournament-table').style.display = 'block';
    //     //     document.getElementById('tournament-game').style.display = 'none';
    //     // });
    // }
    
    // function initializeElements() {
    //     paddle_1 = document.querySelector('.paddle_1_off');
    //     paddle_2 = document.querySelector('.paddle_2_off');
    //     board = document.querySelector('.board');
    //     ball = document.querySelector('.ball');
    //     score_1 = document.querySelector('.player_1_score');
    //     score_2 = document.querySelector('.player_2_score');
    //     message = document.querySelector('.message');
    //     paddle_1_coord = paddle_1.getBoundingClientRect();
    //     paddle_2_coord = paddle_2.getBoundingClientRect();
    //     ball_coord = ball.getBoundingClientRect();
    //     board_coord = board.getBoundingClientRect();
    //     paddle_common = document.querySelector('.paddle_off').getBoundingClientRect();
    
    //     dx = Math.floor(Math.random() * 4) + 3;
    //     dy = Math.floor(Math.random() * 4) + 3;
    //        dxd = Math.floor(Math.random() * 2);
    //     dyd = Math.floor(Math.random() * 2);
    
    //     ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
    //     ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
    // }
    
    // function resetScores() {
    //     score_1.innerHTML = '0';
    //     score_2.innerHTML = '0';
    // }
    
    
    // function checkScores() {
    //     if (parseInt(score_1.innerHTML) >= 3) {
    //         if (!winner1)
    //         {
    //             winner1 = name1;
    //             gameState = 'stop';
    //             displayWinner(name1, false);
    //         }
    //         else if (!winner2)
    //         {
    //             winner2 = name1;
    //             gameState = 'stop';
    //             displayWinner(name1, false);
    //         }
    //         else if (!winner_final)
    //         {
    //             winner_final = name1;
    //             gameState = 'end';
    //             displayWinner(name1, true);
    //         }
    //         return true;
    //     } else if (parseInt(score_2.innerHTML) >= 3) {
    //         if (!winner1)
    //         {
    //             winner1 = name2;
    //             gameState = 'stop';
    //             displayWinner(name2, false);
    //         }
    //         else if (!winner2)
    //         {
    //             winner2 = name2;
    //             gameState = 'stop';
    //             displayWinner(name2, false);
    //         }
    //         else if (!winner_final)
    //         {
    //             winner_final = name2;
    //             gameState = 'end';
    //             displayWinner(name2, true);
    //         }
    //         return true;
    //     }
    //     return false;
    // }
    // function endTournament(winnerName) {
    //     document.getElementById('megaWinner').style.display = 'block';
    //     document.getElementById('megaWinnerName').textContent = `🏆 ${winnerName} wins the Tournament! 🏆`;
    //     document.getElementById('exitTour').style.display = 'block';
    // }
    
    // function displayWinner(winnerName, isFinal) {
    //     if (isFinal === true) {
    //         endTournament(winnerName);
    //     } else {
    //         winnerMessage.style.display = 'block';
    //         winnerMessage.querySelector('#winnerName').innerHTML = `${winnerName} wins!`;
    //         resetScores();
    //         resetBallPosition();
    //         document.getElementById('nextGame').style.display = 'block';
    //         document.getElementById('nextGame').addEventListener('click', function() {
    //             document.getElementById('nextGame').style.display = 'none';
    //             startMatch();
    //         });
    //     }
    // }
    
    // function resetBallPosition() {
    //     ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
    //     ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
            
    //     ball_coord = ball.getBoundingClientRect();
    // }
    
    // function moveBall(dx, dy, dxd, dyd) {
    //     ball_coord = ball.getBoundingClientRect();
    
    //     if (ball_coord.top <= board_coord.top || ball_coord.bottom >= board_coord.bottom) {
    //         dyd = 1 - dyd; // Reverse vertical direction
    //     }
    
    //     if (ball_coord.left <= paddle_1_coord.right && ball_coord.top >= paddle_1_coord.top && ball_coord.bottom <= paddle_1_coord.bottom) {
    //         dxd = 1; // Move ball to the right
    //         dx = Math.floor(Math.random() * 4) + 3;
    //         dy = Math.floor(Math.random() * 4) + 3;
    //     }
    
    //     if (ball_coord.right >= paddle_2_coord.left && ball_coord.top >= paddle_2_coord.top && ball_coord.bottom <= paddle_2_coord.bottom) {
    //         dxd = 0; // Move ball to the left
    //         dx = Math.floor(Math.random() * 4) + 3;
    //         dy = Math.floor(Math.random() * 4) + 3;
    //     }
    
    //     if (ball_coord.left <= board_coord.left || ball_coord.right >= board_coord.right) {
    //         if (ball_coord.left <= board_coord.left) {
    //             score_2.innerHTML = +score_2.innerHTML + 1;
    //         } else {
    //             score_1.innerHTML = +score_1.innerHTML + 1;
    //         }
    //         if (checkScores()) return;
    //         gameState = 'stop';
    //         resetBallPosition();
    //         setTimeout(() => {
    //             gameState = 'play';
    //             moveBall(dx, dy, dxd, dyd);
    //         }, 1000);
    //         return;
    //     }
    
    //     if ((ball_coord.top <= board_coord.top && ball_coord.left <= board_coord.left) ||
    //         (ball_coord.top <= board_coord.top && ball_coord.right >= board_coord.right) ||
    //         (ball_coord.bottom >= board_coord.bottom && ball_coord.left <= board_coord.left) ||
    //         (ball_coord.bottom >= board_coord.bottom && ball_coord.right >= board_coord.right)) {
    //         gameState = 'stop';
    //         message.innerHTML = 'Game Over! Press Enter to Play Again';
    //         return;
    //     }
    
    //     ball.style.top = ball_coord.top + dy * (dyd === 0 ? -1 : 1) + 'px';
    //     ball.style.left = ball_coord.left + dx * (dxd === 0 ? -1 : 1) + 'px';
    
    //     requestAnimationFrame(() => {
    //         moveBall(dx, dy, dxd, dyd);
    //     });
    // }
    
    // function updatePaddlePositions() {
    //     paddle_1.style.top = Math.min(Math.max(board_coord.top, paddle_1_coord.top + paddle1Velocity), board_coord.bottom - paddle_1_coord.height) + 'px';
    //     paddle_2.style.top = Math.min(Math.max(board_coord.top, paddle_2_coord.top + paddle2Velocity), board_coord.bottom - paddle_2_coord.height) + 'px';
    
    //     paddle_1_coord = paddle_1.getBoundingClientRect();
    //     paddle_2_coord = paddle_2.getBoundingClientRect();
    
    //     requestAnimationFrame(updatePaddlePositions);
    // }
    



//---------------------------------------------------------------------------------
// document.addEventListener('DOMContentLoaded', function () {
//     // On initial load, show the appropriate section
//     const initialSection = window.location.hash.substring(1) || 'offline-choose-mode';
//     showSection(initialSection);

//     const section1 = document.getElementById('offline-1x1');
//     const section2 = document.getElementById('offline-tournament');
    
//     if (section1 && window.getComputedStyle(section1).display === 'block') {
//         let gameState = 'start';
//         let paddle_1, paddle_2, board, ball, score_1, score_2;
//         let paddle_1_coord, paddle_2_coord, ball_coord, board_coord, paddle_common;
//         let dx, dy, dxd, dyd;
//         let player1Name = 'Player 1'; // Default names
//         let player2Name = 'Player 2';
//         const player1 = document.getElementById('player1Name');
//         const player2 = document.getElementById('player2Name');
//         let paddle1Velocity = 0, paddle2Velocity = 0;
//         const paddleSpeed = 2;
//         let message = document.getElementById('offline-message');
        

//         // Input fields and start button
//         let player1Input = document.getElementById('player1NameInput');
//         let player2Input = document.getElementById('player2NameInput');
//         let startGameBtn = document.getElementById('startGameBtn');

//         // Event listener for start button click
//         startGameBtn.addEventListener('click', function() {
//             message.style.display = 'block';
//             if (player1Input.value === player2Input.value) {
//                 alert('Please enter different names for both players.');
//             }
//             else if (player1Input.value && player2Input.value) {
//                 player1.textContent = player1Input.value;
//                 player1Name = player1Input.value;
//                 player2.textContent = player2Input.value;
//                 player2Name = player2Input.value;
//                 // Hide the name form
//                 document.getElementById('player_form').style.display = 'none';
//                 startGame();

//             } else {
//                 alert('Please enter names for both players.');
//             }
//         });

//         document.addEventListener('keydown', function(e) {
//             if (e.key === 'Enter') {
//                 if (player1Input.value === player2Input.value) {
//                     alert('Please enter different names for both players.');
//                 }
//                 else if (player1Input.value && player2Input.value) {
//                     player1.textContent = player1Input.value;
//                     player1Name = player1Input.value;
//                     player2.textContent = player2Input.value;
//                     player2Name = player2Input.value;
//                     // Hide the name form
//                     document.getElementById('player_form').style.display = 'none';
//                     startGame();

//                 } else {
//                     alert('Please enter names for both players.');
//                 }
//             }
//         });

//         function startGame() {

//             // Game initialization logic
//             initializeElements();
//             updatePaddlePositions();

//             // Listen for Enter key to start the game
//             document.addEventListener('keydown', function(e) {
//                 if (e.key === 'Enter') {
//                     if (gameState === 'stop') {
//                         // Hide winner message and reset game state
//                         winnerMessage.style.display = 'none';
//                         gameState = 'start';
//                         resetScores();
//                     }
//                     if (gameState === 'start') {
//                         if (player1Input.value === player2Input.value) {
//                             alert('Please enter different names for both players.');
//                         }
//                         else if (player1Input.value && player2Input.value) {
//                             player1.textContent = player1Input.value;
//                             player1Name = player1Input.value;
//                             player2.textContent = player2Input.value;
//                             player2Name = player2Input.value;
//                             gameState = 'play';
//                             message.innerHTML = 'Game Started';
//                             setTimeout(() => {
//                                 message.innerHTML = '';
//                             }, 1500);
//                             resetBallPosition();
//                             requestAnimationFrame(() => {
//                                 dx = Math.floor(Math.random() * 4) + 3;
//                                 dy = Math.floor(Math.random() * 4) + 3;
//                                 dxd = Math.floor(Math.random() * 2);
//                                 dyd = Math.floor(Math.random() * 2);
//                                 moveBall(dx, dy, dxd, dyd);
//                             });
//                             document.getElementById('player_form').style.display = 'none';
//                             //nameForm.style.display = 'none';
//                             // winnerMessage.style.display = 'none';
//                         } else {
//                             alert('Please enter names for both players.');
//                         }
//                     }
//                 }
//                 if (e.key === 'w') {
//                     if (gameState === 'play') {
//                         paddle1Velocity = -paddleSpeed;
//                     }
//                 }
//                 if (e.key === 's') {
//                     if (gameState === 'play') {
//                         paddle1Velocity = paddleSpeed;
//                     }
//                 }
//                 if (e.key === 'ArrowUp') {
//                     if (gameState === 'play') {
//                         paddle2Velocity = -paddleSpeed;
//                     }
//                 }
//                 if (e.key === 'ArrowDown') {
//                     if (gameState === 'play') {
//                         paddle2Velocity = paddleSpeed;
//                     }
//                 }
//             });
        
//             document.addEventListener('keyup', function(e) {
//                 if (e.key === 'w' || e.key === 's') {
//                     paddle1Velocity = 0;
//                 }
//                 if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
//                     paddle2Velocity = 0;
//                 }
//             });
//         }

//         function initializeElements() {
//             paddle_1 = document.querySelector('.paddle_1_off');
//             paddle_2 = document.querySelector('.paddle_2_off');
//             board = document.querySelector('.board');
//             ball = document.querySelector('.ball');
//             score_1 = document.querySelector('.player_1_score');
//             score_2 = document.querySelector('.player_2_score');
//             // message = document.querySelector('.message');
//             paddle_1_coord = paddle_1.getBoundingClientRect();
//             paddle_2_coord = paddle_2.getBoundingClientRect();
//             ball_coord = ball.getBoundingClientRect();
//             board_coord = board.getBoundingClientRect();
//             paddle_common = document.querySelector('.paddle_off').getBoundingClientRect();

//             dx = Math.floor(Math.random() * 4) + 3;
//             dy = Math.floor(Math.random() * 4) + 3;
//             dxd = Math.floor(Math.random() * 2);
//             dyd = Math.floor(Math.random() * 2);
//             ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
//             ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
//         }

//         function resetScores() {
//             score_1.innerHTML = '0';
//             score_2.innerHTML = '0';
//         }

//         function checkScores() {
//             if (parseInt(score_1.innerHTML) >= 3) {
//                 displayWinner(player1Name);
//                 return true;
//             } else if (parseInt(score_2.innerHTML) >= 3) {
//                 displayWinner(player2Name);
//                 return true;
//             }
//             return false;
//         }

//         function displayWinner(winnerName) {
//             gameState = 'stop';
//             message.style.display = 'block';
//             message.innerHTML = 'Game Over! Press Enter to Play Again';
//             winnerMessage.style.display = 'block';
//             winnerMessage.getElementById('winnerName').innerHTML = `${winnerName} wins!`;
//             gameState = 'start';
//             resetScores();
//             resetBallPosition();
//         }

//         function resetBallPosition() {
//             ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
//             ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
            
//             ball_coord = ball.getBoundingClientRect();
//         }

//         function moveBall(dx, dy, dxd, dyd) {
//             ball_coord = ball.getBoundingClientRect();

//             if (ball_coord.top <= board_coord.top || ball_coord.bottom >= board_coord.bottom) {
//                 dyd = 1 - dyd; // Reverse vertical direction
//             }

//             if (ball_coord.left <= paddle_1_coord.right && ball_coord.top >= paddle_1_coord.top && ball_coord.bottom <= paddle_1_coord.bottom) {
//                 dxd = 1; // Move ball to the right
//                 dx = Math.floor(Math.random() * 4) + 3;
//                 dy = Math.floor(Math.random() * 4) + 3;
//             }

//             if (ball_coord.right >= paddle_2_coord.left && ball_coord.top >= paddle_2_coord.top && ball_coord.bottom <= paddle_2_coord.bottom) {
//                 dxd = 0; // Move ball to the left
//                 dx = Math.floor(Math.random() * 4) + 3;
//                 dy = Math.floor(Math.random() * 4) + 3;
//             }

//             if (ball_coord.left <= board_coord.left || ball_coord.right >= board_coord.right) {
//                 if (ball_coord.left <= board_coord.left) {
//                     score_2.innerHTML = +score_2.innerHTML + 1;
//                 } else {
//                     score_1.innerHTML = +score_1.innerHTML + 1;
//                 }
//                 if (checkScores()) return;
//                 gameState = 'reset';
//                 resetBallPosition();
//                 setTimeout(() => {
//                     gameState = 'play';
//                     moveBall(dx, dy, dxd, dyd);
//                 }, 1000);
//                 return;
//             }

//             if ((ball_coord.top <= board_coord.top && ball_coord.left <= board_coord.left) ||
//                 (ball_coord.top <= board_coord.top && ball_coord.right >= board_coord.right) ||
//                 (ball_coord.bottom >= board_coord.bottom && ball_coord.left <= board_coord.left) ||
//                 (ball_coord.bottom >= board_coord.bottom && ball_coord.right >= board_coord.right)) {
//                 gameState = 'stop';
//                 message.innerHTML = 'Game Over! Press Enter to Play Again';
//                 return;
//             }

//             ball.style.top = ball_coord.top + dy * (dyd === 0 ? -1 : 1) + 'px';
//             ball.style.left = ball_coord.left + dx * (dxd === 0 ? -1 : 1) + 'px';

//             requestAnimationFrame(() => {
//                 moveBall(dx, dy, dxd, dyd);
//             });
//         }

//         function updatePaddlePositions() {
//             paddle_1.style.top = Math.min(Math.max(board_coord.top, paddle_1_coord.top + paddle1Velocity), board_coord.bottom - paddle_1_coord.height) + 'px';
//             paddle_2.style.top = Math.min(Math.max(board_coord.top, paddle_2_coord.top + paddle2Velocity), board_coord.bottom - paddle_2_coord.height) + 'px';

//             paddle_1_coord = paddle_1.getBoundingClientRect();
//             paddle_2_coord = paddle_2.getBoundingClientRect();

//             requestAnimationFrame(updatePaddlePositions);
//         }

//         initializeElements();
//         updatePaddlePositions();
//         updatePlayerNames();
//     }
    
//     else if (section2 && window.getComputedStyle(section2).display === 'block'){
//         let gameState = 'begin';
//         let name1, name2;
//         let pl1_name = 'Player 1';
//         let pl2_name = 'Player 2';
//         let pl3_name = 'Player 3';
//         let pl4_name = 'Player 4';
//         let table_name1 = document.getElementById('table_name1');
//         let table_name2 = document.getElementById('table_name2');
//         let table_name3 = document.getElementById('table_name3');
//         let table_name4 = document.getElementById('table_name4');
//         let paddle_1, paddle_2, board, ball, score_1, score_2, message;
//         let paddle_1_coord, paddle_2_coord, ball_coord, board_coord, paddle_common;
//         let dx, dy, dxd, dyd;
//         let winner1 = null;
//         let winner2 = null;
//         let winner_final = null;
    
//         let paddle1Velocity = 0, paddle2Velocity = 0;
//         const paddleSpeed = 5;
    
//         let pl1_input = document.getElementById('player1NameInput');
//         let pl2_input = document.getElementById('player2NameInput');
//         let pl3_input = document.getElementById('player3NameInput');
//         let pl4_input = document.getElementById('player4NameInput');
//         let startGameBtn = document.getElementById('startGameBtn');
    
//         // Event listener for start button click
//         startGameBtn.addEventListener('click', function() {
//             startTournament();
//         });
    
//         document.addEventListener('keydown', function(e) {
//             if (e.key === 'Enter' && gameState === 'begin') 
//             {
//                     startTournament();
//             } 
//             else if (gameState === 'start')
//             {
//                     if (gameState === 'start') {
//                         gameState = 'play';
//                         message.innerHTML = 'Game Started';
//                         resetBallPosition();
//                         requestAnimationFrame(() => {
//                             dx = Math.floor(Math.random() * 4) + 3;
//                             dy = Math.floor(Math.random() * 4) + 3;
//                             dxd = Math.floor(Math.random() * 2);
//                             dyd = Math.floor(Math.random() * 2);
//                             moveBall(dx, dy, dxd, dyd);
//                         });
//                         winnerMessage.style.display = 'none';
//                         setTimeout(() => {
//                             message.innerHTML = '';
//                         }, 1000);
//                     }
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
    
//         function startTournament() {
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
//                 // Hide / show :
//                 document.getElementById('player_form').style.display = 'none';
//                 document.getElementById('tournament-table').style.display = 'block';
//                 document.getElementById('go-to-match').addEventListener('click', startMatch);
//             } else {
//                 alert('Please enter unique names for all players.');
//             }
//         }
    
//         function startMatch() {
//             document.getElementById('tournament-table').style.display = 'none';
//             document.getElementById('tournament-game').style.display = 'block';
//             document.getElementById('tour_header').style.display = 'none';
//             gameState = 'start';
//             let player1 = document.getElementById('player1Name');
//             let player2 = document.getElementById('player2Name');
    
//             if (winner1 === null) {
//                 player1.textContent = pl1_name;
//                 name1 = pl1_name;
//                 player2.textContent = pl2_name;
//                 name2 = pl2_name;
//                 winnerMessage.querySelector('#winnerName').innerHTML = `${pl1_name} vs ${pl2_name}!`;
//                 winnerMessage.style.display = 'block';
//                 start_game(pl1_name, pl2_name, 'winner1');
//             } else if (winner2 === null) {
//                 player1.textContent = pl3_name;
//                 name1 = pl3_name;
//                 player2.textContent = pl4_name;
//                 name2 = pl4_name
//                 winnerMessage.querySelector('#winnerName').innerHTML = `${pl3_name} vs ${pl4_name}!`;
//                 winnerMessage.style.display = 'block';
//                 start_game(pl3_name, pl4_name, 'winner2');
//             } else if (winner_final === null) {
//                 player1.textContent = winner1;
//                 name1 = winner1;
//                 player2.textContent = winner2;
//                 name2 = winner2;
//                 winnerMessage.querySelector('#winnerName').innerHTML = `${winner1} vs ${winner2}!`;
//                 winnerMessage.style.display = 'block';
//                 start_game(winner1, winner2, 'winner_final');
//             }
//         }
    
//         function areNotUnique(str1, str2, str3, str4) {
//             return str1 === str2 || str1 === str3 || str1 === str4 ||
//             str2 === str3 || str2 === str4 ||
//             str3 === str4;
//         }
    
//         function start_game(player1Name, player2Name, winnerKey) {
//             initializeElements();
//             updatePaddlePositions();
    
//             document.getElementById('nextGame').style.display = 'none';
//             document.getElementById('nextGame').removeEventListener('click', startTournament);
//             document.getElementById('nextGame').addEventListener('click', () => {
//                 document.getElementById('nextGame').style.display = 'none';
//                 startMatch();
//             });
//             // document.getElementById('exitTour').addEventListener('click', () => {
//             //     document.getElementById('tournament-table').style.display = 'block';
//             //     document.getElementById('tournament-game').style.display = 'none';
//             // });
//         }
    
//         function initializeElements() {
//             paddle_1 = document.querySelector('.paddle_1_off');
//             paddle_2 = document.querySelector('.paddle_2_off');
//             board = document.querySelector('.board');
//             ball = document.querySelector('.ball');
//             score_1 = document.querySelector('.player_1_score');
//             score_2 = document.querySelector('.player_2_score');
//             message = document.querySelector('.message');
//             paddle_1_coord = paddle_1.getBoundingClientRect();
//             paddle_2_coord = paddle_2.getBoundingClientRect();
//             ball_coord = ball.getBoundingClientRect();
//             board_coord = board.getBoundingClientRect();
//             paddle_common = document.querySelector('.paddle_off').getBoundingClientRect();
    
//             dx = Math.floor(Math.random() * 4) + 3;
//             dy = Math.floor(Math.random() * 4) + 3;
//             dxd = Math.floor(Math.random() * 2);
//             dyd = Math.floor(Math.random() * 2);
    
//             ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
//             ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
//         }
    
//         function resetScores() {
//             score_1.innerHTML = '0';
//             score_2.innerHTML = '0';
//         }
    
    
//         function checkScores() {
//             if (parseInt(score_1.innerHTML) >= 3) {
//                 if (!winner1)
//                 {
//                     winner1 = name1;
//                     gameState = 'stop';
//                     displayWinner(name1, false);
//                 }
//                 else if (!winner2)
//                 {
//                     winner2 = name1;
//                     gameState = 'stop';
//                     displayWinner(name1, false);
//                 }
//                 else if (!winner_final)
//                 {
//                     winner_final = name1;
//                     gameState = 'end';
//                     displayWinner(name1, true);
//                 }
//                 return true;
//             } else if (parseInt(score_2.innerHTML) >= 3) {
//                 if (!winner1)
//                 {
//                     winner1 = name2;
//                     gameState = 'stop';
//                     displayWinner(name2, false);
//                 }
//                 else if (!winner2)
//                 {
//                     winner2 = name2;
//                     gameState = 'stop';
//                     displayWinner(name2, false);
//                 }
//                 else if (!winner_final)
//                 {
//                     winner_final = name2;
//                     gameState = 'end';
//                     displayWinner(name2, true);
//                 }
//                 return true;
//             }
//             return false;
//         }
//         function endTournament(winnerName) {
//             document.getElementById('megaWinner').style.display = 'block';
//             document.getElementById('megaWinnerName').textContent = `🏆 ${winnerName} wins the Tournament! 🏆`;
//             document.getElementById('exitTour').style.display = 'block';
//         }
    
//         function displayWinner(winnerName, isFinal) {
//             if (isFinal === true) {
//                 endTournament(winnerName);
//             } else {
//                 winnerMessage.style.display = 'block';
//                 winnerMessage.querySelector('#winnerName').innerHTML = `${winnerName} wins!`;
//                 resetScores();
//                 resetBallPosition();
//                 document.getElementById('nextGame').style.display = 'block';
//                 document.getElementById('nextGame').addEventListener('click', function() {
//                     document.getElementById('nextGame').style.display = 'none';
//                     startMatch();
//                 });
//             }
//         }
    
//         function resetBallPosition() {
//             ball.style.top = board_coord.top + (board_coord.height / 2) - (ball_coord.height / 2) + 'px';
//             ball.style.left = board_coord.left + (board_coord.width / 2) - (ball_coord.width / 2) + 'px';
            
//             ball_coord = ball.getBoundingClientRect();
//         }
    
//         function moveBall(dx, dy, dxd, dyd) {
//             ball_coord = ball.getBoundingClientRect();
    
//             if (ball_coord.top <= board_coord.top || ball_coord.bottom >= board_coord.bottom) {
//                 dyd = 1 - dyd; // Reverse vertical direction
//             }
    
//             if (ball_coord.left <= paddle_1_coord.right && ball_coord.top >= paddle_1_coord.top && ball_coord.bottom <= paddle_1_coord.bottom) {
//                 dxd = 1; // Move ball to the right
//                 dx = Math.floor(Math.random() * 4) + 3;
//                 dy = Math.floor(Math.random() * 4) + 3;
//             }
    
//             if (ball_coord.right >= paddle_2_coord.left && ball_coord.top >= paddle_2_coord.top && ball_coord.bottom <= paddle_2_coord.bottom) {
//                 dxd = 0; // Move ball to the left
//                 dx = Math.floor(Math.random() * 4) + 3;
//                 dy = Math.floor(Math.random() * 4) + 3;
//             }
    
//             if (ball_coord.left <= board_coord.left || ball_coord.right >= board_coord.right) {
//                 if (ball_coord.left <= board_coord.left) {
//                     score_2.innerHTML = +score_2.innerHTML + 1;
//                 } else {
//                     score_1.innerHTML = +score_1.innerHTML + 1;
//                 }
//                 if (checkScores()) return;
//                 gameState = 'stop';
//                 resetBallPosition();
//                 setTimeout(() => {
//                     gameState = 'play';
//                     moveBall(dx, dy, dxd, dyd);
//                 }, 1000);
//                 return;
//             }
    
//             if ((ball_coord.top <= board_coord.top && ball_coord.left <= board_coord.left) ||
//                 (ball_coord.top <= board_coord.top && ball_coord.right >= board_coord.right) ||
//                 (ball_coord.bottom >= board_coord.bottom && ball_coord.left <= board_coord.left) ||
//                 (ball_coord.bottom >= board_coord.bottom && ball_coord.right >= board_coord.right)) {
//                 gameState = 'stop';
//                 message.innerHTML = 'Game Over! Press Enter to Play Again';
//                 return;
//             }
    
//             ball.style.top = ball_coord.top + dy * (dyd === 0 ? -1 : 1) + 'px';
//             ball.style.left = ball_coord.left + dx * (dxd === 0 ? -1 : 1) + 'px';
    
//             requestAnimationFrame(() => {
//                 moveBall(dx, dy, dxd, dyd);
//             });
//         }
    
//         function updatePaddlePositions() {
//             paddle_1.style.top = Math.min(Math.max(board_coord.top, paddle_1_coord.top + paddle1Velocity), board_coord.bottom - paddle_1_coord.height) + 'px';
//             paddle_2.style.top = Math.min(Math.max(board_coord.top, paddle_2_coord.top + paddle2Velocity), board_coord.bottom - paddle_2_coord.height) + 'px';
    
//             paddle_1_coord = paddle_1.getBoundingClientRect();
//             paddle_2_coord = paddle_2.getBoundingClientRect();
    
//             requestAnimationFrame(updatePaddlePositions);
//         }
    
//         // initializeElements();
//         // updatePaddlePositions();
//         // updatePlayerNames();
//     }
// });
