document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('ws://' + window.location.host + '/ws/tournament/');
    const gameArea = document.getElementById('game-area');
    const message = document.getElementById('message');
    const group1_area = document.getElementById('semifinals-group1');
    const group1_player1 = document.getElementById('group1-player1-name');
    const group1_player2 = document.getElementById('group1-player2-name');
    const group2_area = document.getElementById('semifinals-group2');
    const group2_player1 = document.getElementById('group2-player1-name');
    const group2_player2 = document.getElementById('group2-player2-name');
    const finals_area = document.getElementById('finals');
    const finals_player1 = document.getElementById('finals-player1-name');
    const finals_player2 = document.getElementById('finals-player2-name');


	message.textContent = 'Waiting for players to join...';
	const originalWidth = 780;
	const originalHeight = 380;

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

	socket.onmessage = (event) => {
		const data = JSON.parse(event.data);
		switch (data.type) {
			case 'player_joined':
				message.textContent = `${data.name} joined the game`;
				setTimeout(() => {
					message.textContent = '';
				}, 1000);
				break;
            case 'ready':
                message.textContent = data.message;
                break;
			case 'semifinals_matchmaking':
				message.textContent = 'Groups are set up!';
                group1_area.textContent = 'Group1';
                group1_player1 = `Player1: ${data.group1_name1}`;
                group1_player2 = `Player2: ${data.group1_name2}`;
                group2_area.textContent = 'Group2';
                group2_player1 = `Player1: ${data.group1_name1}`;
                group2_player2 = `Player2: ${data.group1_name2}`;
				break;
            case 'tournament_cancelation':
                message.textContent = `${data.name}${data.message}`;
                break;
            case 'player_rejoined':
                message.textContent = `${data.name} rejoined the game`;
                setTimeout(() => {
                    message.textContent = '';
                }, 3000);
                break;
            case 'tournament_pause':
                message.textContent = data.message;
                break;
			case 'game_started':
				message.style.fontSize = '40px';
				message.textContent = data.message;
				setTimeout(() => {
					message.textContent = '';
					message.style.fontSize = '10px';
				}, 1000);
				break;
		}
	};

	socket.onclose = (event) => {
        if (event.code == 4001) {
            message.textContent = 'Tournament got cancelled. You will be redirected to the home page.';
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);
        } else {
            message.textContent = 'Tournament end. You will be redirected to the home page.';
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);
        }
	};

	socket.onerror = (error) => {
		console.error('WebSocket Error:', error);
		message.textContent = 'An error occurred. Please refresh the page.';
	};
});
