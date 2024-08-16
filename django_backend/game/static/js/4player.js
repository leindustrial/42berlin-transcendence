export function game_handler_4pl() {
	let messageTimeout;
	
	const online4x4Html = `
		<div id="four_game-area">
			<p class="text-center"><h3 id="four_message" class="four_message"></h3></p>
			<div id="four_ball"></div>
			<div id="four_paddle1" class="four_paddle"></div>
			<div id="four_paddle2" class="four_paddle"></div>
			<div id="four_paddle3" class="four_paddle"></div>
			<div id="four_paddle4" class="four_paddle"></div>
			<div id="four_player1-name" class="player-name"></div>
			<div id="four_score1">0</div>
			<div id="four_player2-name" class="player-name"></div>
			<div id="four_score2">0</div>
			<div id="four_player3-name" class="player-name"></div>
			<div id="four_score3">0</div>
			<div id="four_player4-name" class="player-name"></div>
			<div id="four_score4">0</div>
		</div>
	`
	setElementinnerHTML(document.getElementById('online-4'), online4x4Html);
	showElement(document.getElementById('online-4'));

	const socket = new WebSocket(`wss://${window.location.host}/wss/4pong/`);
	const gameArea = document.getElementById('four_game-area');
	const message = document.getElementById('four_message');
	const ball = document.getElementById('four_ball');
	const paddle1 = document.getElementById('four_paddle1');
	const paddle2 = document.getElementById('four_paddle2');
	const paddle3 = document.getElementById('four_paddle3');
	const paddle4 = document.getElementById('four_paddle4');
	const score1 = document.getElementById('four_score1');
	const score2 = document.getElementById('four_score2');
	const score3 = document.getElementById('four_score3');
	const score4 = document.getElementById('four_score4');
	const player1Name = document.getElementById('four_player1-name');
	const player2Name = document.getElementById('four_player2-name');
	const player3Name = document.getElementById('four_player3-name');
	const player4Name = document.getElementById('four_player4-name');

	message.textContent = `${WAIT}`;

	document.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
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
				break;
			case 'both_players_joined':
				message.textContent = `${GET_READY}`;
				// names = data.names;  this variable didn't work, it was not defined. That's why names were not showed!
				player1Name.textContent = data.names[0];
				player2Name.textContent = data.names[1];
				player3Name.textContent = data.names[2];
				player4Name.textContent = data.names[3];
				break;
			case 'countdown':
				message.textContent = data.message;
				break;
			case 'game_state_update':
				updateGameState(data.game_state);
				// console.log(data.game_state);
				break;
			case 'game_started':
				message.textContent = `${STARTED}!`;
				messageTimeout = setTimeout(() => {
					message.textContent = '';
				}, 1000);
				break;
			case 'game_stop': //this case was missing. that's why we didn't see a message if the player disconnected
					message.textContent = `${WAIT_REJOIN}`;
					break;
			case 'game_over':
				message.textContent = `${GAME_OVER2} ${data.winner} ${WON}!`;
				break;

		}
	};

	function updateGameState(state) {
		ball.style.left = `${state.ball.x}px`;
		ball.style.top = `${state.ball.y}px`;
		paddle1.style.top = `${state.paddle1}px`;
		paddle2.style.left = `${state.paddle2}px`;
		paddle3.style.top = `${state.paddle3}px`;
		paddle4.style.left = `${state.paddle4}px`;
		score1.textContent = state.score.player1;
		score2.textContent = state.score.player2;
		score3.textContent = state.score.player3;
		score4.textContent = state.score.player4;
		if (state.out_of_bounds) {
			message.textContent = `${OUT}!`;
			messageTimeout = setTimeout(() => {
				message.textContent = '';
			}, 1000);
		}
		if (state.goal) {
			message.textContent = `${GOAL}!`;
			messageTimeout = setTimeout(() => {
				message.textContent = '';
		}, 1000);
		message.style.fontSize = '10px';
		}
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
		message.textContent = 'An error occurred. Please refresh the page';
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
	}
	
	function setupEventListeners() {
		window.addEventListener('beforeunload', cleanupGame);
		window.addEventListener('popstate', cleanupGame);
	}

	setupEventListeners();
}

