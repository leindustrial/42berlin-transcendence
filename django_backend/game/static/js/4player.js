document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket(`ws://${window.location.host}/ws/4pong/`);
    const gameArea = document.getElementById('game-areas');
    const message = document.getElementById('message');
    const ball = document.getElementById('ball');
    const paddle1 = document.getElementById('paddles1');
    const paddle2 = document.getElementById('paddles2');
    const paddle3 = document.getElementById('paddles3');
    const paddle4 = document.getElementById('paddles4');
    const score1 = document.getElementById('score1');
    const score2 = document.getElementById('score2');
	const team1 = document.getElementById('team1-name');
	const team2 = document.getElementById('team2-name');

    message.textContent = 'Waiting for players to join...';
    const originalWidth = 800;
    const originalHeight = 400;

    // function updateGameDimensions() {
    //     const windowWidth = window.innerWidth;
    //     const windowHeight = window.innerHeight;
    //     const aspectRatio = originalWidth / originalHeight;

    //     if (windowWidth > originalWidth && windowHeight > originalHeight) {
    //         gameArea.style.width = `${originalWidth}px`;
    //         gameArea.style.height = `${originalHeight}px`;
    //     } else if (windowWidth / windowHeight > aspectRatio) {
    //         gameArea.style.height = '100vh';
    //         gameArea.style.width = `${100 * aspectRatio}vh`;
    //     } else {
    //         gameArea.style.width = '100vw';
    //         gameArea.style.height = `${100 / aspectRatio}vw`;
    //     }
    // }

    // updateGameDimensions();
    // window.addEventListener('resize', updateGameDimensions);

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
                message.textContent = `${data.name} joined the game`;
                break;
            case 'both_players_joined':
                message.textContent = `Teams ${data.team1_name} and ${data.team2_name} joined. Get ready!`;
				team1.textContent = data.team1_name;
				team2.textContent = data.team2_name;
                break;
            case 'countdown':
                message.textContent = data.message;
                break;
            case 'game_state':
                updateGameState(data.game_state);
                break;
            case 'game_started':
                message.style.fontSize = '40px';
                message.textContent = data.message;
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

    // function updateGameState(state) {
    //     ball.style.left = `${(state.ball.x / originalWidth) * 100}%`;
    //     ball.style.top = `${(state.ball.y / originalHeight) * 100}%`;

    //     paddle1.style.top = `${(state.paddle1 / originalHeight) * 100}%`;
    //     paddle2.style.top = `${(state.paddle2 / originalHeight) * 100}%`;
    //     paddle3.style.top = `${(state.paddle3 / originalWidth) * 100}%`;
    //     paddle4.style.top = `${(state.paddle4 / originalWidth) * 100}%`;

    //     score1.textContent = state.score.team1;
    //     score2.textContent = state.score.team2;
    // }

    function resetGame() {
        ball.style.left = '390px';
        ball.style.top = '190px';
        paddle1.style.top = '160px';
        paddle2.style.top = '160px';
        paddle3.style.top = '160px';
        paddle4.style.top = '160px';
        score1.textContent = '0';
        score2.textContent = '0';
    }

	function updateGameState(state) {
		gameArea.style.width = originalWidth;
		gameArea.style.height = originalHeight;
        ball.style.left = `${state.ball.x}px`;
        ball.style.top = `${state.ball.y}px`;
        paddle1.style.top = `${state.paddle1}px`;
        paddle2.style.top = `${state.paddle2}px`;
		paddle3.style.top = `${state.paddle3}px`;
		paddle4.style.top = `${state.paddle4}px`;
        score1.textContent = state.score.team1;
        score2.textContent = state.score.team2;
	}
    socket.onclose = (event) => {
        message.textContent = 'Connection closed. Please refresh the page.';
    };

    socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
        message.textContent = 'An error occurred. Please refresh the page.';
    };
});
