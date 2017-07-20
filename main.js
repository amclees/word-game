
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

letterBoard[4][3] = 'R';

displayBoard();
