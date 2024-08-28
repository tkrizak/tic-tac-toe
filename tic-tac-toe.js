const displayController = (() => {
  const renderResult = (result) => {
    document.querySelector('#result').innerHTML = result;
    document.querySelector('#result').classList.add('visible');
  };

  const displayPlayers = (player1, player2) => {
    const player1Element = document.querySelector('#player1');
    const player2Element = document.querySelector('#player2');

    player1Element.innerHTML = `<p>Player 1</p>
    <p>${player1.name}</p>
    <p>${player1.mark}</p>`;

    player2Element.innerHTML = `<p>Player 2</p>
    <p>${player2.name}</p>
    <p>${player2.mark}</p>`;

    player1Element.classList.add('has-players');
    player2Element.classList.add('has-players');
    document.querySelector('#gameBoard').style.gap =
      'clamp(2.5rem, 2rem + 2.5vw, 5rem)';
  };

  const displayTurn = (playerTurn) => {
    document.querySelector('#result').innerHTML = playerTurn;
    document.querySelector('#result').classList.add('visible');
  };

  return { renderResult, displayPlayers, displayTurn };
})();

const Gameboard = (() => {
  let gameboard = ['', '', '', '', '', '', '', '', ''];

  const render = () => {
    const squares = document.querySelectorAll('.game__square');
    squares.forEach((square, index) => {
      square.textContent = gameboard[index];

      square.addEventListener('click', Game.handleClick);
    });
  };

  const update = (index, value) => {
    gameboard[index] = value;
    render();
  };

  const getGameboard = () => {
    return gameboard;
  };

  return { render, update, getGameboard };
})();

// Player factory function

const createPlayer = (name, mark) => {
  return {
    name,
    mark,
  };
};

// Handles the logic of the game, start and restart buttons, changes gameboard array based on clicked squares and player turns

const Game = (() => {
  let players = [];
  let currentPlayerIndex;
  let gameOver = false;
  let gameInProgress = false;

  // Creates 2 players on game start, updates squares correctly with handleClick function

  const start = () => {
    if (gameInProgress) {
      alert('Please restart the game before starting a new one!');
      return;
    }

    const player1Input = document.querySelector('#player1-input');
    const player2Input = document.querySelector('#player2-input');

    const player1Name = player1Input.value;
    const player2Name = player2Input.value;

    // Prevents the game from starting
    if (!player1Name || !player2Name) {
      alert('Both player names must be filled out to start the game');
      return;
    }

    // Creates players and displays them
    players = [createPlayer(player1Name, 'X'), createPlayer(player2Name, 'O')];

    displayController.displayPlayers(players[0], players[1]);

    // Sets player index 0 on start for update function to rotate between players
    currentPlayerIndex = 0;
    gameOver = false;
    gameInProgress = true;
    Gameboard.render();

    displayController.displayTurn(
      `${players[currentPlayerIndex].name} place your mark`
    );

    const squares = document.querySelectorAll('.square');
    squares.forEach((square) => {
      square.addEventListener('click', handleClick);
    });

    // Empties inputs on start
    player1Input.value = '';
    player2Input.value = '';

    console.log(players);
  };

  // Loops through gameboard array and makes it empty

  const restart = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, '');
      Gameboard.render();
    }

    players = [];
    currentPlayerIndex = undefined;
    gameOver = false;
    gameInProgress = false;

    document.querySelector('#result').textContent = '';
    document.querySelector('#player1').textContent = '';
    document.querySelector('#player2').textContent = '';

    document.querySelector('#result').classList.remove('visible');
    document.querySelector('#result').style.textDecoration = 'none';

    document.querySelector('#gameBoard').style.gap = '0';

    document.querySelector('#player1').classList.remove('has-players');
    document.querySelector('#player2').classList.remove('has-players');

    console.log(players);
  };

  // Finds clicked square, updates gameboard array with correct mark and rotates between player turns

  const handleClick = (event) => {
    if (gameOver) {
      return;
    }

    let index = parseInt(event.target.id.split('-')[1]);

    if (Gameboard.getGameboard()[index] !== '') {
      return;
    }

    Gameboard.update(index, players[currentPlayerIndex].mark);

    if (
      checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)
    ) {
      gameOver = true;
      displayController.renderResult(
        `${players[currentPlayerIndex].name} wins!`
      );
      document.querySelector('#result').style.textDecoration = 'underline';
    } else if (checkForTie(Gameboard.getGameboard())) {
      gameOver = true;
      displayController.renderResult(`It's a tie`);
    } else {
      currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
      displayController.displayTurn(
        `${players[currentPlayerIndex].name} place your mark`
      );
    }
  };

  return { start, restart, handleClick };
})();

// Function that looks for a winning combination of marks on specific board indexes

function checkForWin(board) {
  // Sub-array of winning combinations
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Loops through winning arrays, asigns their index, checks if board values on those indexes are same mark
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

// Function that returns true if every cell in board array is not empty

function checkForTie(board) {
  return board.every((cell) => {
    return cell !== '';
  });
}

//

const startButton = document.querySelector('#start-button');
startButton.addEventListener('click', () => {
  Game.start();
});

const restartButton = document.querySelector('#restart-button');
restartButton.addEventListener('click', () => {
  Game.restart();
});
