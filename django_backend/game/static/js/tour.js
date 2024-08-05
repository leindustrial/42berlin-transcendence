export async function startTournament() {
	var username;
	try {
        const response = await fetch('/api/get-username/');
        const data = await response.json();
        username = data.username;
        console.log(username);
    } catch (error) {
        console.error('Error fetching username:', error);
        return;
    }
	
	const onlineTourHtml = `
		<div id="tournament-page">
			<h1 class="text-center">Tournament</h1>
			<p class="welcome">Welcome, <span id="usernames"></span>!</p>
			<div id="champ"></div>
			<div id="info"></div>
			<div class="tournament">
				<div class="round" id="semi-finals">
					<h2 class="text-center">Semi-finals</h2>
					<div class="match" id="match-semi-final-0">
						<h3>Match 1</h3>
						<p class="player player1">Waiting for player</p>
						<p class="vs">vs</p>
						<p class="player player2">Waiting for player</p>
					</div>
					<div class="match" id="match-semi-final-1">
						<h3>Match 2</h3>
						<p class="player player1">Waiting for player</p>
						<p class="vs">vs</p>
						<p class="player player2">Waiting for player</p>
					</div>
				</div>
				<div class="round">
					<h2 class="text-center">Final</h2>
					<div class="match" id="match-final">
						<h3>Final Match</h3>
						<p class="player player1">Waiting for player</p>
						<p class="vs">vs</p>
						<p class="player player2">Waiting for player</p>
					</div>
				</div>
			</div>
			<button id="go-to-match" class="hidden match-button">Go to Match</button>
		</div>
	`;
	console.log('username =', username);
	const tourHallElement = document.getElementById('tour-hall');
	if (tourHallElement) {
		tourHallElement.innerHTML = onlineTourHtml;
		showElement(tourHallElement);
		window.location.hash = 'tour-hall';
	} else {
		console.error('tour-hall element not found');
		return;
	}

	const tournamentSocket = new WebSocket(
		'ws://' + window.location.host + '/ws/tournament/'
	);
	document.getElementById('usernames').textContent = username;
	tournamentSocket.onmessage = (event) => {
		const data = JSON.parse(event.data);
		console.log(data);
		switch (data.type) {
			case 'update_tournament_chart':
				updateTournament(data.tournament);
				if (data.champion) {
					const championElement = document.getElementById('champ');
					if (championElement) {
						championElement.textContent =  '\u{1F451}' + data.champion +  '\u{1F451}';
					}
				}
				break;
			case 'go_to_game':
				updateTournament(data.tournament);
				const goToMatchButton = document.getElementById('go-to-match');
				if (goToMatchButton) {
					if (data.game_ready) {
						goToMatchButton.classList.remove('hidden');
						goToMatchButton.setAttribute('data-session-id', data.session_id);
					} else {
						goToMatchButton.classList.add('hidden');
					}
				}
				break;
			case 'go_back_to_home':
				const infoElement = document.getElementById('info');
				if (infoElement) infoElement.textContent = data.message;
				const goToMatchButtons = document.getElementById('go-to-match');
				if (goToMatchButtons) goToMatchButtons.classList.add('hidden');
				tournamentSocket.close();
				break;
		}
	};

	tournamentSocket.onclose = function(e) {
		const infoElement = document.getElementById('info');
		if (infoElement) {
			switch (e.code) {
				case 3001:
					infoElement.textContent = 'Player already in tournament, You may return to home page';
					break;
				case 3002:
					infoElement.textContent = 'Tournament is full at the moment, You may return to home page';
					break;
			}
		}
	};

	tournamentSocket.onerror = function(e) {
		console.log('Error', e);
	};

	const goToMatchButton = document.getElementById('go-to-match');
	if (goToMatchButton) {
		$(document).on('click', '.match-button', function(event) {
			tournamentSocket.send(JSON.stringify({
				'action': 'going_to_game',
				'username': username
			}));
			setTimeout(() => {
				tournamentSocket.close();
				const sessionId = goToMatchButton.getAttribute('data-session-id');
				hideElement(document.getElementById('tour-hall'));
				event.preventDefault();
				window.location.hash = "tour-game!" + sessionId;
				import('./tour_game.js').then(module => {
					module.startGame(sessionId, tournamentSocket);
				});
			}, 1000);
		});
	}

	function updateTournament(tournament) {
		document.getElementById('usernames').textContent = username;
		for (let i = 0; i < tournament.semi_finals.length; i++) {
			const match = tournament.semi_finals[i];
			const matchElement = document.getElementById(`match-semi-final-${i}`);
			console.log(`Checking match-semi-final-${i}`, matchElement);
			if (matchElement) {
				const player1Element = matchElement.querySelector('.player1');
				const player2Element = matchElement.querySelector('.player2');
				
				console.log(match.player1, match.player2);
				if (player1Element) player1Element.textContent = match.player1 || 'Waiting for player';
				if (player2Element) player2Element.textContent = match.player2 || 'Waiting for player';

				if (match.winner) {
					if (match.winner === match.player1) {
						if (player1Element) player1Element.style.fontWeight = 'bold';
						if (player1Element) player1Element.style.color = 'gold';
						if (player2Element) player2Element.style.fontWeight = 'normal';
					} else if (match.winner === match.player2) {
						if (player2Element) player2Element.style.fontWeight = 'bold';
						if (player2Element) player2Element.style.color = 'gold';
						if (player1Element) player1Element.style.fontWeight = 'normal';
					}
				} else {
					if (player1Element) player1Element.style.fontWeight = 'normal';
					if (player2Element) player2Element.style.fontWeight = 'normal';
				}
			}
		}

		const finalMatch = tournament.final;
		const finalMatchElement = document.getElementById('match-final');
		if (finalMatchElement) {
			const finalPlayer1Element = finalMatchElement.querySelector('.player1');
			const finalPlayer2Element = finalMatchElement.querySelector('.player2');

			if (finalPlayer1Element) finalPlayer1Element.textContent = finalMatch.player1 || 'Waiting for player';
			if (finalPlayer2Element) finalPlayer2Element.textContent = finalMatch.player2 || 'Waiting for player';

			if (finalMatch.winner) {
				if (finalMatch.winner === finalMatch.player1) {
					if (finalPlayer1Element) finalPlayer1Element.style.fontWeight = 'bold';
					if (finalPlayer1Element) finalPlayer1Element.style.color = 'gold';
					if (finalPlayer2Element) finalPlayer2Element.style.fontWeight = 'normal';
				} else if (finalMatch.winner === finalMatch.player2) {
					if (finalPlayer2Element) finalPlayer2Element.style.fontWeight = 'bold';
					if (finalPlayer2Element) finalPlayer2Element.style.color = 'gold';
					if (finalPlayer1Element) finalPlayer1Element.style.fontWeight = 'normal';
				}
			} else {
				if (finalPlayer1Element) finalPlayer1Element.style.fontWeight = 'normal';
				if (finalPlayer2Element) finalPlayer2Element.style.fontWeight = 'normal';
			}
		}
	}

	function cleanupGame() {
		console.log('Cleaning up game');
		tournamentSocket.close();
		deactivateListeners();
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