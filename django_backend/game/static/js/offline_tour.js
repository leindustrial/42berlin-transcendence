export let winner = "";

export function offlineTour_handler() {
  const offlineTourHtml = `
    <div id="offline-tournament">
        <h1 class="text-center" id="tour_header">Tournament</h1>
        <div id="player_form_4">
            <input type="text" class="form-control" id="input1_4" placeholder="Player 1" required maxlength="15">
            <input type="text" class="form-control" id="input2_4" placeholder="Player 2" required maxlength="15">
            <input type="text" class="form-control" id="input3_4" placeholder="Player 3" required maxlength="15">
            <input type="text" class="form-control" id="input4_4" placeholder="Player 4" required maxlength="15">
            <button id="startTourBtn" class="btn btn-primary">Start Tournament</button>
        </div>
        <div class="tournament-table" id="tournament-table" style="display: none">
            <div id="champ"></div>
            <div id="info"></div>
            <h2 class="text-center">Semi-finals</h2>
            <div class="tournament_off">
                <div class="match_off" id="match-semi-finals-0">
                    <div class="d-flex justify-content-center">
                        <h3>Match 1</h3>
                    </div>
                    <p class="player" id="table1_4"></p>
                    <p class="vs">vs</p>
                    <p class="player" id="table2_4"></p>
                </div>
                <div class="match_off" id="match-semi-finals-1">
                    <div class="d-flex justify-content-center">
                        <h3>Match 2</h3>
                    </div>
                    <p class="player" id="table3_4"></p>
                    <p class="vs">vs</p>
                    <p class="player" id="table4_4"></p>
                </div>
            </div>
            <button id="go-to-match">Go to Match</button>
        </div>
        <div class="tournament-game" id="tournament-game" style="display: none">
            <div class="container" id="offline-game">
                <div class="container-fluid">
                    <div class="row justify-content-center align-items-center">
                        <div class="col-auto">
                            <div class="board_4" id="board_4">
                                <div class="ball_4" id="ball_4"></div>
                                <div class="paddle_off" id="paddle1_4"></div>
                                <div class="paddle_off" id="paddle2_4"></div>
                                <h3 class="scores_off" id="score1_4">0</h3>
                                <h3 class="scores_off" id="score2_4">0</h3>
                                <h3 class="player_name_off" id="name1_4">Player 1</h3>
                                <h3 class="player_name_off" id="name2_4">Player 2</h3>
                                <div id="winnerMessage_4" class="winner-message">
                                    <h2 id="winnerName_4"></h2>
                                </div>
                                <div class="megaWinner" id="megaWinner_4" style="display: none;">
                                    <h2 id="megaWinnerName_4"></h2>
                                </div>
                                <button id="nextGame" class="btn btn-primary" style="display: none;">Next Game!</button>
                                <p class="text-center"><h3 class="message" id="message_4">Press Enter to Play</h3></p>
                                <div id="exitTour" class="content-section exit-tour" style="display:none;">
                                    <div class="row justify-content-center">
                                        <div class="btn-group-vertical">
                                            <div class="container" id="choose-mode-online">
                                                <a href="#offline-choose-mode" type="button" class="btn btn-outline-primary btn-lg btn-block">Exit</a>
                                                <a href="#blockchain" type="button" class="btn btn-outline-primary btn-lg btn-block blockchain-button">Save Results in Blockchain</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

  setElementinnerHTML(document.getElementById("game-place"), offlineTourHtml);
  showElement(document.getElementById("game-place"));

  let gameStateTour;
  let startTourBtn = document.getElementById("startTourBtn");
  let input1_4 = document.getElementById("input1_4");
  let input2_4 = document.getElementById("input2_4");
  let input3_4 = document.getElementById("input3_4");
  let input4_4 = document.getElementById("input4_4");
  let pl1_4, pl2_4, pl3_4, pl4_4;
  let table1_4 = document.getElementById("table1_4");
  let table2_4 = document.getElementById("table2_4");
  let table3_4 = document.getElementById("table3_4");
  let table4_4 = document.getElementById("table4_4");
  let name1_4 = document.getElementById("name1_4");
  let name2_4 = document.getElementById("name2_4");
  let message_4 = document.getElementById("message_4");
  let winnerMessage_4 = document.getElementById("winnerMessage_4");
  let winnerName_4 = document.getElementById("winnerName_4");
  let winner1_4 = null,
    winner2_4 = null,
    winner_final_4 = null;
  let score1_4 = document.getElementById("score1_4");
  let score2_4 = document.getElementById("score2_4");
  let board_4 = document.getElementById("board_4");
  let ball_4 = document.getElementById("ball_4");
  let paddle1_4 = document.getElementById("paddle1_4");
  let paddle2_4 = document.getElementById("paddle2_4");
  let paddle1_coord_4,
    paddle2_coord_4,
    paddle_common_4,
    ball_coord_4,
    board_coord_4;
  const paddleSpeed_4 = 3;
  let velocity1_4 = 0,
    velocity2_4 = 0;
  let dx4, dy4, dxd4, dyd4;

  function initializeGameElements_4() {
    board_coord_4 = board_4.getBoundingClientRect();
    ball_coord_4 = ball_4.getBoundingClientRect();
    paddle1_coord_4 = paddle1_4.getBoundingClientRect();
    paddle2_coord_4 = paddle2_4.getBoundingClientRect();
    paddle_common_4 = document
      .querySelector(".paddle_off")
      .getBoundingClientRect();
    dx4 = Math.floor(Math.random() * 4) + 3;
    dy4 = Math.floor(Math.random() * 4) + 3;
    dxd4 = Math.floor(Math.random() * 2);
    dyd4 = Math.floor(Math.random() * 2);
    ball_4.style.top =
      board_coord_4.top +
      board_coord_4.height / 2 -
      ball_coord_4.height / 2 +
      "px";
    ball_4.style.left =
      board_coord_4.left +
      board_coord_4.width / 2 -
      ball_coord_4.width / 2 +
      "px";
    ball_coord_4 = ball_4.getBoundingClientRect();
  }

  function areNotUnique(str1, str2, str3, str4) {
    return (
      str1 === str2 ||
      str1 === str3 ||
      str1 === str4 ||
      str2 === str3 ||
      str2 === str4 ||
      str3 === str4
    );
  }

  function resetBallPosition_4() {
    ball_4.style.top =
      board_coord_4.top +
      board_coord_4.height / 2 -
      ball_coord_4.height / 2 +
      "px";
    ball_4.style.left =
      board_coord_4.left +
      board_coord_4.width / 2 -
      ball_coord_4.width / 2 +
      "px";
    console.log(ball_4.style.top, ball_4.style.left);
    ball_coord_4 = ball_4.getBoundingClientRect();
  }

  function resetScores_4() {
    score1_4.innerHTML = "0";
    score2_4.innerHTML = "0";
  }

  function resetPaddlePositions_4() {
    paddle1_4.style.top = 360 + "px";
    paddle2_4.style.top = 360 + "px";
    paddle1_coord_4 = paddle1_4.getBoundingClientRect();
    paddle2_coord_4 = paddle2_4.getBoundingClientRect();
  }

  function updatePaddlePositions_4() {
    paddle1_4.style.top =
      Math.min(
        Math.max(board_coord_4.top, paddle1_4.offsetTop + velocity1_4),
        board_coord_4.bottom - paddle1_4.clientHeight
      ) + "px";
    paddle2_4.style.top =
      Math.min(
        Math.max(board_coord_4.top, paddle2_4.offsetTop + velocity2_4),
        board_coord_4.bottom - paddle2_4.clientHeight
      ) + "px";
    paddle1_coord_4 = paddle1_4.getBoundingClientRect();
    paddle2_coord_4 = paddle2_4.getBoundingClientRect();
  }

  function updateBallPosition_4() {
    ball_4.style.top = ball_4.offsetTop + dy4 * (dyd4 === 1 ? 1 : -1) + "px";
    ball_4.style.left = ball_4.offsetLeft + dx4 * (dxd4 === 1 ? 1 : -1) + "px";
    ball_coord_4 = ball_4.getBoundingClientRect();
  }

  function checkCollision_4() {
    let ballRect = ball_coord_4;
    let paddle1Rect = paddle1_coord_4;
    let paddle2Rect = paddle2_coord_4;

    if (
      ballRect.top <= board_coord_4.top ||
      ballRect.bottom >= board_coord_4.bottom
    ) {
      dy4 *= -1;
    }
    if (
      ballRect.left <= paddle1Rect.right &&
      ballRect.top >= paddle1Rect.top &&
      ballRect.bottom <= paddle1Rect.bottom
    ) {
      dxd4 *= -1;
    }
    if (
      ballRect.right >= paddle2Rect.left &&
      ballRect.top >= paddle2Rect.top &&
      ballRect.bottom <= paddle2Rect.bottom
    ) {
      dxd4 *= -1;
    }
    if (ballRect.left <= board_coord_4.left) {
      updateScore_4(2);
      resetBallPosition_4();
    }
    if (ballRect.right >= board_coord_4.right) {
      updateScore_4(1);
      resetBallPosition_4();
    }
  }

  function updateScore_4(winner) {
    let scoreElement = winner === 1 ? score1_4 : score2_4;
    scoreElement.innerHTML = parseInt(scoreElement.innerHTML) + 1;
    if (parseInt(scoreElement.innerHTML) >= 5) {
      showElement(winnerMessage_4);
      winnerName_4.innerHTML = `Player ${winner} Wins!`;
      winner1_4 = winner === 1 ? input1_4.value : input2_4.value;
      winner2_4 = winner === 1 ? input2_4.value : input1_4.value;
    }
  }

  function moveBall_4() {
    updateBallPosition_4();
    checkCollision_4();
  }

  function startGame_4() {
    initializeGameElements_4();
    resetScores_4();
    resetPaddlePositions_4();
    setInterval(moveBall_4, 1000 / 60);
  }

  startTourBtn.addEventListener("click", () => {
    if (
      areNotUnique(
        input1_4.value,
        input2_4.value,
        input3_4.value,
        input4_4.value
      )
    ) {
      alert("Player names must be unique!");
      return;
    }
    pl1_4 = input1_4.value;
    pl2_4 = input2_4.value;
    pl3_4 = input3_4.value;
    pl4_4 = input4_4.value;

    table1_4.innerHTML = pl1_4;
    table2_4.innerHTML = pl2_4;
    table3_4.innerHTML = pl3_4;
    table4_4.innerHTML = pl4_4;

    showElement(document.getElementById("tournament-table"));
    hideElement(document.getElementById("player_form_4"));

    let matchBtn = document.getElementById("go-to-match");
    matchBtn.addEventListener("click", () => {
      hideElement(document.getElementById("tournament-table"));
      showElement(document.getElementById("tournament-game"));
      startGame_4();
    });
  });
}
