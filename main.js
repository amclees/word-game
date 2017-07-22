
var doubleLetter = {
  word: false,
  factor: 2
};
var tripleLetter = {
  word: false,
  factor: 3
};

var doubleWord = {
  word: true,
  factor: 2
};
var tripleWord = {
  word: true,
  factor: 3
};

var width = 15,
    height = 15;

var bonusBoard = emptyBoard(width, height);

var letterBoard = emptyBoard(width, height);

var start = [7, 7];

function getWords() {
  var url = './eng.min.json';
  var req = new XMLHttpRequest();
  req.open('GET', url, false);
  req.overrideMimeType('application/json');
  req.send();
  return req.responseText;
}

function emptyBoard(width, height) {
  var base = []
  for (var i = 0; i < width; i++) {
    var column = [];
    for (var j = 0; j < height; j++) {
      column.push(null);
    }
    base.push(column);
  }
  return base;
}

var words = JSON.parse(getWords());
var wordDictionary = {};
for (let i = 0; i < words.length; i++) {
  var toSort = words[i].split('').filter((word, index, array) => {
    return array.indexOf(word) === index;
  });
  toSort.sort();
  var sorted = toSort.join('');
  if (!wordDictionary[sorted]) {
    wordDictionary[sorted] = [];
  }
  wordDictionary[sorted].push(words[i]);
}

var boardContainer = document.getElementById('board-container');

function displayBoard() {
  while (boardContainer.firstChild) {
    boardContainer.removeChild(boardContainer.firstChild);
  }

  var table = document.createElement('table')
  table.className = 'table table-bordered';

  for (var i = 0; i < letterBoard[0].length; i++) {
    var row = document.createElement('tr');
    for (var j = 0; j < letterBoard.length; j++) {
      var element = document.createElement('td');
      if (letterBoard[i][j]) {
        element.innerText = letterBoard[i][j];
      } else {
        element.innerText = '\u25ef';
      }
      let x = i;
      let y = j;
      element.onclick = () => {
        var input = prompt('Enter the letter');
        if (!input || input.length !== 1 || !/[A-z]/.test(input)) {
          alert('Not a single letter');
          return;
        }
        letterBoard[x][y] = input.toUpperCase();
        displayBoard();
      }
      row.appendChild(element);
    }
    table.appendChild(row);
  }

  boardContainer.appendChild(table);
}

var letterPoolInput = document.getElementById('letter-pool');
function getLetterPool() {
  return letterPoolInput.value.toLowerCase().trim().split('').filter((letter, index, letters) => {
    return letters.indexOf(letter) === index && /[a-z]/.test(letter);
  });
}

var letterValues = {
  'a': 1,
  'b': 1,
  'c': 1,
  'd': 1,
  'e': 1,
  'f': 1,
  'g': 1,
  'h': 1,
  'i': 1,
  'j': 1,
  'k': 1,
  'l': 1,
  'm': 1,
  'n': 1,
  'o': 1,
  'p': 1,
  'q': 1,
  'r': 1,
  's': 1,
  't': 1,
  'u': 1,
  'v': 1,
  'w': 1,
  'x': 1,
  'y': 1,
  'z': 1
};

function spotEmpty(x, y) {
  return letterBoard[x][y] === null;
}

function adjacent(x, y) {
  var adjacents = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let adjacentX = x + i;
      let adjacentY = y + j;
      if (
        adjacentX >= 0
        && adjacentX < letterBoard.length
        && adjacentY >= 0
        && adjacentY < letterBoard[0].length
      ) {
        adjacents.push([x, y]);
      }
    }
  }
  return adjacents;
}

function spotClear(x, y, whitelisted) {
  if (!whitelisted) { whitelisted = []; }
  return adjacents(x, y).reduce(function(acc, adjacent) {
    return acc && (spotEmpty(adjacent) || whitelisted.reduce(function(acc, whitelisted) {
      return acc || (whitelisted[0] === adjacent[0] && whitelisted[1] == adjacent[1])
    }, false));
  }, true);
}

function getPlaySpots() {
  playSpots = [];
  for (let i = 0; i < letterBoard.length; i++) {
    for (let j = 0; j < letterBoard[0].length; j++) {
      let spot = false,
          spotDirection = -1;

      if (letterBoard[i][j] !== null) {
        // Set spot and direction
      }

      if (spot) {
        playSpots.push({
          spot: [i, j],
          letter: letterBoard[i][j],
          // Directions are 0, 1 for right and down respectively
          direction: spotDirection,
          // Will track the maximum word length space
          spotLimit: 0
        });
      }
    }
  }
  return playSpots;
}

var placementButton = document.getElementById('placement-button');
placementButton.onclick = function() {
  var letterPool = getLetterPool();
  if (letterPool.length === 0) { return; }

  var playSpots = getPlaySpots();
};

displayBoard();
