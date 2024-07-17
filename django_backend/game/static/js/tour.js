document.addEventListener('DOMContentLoaded', function() {
	const username = document.getElementById('username').textContent;
	const tournamentSocket = new WebSocket(
		'wss://' + window.location.host + '/wss/tournament/'
	);

	tournamentSocket.onmessage = (event) => {
		const data = JSON.parse(event.data);
		console.log(data);
		switch (data.type) {
			case 'update_tournament_chart':
				console.log('Tournament data received', data.tournament);
				updateTournament(data.tournament);
				if (data.champion || data.tournament.final.winner) {
					console.log('Champion is', data.champion);
					const championElement = document.getElementById('champ');
					championElement.textContent =  '\u{1F451}' + data.champion +  '\u{1F451}';
				}
				break;
			case 'go_to_game':
				console.log('Game is ready', data.username);
				updateTournament(data.tournament);
				if (data.game_ready) {
					const goToMatchButton = document.getElementById('go-to-match');
					goToMatchButton.classList.remove('hidden');
					goToMatchButton.setAttribute('data-session-id', data.session_id);

				} else {
					const goToMatchButton = document.getElementById('go-to-match');
					goToMatchButton.classList.add('hidden');
				}
				break;

			case 'go_back_to_home':
				console.log(data);
				const infoElement = document.getElementById('info');
				infoElement.textContent = data.message;
				tournamentSocket.close();
				// setTimeout(() => {
				// 	window.location.href = '/';
				// }
				// , 3000);
				break;
		}
	};

	tournamentSocket.onopen = function(e) {
		tournamentSocket.send(JSON.stringify({
			'action': 'join',
			'username': username
		}));
	};

	tournamentSocket.onclose = function(e) {
		const infoElement = document.getElementById('info');
		switch (e.code) {
			case 3001:
				infoElement.textContent = 'Player already in tournament, You may return to home page';
				break;
			case 3002:
				infoElement.textContent = 'Tournament is full, You may return to home page';
				break;
			default:
				console.log('Connection closed unexpectedly');
				break;
		}
		// setTimeout(() => {
		// 	window.location.href = '/';
		// }, 3000);
	};

	const goToMatchButton = document.getElementById('go-to-match');
	goToMatchButton.addEventListener('click', function() {
		tournamentSocket.send(JSON.stringify({
			'action': 'going_to_game',
			'username': username
		}));
		const sessionId = goToMatchButton.getAttribute('data-session-id');
		window.location.href = "/tour_game/" + sessionId + "/";
	});

	function updateTournament(tournament) {
		// Update semi-finals
		for (let i = 0; i < tournament.semi_finals.length; i++) {
			const match = tournament.semi_finals[i];
			const matchElement = document.getElementById(`match-semi-finals-${i}`);
			matchElement.querySelector('.player1').textContent = match.player1 || 'Waiting for player';
			matchElement.querySelector('.player2').textContent = match.player2 || 'Waiting for player';
			if (match.winner && match.winner == match.player1) {
				matchElement.querySelector('.player1').style.fontWeight = 'bold';
				matchElement.querySelector('.player2').style.fontWeight = 'normal';
			} else if (match.winner && match.winner == match.player2) {
				matchElement.querySelector('.player2').style.fontWeight = 'bold';
				matchElement.querySelector('.player1').style.fontWeight = 'normal';
			} else {
				matchElement.querySelector('.player1').style.fontWeight = 'normal';
				matchElement.querySelector('.player2').style.fontWeight = 'normal';
			}
		}

		// Update final
		const finalMatch = tournament.final;
		const finalMatchElement = document.getElementById('match-final');
		finalMatchElement.querySelector('.player1').textContent = finalMatch.player1 || 'Waiting for player';
		finalMatchElement.querySelector('.player2').textContent = finalMatch.player2 || 'Waiting for player';
		if (finalMatch.winner && finalMatch.winner == finalMatch.player1) {
			finalMatchElement.querySelector('.player1').style.fontWeight = 'bold';
			finalMatchElement.querySelector('.player2').style.fontWeight = 'normal';
		} else if (finalMatch.winner && finalMatch.winner == finalMatch.player2) {
			finalMatchElement.querySelector('.player2').style.fontWeight = 'bold';
			finalMatchElement.querySelector('.player1').style.fontWeight = 'normal';
		} else {
			finalMatchElement.querySelector('.player1').style.fontWeight = 'normal';
			finalMatchElement.querySelector('.player2').style.fontWeight = 'normal';
		}
	}
});
