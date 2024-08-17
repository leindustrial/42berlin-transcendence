export let winner = "";
export function offlineTour_handler() {
  const offlineTourHtml = `
		<div id="offline-tournament">
            <div id="tour_header">
              <p class="text-center" id="logo-big">PONG 3.1</p>
              <p class="text-center" id ="sublitle">${TOUR}</p>
             </div> 
            <div id="player_form_4">
              <h3 style="color:#323131">${ENTER_NAMES}</h3>
                <input type="text" class="form-control" id="input1_4" placeholder="${PLAYER} 1" required maxlength="15">
                <input type="text" class="form-control" id="input2_4" placeholder="${PLAYER} 2" required maxlength="15">
                <input type="text" class="form-control" id="input3_4" placeholder="${PLAYER} 3" required maxlength="15">
                <input type="text" class="form-control" id="input4_4" placeholder="${PLAYER} 4" required maxlength="15">
                <button id="startTourBtn" class="btn btn-primary">${START_TOUR}</button>
            </div>
            
            <div class="tournament-table" id="tournament-table" style="display: none">
                <div id="champ"></div>
                <div id="info"></div>
                
                <h2 class="text-center" style="color:white">${SEMI_FIN}:</h2>
                <div class="tournament_off">
                        <div class="match_off" id="match-semi-finals-0">
                            <div class="d-flex justify-content-center">
                                <h3>${MATCH} 1</h3>
                            </div>
                            <p class="player" id="table1_4"></p>
                            <p class="vs">vs</p>
                            <p class="player" id="table2_4"></p>
                        </div>
                        <div class="match_off" id="match-semi-finals-1">
                            <div class="d-flex justify-content-center">
                                <h3>${MATCH} 2</h3>
                            </div>
                            <p class="player" id="table3_4"></p>
                            <p class="vs">vs</p>
                            <p class="player" id="table4_4"></p>
                        </div>
                </div>
                <button id="go-to-match">${GO_TO_MATCH}</button>
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
                                    <h3 class="player_name_off" id="name1_4">${PLAYER} 1</h3>
                                    <h3 class="player_name_off" id="name2_4">${PLAYER} 2</h3>
                                    
                                    <div id="winnerMessage_4" class="winner-message">
                                        <h2 id="winnerName_4"></h2>
                                    </div>
                                    <div class="megaWinner" id="megaWinner_4" style="display: none;">
                                        <h2 id="megaWinnerName_4"></h2>
                                    </div>                           
                                    <button id="nextGame" class="btn btn-primary" style="display: none;">${NEXT_GAME}</button>
                                    <p class="text-center"><h3 class="message" id="message_4">${PRESS_ENTER}</h3></p>
                                    
                                    <div id="exitTour" class="content-section exit-tour" style="display:none;">
                                        <div class="row justify-content-center">
                                            <div class="btn-group-vertical">
                                                <div class="container" id="choose-mode-online"> 
                                                    <a href="#offline-choose-mode" type="button" class="btn btn-outline-primary btn-lg btn-block">${EXIT_GAME}</a>
                                                    <a href="#blockchain" type="button" class="btn btn-outline-primary btn-lg btn-block blockchain-button">${SAVE_BLOCKCHAIN}</a>
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

        </div>
	`;
  setElementinnerHTML(document.getElementById("offline-tournament"), offlineTourHtml);
  showElement(document.getElementById("offline-tournament"));

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

  const paddleSpeed_4 = 10;
  let velocity1_4 = 0, velocity2_4 = 0;
  let paddleAnimationFrame_4;

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
    if (paddleAnimationFrame_4) {
      cancelAnimationFrame(paddleAnimationFrame_4);
  } 
  }

  function updatePaddlePositions_4() {
    paddle1_4.style.top =
      Math.min(
        Math.max(board_coord_4.top, paddle1_coord_4.top + velocity1_4),
        board_coord_4.bottom - paddle1_coord_4.height
      ) + "px";
    paddle2_4.style.top =
      Math.min(
        Math.max(board_coord_4.top, paddle2_coord_4.top + velocity2_4),
        board_coord_4.bottom - paddle2_coord_4.height
      ) + "px";

    paddle1_coord_4 = paddle1_4.getBoundingClientRect();
    paddle2_coord_4 = paddle2_4.getBoundingClientRect();

    paddleAnimationFrame_4 = requestAnimationFrame(updatePaddlePositions_4);
  }

  function startMatch() {
    document.getElementById("tour_header").style.display = "none";
    document.getElementById("tournament-table").style.display = "none";
    document.getElementById("tournament-game").style.display = "block";
    message_4.innerHTML = `${PRESS_ENTER}`;
    message_4.style.display = "block";
    initializeGameElements_4();
    resetBallPosition_4();
    resetPaddlePositions_4();
    gameStateTour = "start";
    if (winner1_4 === null) {
      console.log(pl1_4, pl2_4, name1_4.textContent, name2_4.textContent);
      name1_4.textContent = pl1_4;
      name2_4.textContent = pl2_4;
      winnerName_4.innerHTML = `${pl1_4} vs ${pl2_4}!`;
      winnerMessage_4.style.display = "block";
      return;
    } else if (winner2_4 === null) {
      name1_4.textContent = pl3_4;
      name2_4.textContent = pl4_4;
      winnerName_4.innerHTML = `${pl3_4} vs ${pl4_4}!`;
      winnerMessage_4.style.display = "block";
      return;
    } else if (winner_final_4 === null) {
      name1_4.textContent = winner1_4;
      name2_4.textContent = winner2_4;
      winnerName_4.innerHTML = `${winner1_4} vs ${winner2_4}!`;
      winnerMessage_4.style.display = "block";
      return;
    }
  }

  function startGame_4() {
    message_4.style.display = "block";
    winnerMessage_4.style.display = "none";
    gameStateTour = "play";
    message_4.innerHTML = `${GAME_STARTED}`;
    setTimeout(() => (message_4.innerHTML = ""), 1500);

    console.log("We are in the game tour");
    initializeGameElements_4();
    updatePaddlePositions_4();
    resetBallPosition_4();
    resetScores_4();
    moveBall_4(dx4, dy4, dxd4, dyd4);
    document.getElementById("nextGame").style.display = "none";
    document
      .getElementById("nextGame")
      .removeEventListener("click", startMatch);
    document.getElementById("nextGame").addEventListener("click", () => {
      document.getElementById("nextGame").style.display = "none";
      startMatch();
    });
  }

  function moveBall_4(dx, dy, dxd, dyd) {
    ball_coord_4 = ball_4.getBoundingClientRect();

    if (
      ball_coord_4.top <= board_coord_4.top ||
      ball_coord_4.bottom >= board_coord_4.bottom
    ) {
      dyd = 1 - dyd; // Reverse vertical direction
    }

    if (
      ball_coord_4.left <= paddle1_coord_4.right &&
      ball_coord_4.top >= paddle1_coord_4.top &&
      ball_coord_4.bottom <= paddle1_coord_4.bottom
    ) {
      dxd = 1; // Move ball to the right
      dx = Math.floor(Math.random() * 4) + 3;
      dy = Math.floor(Math.random() * 4) + 3;
    }

    if (
      ball_coord_4.right >= paddle2_coord_4.left &&
      ball_coord_4.top >= paddle2_coord_4.top &&
      ball_coord_4.bottom <= paddle2_coord_4.bottom
    ) {
      dxd = 0; // Move ball to the left
      dx = Math.floor(Math.random() * 4) + 3;
      dy = Math.floor(Math.random() * 4) + 3;
    }

    if (
      ball_coord_4.left <= board_coord_4.left ||
      ball_coord_4.right >= board_coord_4.right
    ) {
      if (ball_coord_4.left <= board_coord_4.left) {
        score2_4.innerHTML = +score2_4.innerHTML + 1;
      } else {
        score1_4.innerHTML = +score1_4.innerHTML + 1;
      }
      if (checkScores_4()) return;
      gameStateTour = "reset";
      resetBallPosition_4();
      setTimeout(() => {
        gameStateTour = "play";
        moveBall_4(dx, dy, dxd, dyd);
      }, 1000);
      return;
    }

    ball_4.style.top = ball_coord_4.top + dy * (dyd === 0 ? -1 : 1) + "px";
    ball_4.style.left = ball_coord_4.left + dx * (dxd === 0 ? -1 : 1) + "px";

    requestAnimationFrame(() => {
      moveBall_4(dx, dy, dxd, dyd);
    });
  }

  function checkScores_4() {
    if (parseInt(score1_4.innerHTML) >= 3) {
      if (!winner1_4) {
        winner1_4 = name1_4.textContent;
        gameStateTour = "stop";
        displayWinner_4(name1_4.textContent, false);
      } else if (!winner2_4) {
        winner2_4 = name1_4.textContent;
        gameStateTour = "stop";
        displayWinner_4(name1_4.textContent, false);
      } else if (!winner_final_4) {
        winner_final_4 = name1_4.textContent;
        gameStateTour = "end";
        displayWinner_4(name1_4.textContent, true);
      }
      return true;
    } else if (parseInt(score2_4.innerHTML) >= 3) {
      if (!winner1_4) {
        winner1_4 = name2_4.textContent;
        gameStateTour = "stop";
        displayWinner_4(name2_4.textContent, false);
      } else if (!winner2_4) {
        winner2_4 = name2_4.textContent;
        gameStateTour = "stop";
        displayWinner_4(name2_4.textContent, false);
      } else if (!winner_final_4) {
        winner_final_4 = name2_4.textContent;
        gameStateTour = "end";
        displayWinner_4(name2_4.textContent, true);
      }
      return true;
    }
    return false;
  }

  function displayWinner_4(winName, isFinal) {
    if (isFinal === true) {
      if (paddleAnimationFrame_4) {
        cancelAnimationFrame(paddleAnimationFrame_4);
      } 
      endTournament(winName);
    } else {
      winnerName_4.innerHTML = `${winName} ${WINS}`;
      winnerMessage_4.style.display = "block";
      if (paddleAnimationFrame_4) {
        cancelAnimationFrame(paddleAnimationFrame_4);
      } 
      resetScores_4();
      resetBallPosition_4();
      document.getElementById("nextGame").style.display = "block";
    }
  }

  function endTournament(winnerNameTour) {
    document.getElementById("megaWinner_4").style.display = "block";
    document.getElementById(
      "megaWinnerName_4"
    ).textContent = `🏆 ${winnerNameTour} ${WINS_TOUR} 🏆`;
    document.getElementById("exitTour").style.display = "block";
    winner = winnerNameTour;
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && gameStateTour === "start") startGame_4();
    if (e.key === "w")
      velocity1_4 = gameStateTour === "play" ? -paddleSpeed_4 : 0;
    if (e.key === "s")
      velocity1_4 = gameStateTour === "play" ? paddleSpeed_4 : 0;
    if (e.key === "ArrowUp")
      velocity2_4 = gameStateTour === "play" ? -paddleSpeed_4 : 0;
    if (e.key === "ArrowDown")
      velocity2_4 = gameStateTour === "play" ? paddleSpeed_4 : 0;
  });

  document.addEventListener("keyup", function (e) {
    if (
      (e.key === "w" && gameStateTour === "play") ||
      (e.key === "s" && gameStateTour === "play")
    )
      velocity1_4 = 0;
    if (
      (e.key === "ArrowUp" && gameStateTour === "play") ||
      (e.key === "ArrowDown" && gameStateTour === "play")
    )
      velocity2_4 = 0;
  });
  startTourBtn.addEventListener("click", function () {
    console.log("We are in start tournament");
    if (
      areNotUnique(
        input1_4.value,
        input2_4.value,
        input3_4.value,
        input4_4.value
      )
    ) {
      alert(`${DIFF_NAMES}`);
    } else if (
      input1_4.value &&
      input2_4.value &&
      input3_4.value &&
      input4_4.value
    ) {
      document.getElementById("player_form_4").style.display = "none";
      pl1_4 = input1_4.value;
      pl2_4 = input2_4.value;
      pl3_4 = input3_4.value;
      pl4_4 = input4_4.value;
      table1_4.textContent = input1_4.value;
      table2_4.textContent = input2_4.value;
      table3_4.textContent = input3_4.value;
      table4_4.textContent = input4_4.value;
      document.getElementById("tournament-table").style.display = "block";
      document
        .getElementById("go-to-match")
        .addEventListener("click", startMatch);
    } else {
      alert(`${DIFF_NAMES}`);
    }
  });

  document.getElementById("nextGame").addEventListener("click", function () {
    document.getElementById("nextGame").style.display = "none";
    startMatch();
  });

  // function offlineTourReset() {
  //     gameStateTour = 'begin';
  //     document.getElementById('player_form_4').style.display = 'block';
  //     document.getElementById('tournament-table').style.display = 'none';
  //     document.getElementById('tournament-game').style.display = 'none';
  //     message_4.style.display = 'none';
  //     winnerMessage_4.style.display = 'none';
  //     document.getElementById('megaWinner_4').style.display = 'none';
  //     document.getElementById('exitTour').style.display = 'none';
  //     input1_4.value = '';
  //     input2_4.value = '';
  //     input3_4.value = '';
  //     input4_4.value = '';
  //     name1_4.textContent = 'Player 1';
  //     name2_4.textContent = 'Player 2';
  //     winner1_4 = null;
  //     winner2_4 = null;
  //     winner_final_4 = null;
  //     initializeGameElements_4()
  //     resetBallPosition_4();
  //     resetPaddlePositions_4();
  //     resetScores_4();
  // }
}
