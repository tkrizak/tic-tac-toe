const displayController = (() => {
  const renderResult = (result) => {
    document.querySelector('#result').innerHTML = result;
  };

  const displayPlayers = (player1, player2) => {
    document.querySelector('#player1').innerHTML = `<p>Player 1</p>
    <p>${player1.name}</p>
    <p>${player1.mark}</p>`;

    document.querySelector('#player2').innerHTML = `<p>Player 2</p>
    <p>${player2.name}</p>
    <p>${player2.mark}</p>`;
  };

  return { renderResult, displayPlayers };
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
  let gameOver;

  // Creates 2 players on game start, updates squares correctly with handleClick function

  const start = () => {
    players = [
      createPlayer(document.querySelector('#player1-input').value, 'X'),
      createPlayer(document.querySelector('#player2-input').value, 'O'),
    ];

    displayController.displayPlayers(players[0], players[1]);

    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.render();

    const squares = document.querySelectorAll('.square');
    squares.forEach((square) => {
      square.addEventListener('click', handleClick);
    });

    console.log(players);
  };

  // Loops through gameboard array and makes it empty

  const restart = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, '');
      Gameboard.render();
    }
    currentPlayerIndex = 0;
    gameOver = false;
    document.querySelector('#result').innerHTML = '';
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
        `${players[currentPlayerIndex].name} wins`
      );
    } else if (checkForTie(Gameboard.getGameboard())) {
      gameOver = true;
      displayController.renderResult(`It's a tie`);
    }

    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
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
