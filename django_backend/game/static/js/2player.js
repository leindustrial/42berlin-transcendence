export function game_handler() {
	let messageTimeout;

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
	
	setElementinnerHTML(document.getElementById('online-1x1'), online1x1Html);
	showElement(document.getElementById('online-1x1'));
	const socket = new WebSocket(`wss://${window.location.host}/wss/pong/`);
	const gameArea = document.getElementById('game-area');
	const message = document.getElementById('message');
	const ball = document.getElementById('ball');
	const paddle1 = document.getElementById('paddle1');
	const paddle2 = document.getElementById('paddle2');
	const score1 = document.getElementById('score1');
	const score2 = document.getElementById('score2');
	const player1 = document.getElementById('player1-name');
	const player2 = document.getElementById('player2-name');
	let stat_check = false;

	message.textContent = `${WAIT}`;

	document.addEventListener('keydown', (e) => {
		if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && stat_check === true) {
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
				message.textContent = `${data.name} ${JOINED}`;
				player1.textContent = data.name;
				messageTimeout = setTimeout(() => {
					message.textContent = '';
				}, 1000);
				break;
			case 'both_players_joined':
				console.log('Both players joined');
				message.textContent = `${GET_READY}`;
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
				message.textContent = `${STARTED}!`;
				stat_check = true;
				messageTimeout = setTimeout(() => {
					message.textContent = '';
				}, 1000);
				break;
			case 'game_over':
				message.textContent = `${GAME_OVER2} ${data.winner} ${WON}!`;
				stat_check = false;
				break;
			case 'game_stop':
				if (messageTimeout) {
					clearTimeout(messageTimeout);
				}
				message.textContent = `${WAIT_REJOIN}`;
				stat_check = false;
				break;
			case 'player_rejoined':
				message.textContent = `${data.name} ${REJOINED}`;
				player1.textContent = data.name;
				player2.textContent = data.opponent;
				stat_check = true;
				messageTimeout = setTimeout(() => {
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
		switch (event.code) {
			case 3001:
				message.textContent = `${REDIR}`;
				break;
			case 3002:
				message.textContent = `${NO_SESSION}`;
				break;
			case 3003:
				message.textContent = `${CON_CLOSED}`;
				break;
			default:
				message.textContent = `${REDIR_HOME}`;
		}
		if (socket.readyState === WebSocket.CLOSED) {
			messageTimeout = setTimeout(() => {
				window.location.hash = 'get-started';
			}, 3000);
		}
	};

	socket.onerror = (error) => {
		console.error('WebSocket Error:', error);
		message.textContent = `${ERR}`;
	};

	function cleanupGame() {
		console.log('Cleaning up game');
		socket.close();
		deactivateListeners();
		//history.pushState(null, '', window.location.href);
	};

	function deactivateListeners() {
		window.removeEventListener('beforeunload', cleanupGame);
		window.removeEventListener('popstate', cleanupGame);
	};
	
	function setupEventListeners() {
		window.addEventListener('beforeunload', cleanupGame);
		window.addEventListener('popstate', cleanupGame);
	};

	setupEventListeners();
}