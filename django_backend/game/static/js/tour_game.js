export function startGame(sessionId, oldSocket) {
	const tourGameHTML = `
		<div id="game-area">
			<p class="text-center"><h3 id="message" class="message"></h3></p>
			<div id="ball"></div>
			<div id="paddle1" class="paddle"></div>
			<div id="paddle2" class="paddle"></div>
			<div id="player1-name" class="player-name"></div>
			<div id="score1">0</div>
			<div id="player2-name" class="player-name"></div>
			<div id="score2">0</div>
		</div>
	`;

	setElementinnerHTML(document.getElementById('tour-game'), tourGameHTML);
	showElement(document.getElementById('tour-game'));

	const socket = new WebSocket(`wss://${window.location.host}/tour_game/${sessionId}/`);
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
				player1.textContent = data.name;
				setTimeout(() => {
					message.textContent = '';
				}, 1000);
				break;
			case 'both_players_joined':
				console.log('Both players joined');
				message.textContent = data.message;
				console.log(data.name);
				player2.textContent = data.name;
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
				break;
			case 'game_stop':
				message.textContent = data.message;
				break;
			case 'player_rejoined':
				message.textContent = `${data.name} rejoined the game`;
				player1.textContent = data.name;
				player2.textContent = data.opponent;
				setTimeout(() => {
					message.textContent = '';
				}, 3000);
				break;
		}
	};

	function updateGameState(state) {
		ball.style.left = `${state.ball.x}px`;
		ball.style.top = `${state.ball.y}px`;
	
		paddle1.style.top = `${state.paddle1}px`;
		paddle2.style.top = `${state.paddle2}px`;
	
		score1.textContent = state.score.player1;
		score2.textContent = state.score.player2;
	}

	socket.onclose = (event) => {
		message.textContent = 'You will be redirected to the home page.';
		if (socket.readyState === WebSocket.CLOSED) {
			setTimeout(() => {
				window.location.hash = 'tour-hall';
			}, 3000);
		}
	};

	socket.onerror = (error) => {
		console.error('WebSocket Error:', error);
		message.textContent = 'An error occurred. Please refresh the page.';
	};

	function cleanupGame() {
		console.log('Cleaning up game');
		socket.close();
	};

	window.addEventListener('beforeunload', cleanupGame);
	window.addEventListener('popstate', cleanupGame);
};
