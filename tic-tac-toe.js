const Gameboard = (() => {
  let gameboard = ['', '', '', '', '', '', '', '', ''];

  const render = () => {
    const squares = document.querySelectorAll('.square');
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

// Creates a player object

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
      createPlayer(document.querySelector('#player1').value, 'X'),
      createPlayer(document.querySelector('#player2').value, 'O'),
    ];

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
  };

  // Finds clicked square, updates gameboard array with correct mark and rotates between player turns

  const handleClick = (event) => {
    let index = parseInt(event.target.id.split('-')[1]);

    if (Gameboard.getGameboard()[index] !== '') {
      return;
    }

    Gameboard.update(index, players[currentPlayerIndex].mark);

    if (
      checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)
    ) {
      gameOver = true;
      alert(`${players[currentPlayerIndex].name} won!`);
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

  // Loops through winning arrays, asigns their index, checks if board values on those indexes are same
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
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
