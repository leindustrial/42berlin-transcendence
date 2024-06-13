document.addEventListener('DOMContentLoaded', function() {
    function showSection(sectionIds) {
        document.querySelectorAll('#game > .container, form').forEach(function(section) {
            if (sectionIds.includes(section.id)) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }

    document.getElementById('1pl').addEventListener('click', function() {
        showSection(['header-game', 'name_form', 'footer-game']);
    });

    document.getElementById('2pl').addEventListener('click', function() {
        showSection(['header-game', 'two_players', 'footer-game']);
    });

    document.getElementById('5pl').addEventListener('click', function() {
        showSection(['header-game', 'tournament', 'footer-game']);
    });

    document.getElementById('restart').addEventListener('click', function() {
        showSection(['header-welcome', 'start', 'footer-welcome']);
    });

    document.getElementById('play').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission
        var playerName = document.getElementById('player_name1').value;
        document.getElementById('player_left').textContent = playerName;
        showSection(['header-game', 'one_player', 'footer-game']);
    });

    // Initially show only the start section
    showSection(['header-welcome', 'start', 'footer-welcome']);
});