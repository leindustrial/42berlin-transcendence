document.addEventListener('DOMContentLoaded', function() {

    function showSection(sectionIds) {
        document.querySelectorAll('#screen > .container, form').forEach(function(section) {
            if (sectionIds.includes(section.id)) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }


    document.getElementById('2pl').addEventListener('click', function() {
        showSection(['header-game', 'basic-game']);

        // Basic game:
        let gameState = 'start'; 
        let paddle_1 = document.querySelector('.paddle_1'); 
        let paddle_2 = document.querySelector('.paddle_2'); 
        let board = document.querySelector('.board'); 
        let initial_ball = document.querySelector('.ball'); 
        let ball = document.querySelector('.ball'); 
        let score_1 = document.querySelector('.player_1_score'); 
        let score_2 = document.querySelector('.player_2_score'); 
        let message = document.querySelector('.message'); 
        let paddle_1_coord = paddle_1.getBoundingClientRect(); 
        let paddle_2_coord = paddle_2.getBoundingClientRect(); 
        let initial_ball_coord = initial_ball.getBoundingClientRect(); 
        let ball_coord = initial_ball_coord; 
        let board_coord = board.getBoundingClientRect(); 
        let paddle_common = document.querySelector('.paddle').getBoundingClientRect(); 

        let dx = Math.floor(Math.random() * 4) + 3; 
        let dy = Math.floor(Math.random() * 4) + 3; 
        let dxd = Math.floor(Math.random() * 2); 
        let dyd = Math.floor(Math.random() * 2); 

        document.addEventListener('keydown', (e) => { 
            if (e.key == 'Enter') { 
                if (gameState === 'start') {
                    gameState = 'play'; 
                    message.innerHTML = 'Game Started'; 
                    message.style.left = '42vw'; 
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
            if (gameState == 'play') { 
                if (e.key == 'w') { 
                    paddle_1.style.top = Math.max(board_coord.top, paddle_1_coord.top - window.innerHeight * 0.06) + 'px'; 
                    paddle_1_coord = paddle_1.getBoundingClientRect(); 
                } 
                if (e.key == 's') { 
                    paddle_1.style.top = Math.min(board_coord.bottom - paddle_common.height, paddle_1_coord.top + window.innerHeight * 0.06) + 'px'; 
                    paddle_1_coord = paddle_1.getBoundingClientRect(); 
                } 
                if (e.key == 'ArrowUp') { 
                    paddle_2.style.top = Math.max(board_coord.top, paddle_2_coord.top - window.innerHeight * 0.1) + 'px'; 
                    paddle_2_coord = paddle_2.getBoundingClientRect(); 
                } 
                if (e.key == 'ArrowDown') { 
                    paddle_2.style.top = Math.min(board_coord.bottom - paddle_common.height, paddle_2_coord.top + window.innerHeight * 0.1) + 'px'; 
                    paddle_2_coord = paddle_2.getBoundingClientRect(); 
                } 
            } 
        }); 

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

        function resetBallPosition() {
            ball.style.top = initial_ball_coord.top + 'px'; 
            ball.style.left = initial_ball_coord.left + 'px'; 
            ball_coord = ball.getBoundingClientRect();
        }
    });

    document.getElementById('restart').addEventListener('click', function() {
        showSection(['header-welcome', 'start', 'footer-welcome']);
    });

    document.getElementById('play').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission
        var playerName = document.getElementById('player_name1').value;
        document.getElementById('player_left').textContent = playerName;
        showSection(['header-game', 'one_player', 'footer-game']);
    });

    // Initially show only the start section
    showSection(['header-welcome', 'start', 'footer-welcome']);

});
