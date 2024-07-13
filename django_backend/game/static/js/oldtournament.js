document.addEventListener('DOMContentLoaded', () => {
    const display_name = JSON.parse(document.getElementById('display_name').textContent)
    const socket = new WebSocket('ws://' + window.location.host + '/ws/tournament/' + display_name + '/');
    const gameArea = document.getElementById('game-area');
    const message = document.getElementById('message');
    const ball = document.getElementById('ball');
    const paddle1 = document.getElementById('paddle1');
    const paddle2 = document.getElementById('paddle2');
    const score1 = document.getElementById('score1');
    const score2 = document.getElementById('score2');
    const player1 = document.getElementById('player1-name');
    const player2 = document.getElementById('player2-name');


    message.textContent = 'Waiting for players to join...';
    const originalWidth = 780;
    const originalHeight = 380;

    function updateGameDimensions() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const aspectRatio = originalWidth / originalHeight;

        if (windowWidth > originalWidth && windowHeight > originalHeight) {
            gameArea.style.width = `${originalWidth}px`;
            gameArea.style.height = `${originalHeight}px`;
		} else if (windowWidth / windowHeight > aspectRatio) {
            // Window is wider than the game aspect ratio
            gameArea.style.height = '100vh';
            gameArea.style.width = `${100 * aspectRatio}vh`;
        } else {
            // Window is taller than the game aspect ratio
            gameArea.style.width = '100vw';
            gameArea.style.height = `${100 / aspectRatio}vw`;
        }
    }

    updateGameDimensions();
    window.addEventListener('resize', updateGameDimensions);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            socket.send(JSON.stringify({
                type: 'paddle_move',
                key: e.key
            }));
        }
    });

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case 'player_joined':
                console.log('A player joined');
                message.textContent = `Waiting for ${data.name} more players to join...`;
                break;
            case 'both_players_joined':
                console.log('Both players joined');
                message.textContent = data.message;
                console.log(data.name);
                player1.textContent = data.name1;
                player2.textContent = data.name;
                break;
            case 'countdown':
                message.textContent = data.message;
                break;
            case 'game_state':
                //console.log('Game state received', data.game_state);
                updateGameState(data.game_state);
                break;
            case 'game_started':
                message.style.fontSize = '40px';
                message.textContent = data.message;
                //reset the font size

                setTimeout(() => {
                    message.textContent = '';
                    message.style.fontSize = '10px';
                }, 1000);
                break;
            case 'game_over':
                message.textContent = `Game Over! ${data.winner} wins!`;
                resetGame();
                break;
        }
    };

    function updateGameState(state) {
        ball.style.left = `${(state.ball.x / originalWidth) * 100}%`;
        ball.style.top = `${(state.ball.y / originalHeight) * 100}%`;

        paddle1.style.top = `${(state.paddle1 / originalHeight) * 100}%`;
        paddle2.style.top = `${(state.paddle2 / originalHeight) * 100}%`;

        score1.textContent = state.score.player1;
        score2.textContent = state.score.player2;

    }
    /* function updateGameState(state) {
        ball.style.left = `${state.ball.x}px`;
        ball.style.top = `${state.ball.y}px`;
        paddle1.style.top = `${state.paddle1}px`;
        paddle2.style.top = `${state.paddle2}px`;
        score1.textContent = state.score.player1;
        score2.textContent = state.score.player2;
    } */

    function resetGame() {
        ball.style.left = '390px';
        ball.style.top = '190px';
        paddle1.style.top = '160px';
        paddle2.style.top = '160px';
        score1.textContent = '0';
        score2.textContent = '0';
    }

    socket.onclose = (event) => {
        message.textContent = 'You will be redirected to the home page.';
		setTimeout(() => {
			window.location.href = '/';
		}, 3000);
    };

    socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
        message.textContent = 'An error occurred. Please refresh the page.';
    };
});
