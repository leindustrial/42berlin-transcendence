export function game_handler() {
	const online1x1Html = `
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
	`
	
	setElementinnerHTML(document.getElementById('game-place'), online1x1Html);
	showElement(document.getElementById('game-place'));
	const socket = new WebSocket(`ws://${window.location.host}/ws/pong/`);
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
	const originalWidth = 900;
	const originalHeight = 600;

	function updateGameDimensions() {
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		const aspectRatio = originalWidth / originalHeight;

			// Calculate the game area dimensions based on the window size
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
				//console.log('Game state received', data.game_state);
				updateGameState(data.game_state);
				break;
			case 'game_started':
				// message.style.fontSize = '40px';
				message.textContent = data.message;
				setTimeout(() => {
					message.textContent = '';
					// message.style.fontSize = '10px';
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
		ball.style.left = `${(state.ball.x / originalWidth) * 100}%`;
		ball.style.top = `${(state.ball.y / originalHeight) * 100}%`;

		paddle1.style.top = `${(state.paddle1 / originalHeight) * 100}%`;
		paddle2.style.top = `${(state.paddle2 / originalHeight) * 100}%`;

		score1.textContent = state.score.player1;
		score2.textContent = state.score.player2;

	}

	function resetGame() {
		ball.style.left = '450px';
		ball.style.top = '290px';
		paddle1.style.top = '260px';
		paddle2.style.top = '260px';
		score1.textContent = '0';
		score2.textContent = '0';
	}

	socket.onclose = (event) => {
		switch (event.code) {
			case 3001:
				message.textContent = 'Player already joined the game. You will be redirected';
				break;
			case 3002:
				message.textContent = 'Connection closed: no available game session';
				break;
			case 3003:
				message.textContent = 'Connection closed for unauthenticated user';
				break;
			default:
				message.textContent = 'You will be redirected to the home page.';
		}
		setTimeout(() => {
			hideElement(document.getElementById('game-place'));
			showElement(document.getElementById('get-started'));
			window.location.hash = 'get-started';
		}, 3000);
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
}