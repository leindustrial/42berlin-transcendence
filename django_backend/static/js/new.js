// Function to show/hide sections based on sectionId
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }

    // Define elements to show/hide based on sectionId
    const elementsToShow = {
        language: ['offline-choose-mode', 'get-started'],
        headerWelcome: ['offline-choose-mode', 'get-started'],
        footer: ['offline-choose-mode', 'get-started'],
        offHeaderGame: ['offline-1x1', 'offline-tournament', 'login'],
        horNav: ['get-started'],
        onHeaderGame: ['online-1x1', 'online-4', 'online-tournament']
    };

    // Update element visibility based on sectionId
    Object.keys(elementsToShow).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.style.display = elementsToShow[key].includes(sectionId) ? 'block' : 'none';
        }
    });
}

// Event listener for hash change
window.addEventListener('hashchange', () => {
    const sectionId = window.location.hash.substring(1);
    showSection(sectionId);
});

// On initial load, show the appropriate section
document.addEventListener('DOMContentLoaded', () => {
    const initialSection = window.location.hash.substring(1) || 'offline-choose-mode';
    showSection(initialSection);

    // Initialize offline games
    initializeOffline1x1Game();
    initializeOfflineTournament();
});

// Initialize Offline 1x1 Game
function initializeOffline1x1Game() {
    const section1 = document.getElementById('offline-1x1');
    if (!section1 || window.getComputedStyle(section1).display !== 'block') return;

    let gameState = 'start';
    const paddleSpeed = 2;
    let paddle1Velocity = 0, paddle2Velocity = 0;
    const player1 = document.getElementById('player1Name');
    const player2 = document.getElementById('player2Name');
    const message = document.getElementById('offline-message');
    const player1Input = document.getElementById('player1NameInput');
    const player2Input = document.getElementById('player2NameInput');
    const startGameBtn = document.getElementById('startGameBtn');

    // Event listener for start button click
    startGameBtn.addEventListener('click', startGame);
    
    // Event listener for Enter key to start game
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') startGame();
        if (e.key === 'w') paddle1Velocity = gameState === 'play' ? -paddleSpeed : 0;
        if (e.key === 's') paddle1Velocity = gameState === 'play' ? paddleSpeed : 0;
        if (e.key === 'ArrowUp') paddle2Velocity = gameState === 'play' ? -paddleSpeed : 0;
        if (e.key === 'ArrowDown') paddle2Velocity = gameState === 'play' ? paddleSpeed : 0;
    });

    // Event listener for keyup to stop paddle movement
    document.addEventListener('keyup', function (e) {
        if (e.key === 'w' || e.key === 's') paddle1Velocity = 0;
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') paddle2Velocity = 0;
    });

    function startGame() {
        message.style.display = 'block';
        if (player1Input.value === player2Input.value) {
            alert('Please enter different names for both players.');
        } else if (player1Input.value && player2Input.value) {
            player1.textContent = player1Input.value;
            player2.textContent = player2Input.value;
            document.getElementById('player_form').style.display = 'none';
            gameState = 'play';
            message.innerHTML = 'Game Started';
            setTimeout(() => message.innerHTML = '', 1500);
            initializeGameElements();
            updatePaddlePositions();
            resetBallPosition();
            moveBall();
        } else {
            alert('Please enter names for both players.');
        }
    }

    function initializeGameElements() {
        // Initialize game elements
        // Replace with your specific game initialization code
    }

    function updatePaddlePositions() {
        // Update paddle positions
        // Replace with your specific game code
    }

    function resetBallPosition() {
        // Reset ball position
        // Replace with your specific game code
    }

    function moveBall() {
        // Move ball logic
        // Replace with your specific game code
    }
}

// Initialize Offline Tournament
function initializeOfflineTournament() {
    const section2 = document.getElementById('offline-tournament');
    if (!section2 || window.getComputedStyle(section2).display !== 'block') return;

    let gameState = 'begin';
    const paddleSpeed = 5;
    let paddle1Velocity = 0, paddle2Velocity = 0;
    const startGameBtn = document.getElementById('startGameBtn');
    const pl1Input = document.getElementById('player1NameInput');
    const pl2Input = document.getElementById('player2NameInput');
    const pl3Input = document.getElementById('player3NameInput');
    const pl4Input = document.getElementById('player4NameInput');

    // Event listener for start button click
    startGameBtn.addEventListener('click', startTournament);

    // Event listener for Enter key to start tournament
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && gameState === 'begin') startTournament();
        if (e.key === 'w') paddle1Velocity = gameState === 'play' ? -paddleSpeed : 0;
        if (e.key === 's') paddle1Velocity = gameState === 'play' ? paddleSpeed : 0;
        if (e.key === 'ArrowUp') paddle2Velocity = gameState === 'play' ? -paddleSpeed : 0;
        if (e.key === 'ArrowDown') paddle2Velocity = gameState === 'play' ? paddleSpeed : 0;
    });

    // Event listener for keyup to stop paddle movement
    document.addEventListener('keyup', function (e) {
        if (e.key === 'w' || e.key === 's') paddle1Velocity = 0;
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') paddle2Velocity = 0;
    });

    function startTournament() {
        const pl1Name = pl1Input.value;
        const pl2Name = pl2Input.value;
        const pl3Name = pl3Input.value;
        const pl4Name = pl4Input.value;

        if (areNotUnique(pl1Name, pl2Name, pl3Name, pl4Name)) {
            alert('Please enter unique names for all players.');
        } else if (pl1Name && pl2Name && pl3Name && pl4Name) {
            document.getElementById('player_form').style.display = 'none';
            document.getElementById('tournament-table').style.display = 'block';
            document.getElementById('go-to-match').addEventListener('click', startMatch);
            // Initialize tournament logic
            // Replace with your specific tournament setup code
        } else {
            alert('Please enter unique names for all players.');
        }
    }

    function startMatch() {
        // Start match logic
        // Replace with your specific match code
    }

    function areNotUnique(...names) {
        const uniqueNames = new Set(names);
        return uniqueNames.size !== names.length;
    }
}
