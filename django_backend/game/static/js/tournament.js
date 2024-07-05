document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket(`ws://${window.location.host}/ws/tournament/`);
    const message = document.getElementById('message');
    const player1 = document.getElementById('player1-name');
    const player2 = document.getElementById('player2-name');
    const player3 = document.getElementById('player3-name');
    const player4 = document.getElementById('player4-name');

    message.textContent = 'Waiting for players to join...';

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'player_joined') {
                message.textContent = `${data.name} joined the game`;
                player1.textContent = data.name;
        }
        else
            message.textContent = `Anonymous joined the game`;
    };

    socket.onclose = (event) => {
        message.textContent = 'Connection closed. Please refresh the page.';
    };

    socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
        message.textContent = 'An error occurred. Please refresh the page.';
    };
});
