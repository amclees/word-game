'use strict';

// Double letter
let dl = {
  word: false,
  factor: 2
};
// Triple letter
let tl = {
  word: false,
  factor: 3
};

// Double word
let dw = {
  word: true,
  factor: 2
};
//Triple word
let tw = {
  word: true,
  factor: 3
};

let width = 15,
    height = 15;

let bonusBoard = [
  [tw  , null, null, dl  , null, null, null, tw  , null, null, null, dl  , null, null, tw  ],
  [null, dw  , null, null, null, tl  , null, null, null, tl  , null, null, null, dw  , null],
  [null, null, dw  , null, null, null, dl  , null, dl  , null, null, null, dw  , null, null],
  [dl  , null, null, dw  , null, null, null, dl  , null, null, null, dw  , null, null, dl  ],
  [null, null, null, null, dw  , null, null, null, null, null, dw  , null, null, null, null],
  [null, tl  , null, null, null, tl  , null, null, null, tl  , null, null, null, tl  , null],
  [null, null, dl  , null, null, null, dl  , null, dl  , null, null, null, dl  , null, null],
  [tw  , null, null, dl  , null, null, null, dw  , null, null, null, dl  , null, null, tw  ],
  [null, null, dl  , null, null, null, dl  , null, dl  , null, null, null, dl  , null, null],
  [null, tl  , null, null, null, tl  , null, null, null, tl  , null, null, null, tl  , null],
  [null, null, null, null, dw  , null, null, null, null, null, dw  , null, null, null, null],
  [dl  , null, null, dw  , null, null, null, dl  , null, null, null, dw  , null, null, dl  ],
  [null, null, dw  , null, null, null, dl  , null, dl  , null, null, null, dw  , null, null],
  [null, dw  , null, null, null, tl  , null, null, null, tl  , null, null, null, dw  , null],
  [tw  , null, null, dl  , null, null, null, tw  , null, null, null, dl  , null, null, tw  ],
];

let letterBoard = emptyBoard(width, height);
let playerBoard = emptyBoard(width, height);

function getWords() {
  let url = './eng.min.json';
  let req = new XMLHttpRequest();
  req.open('GET', url, false);
  req.overrideMimeType('application/json');
  req.send();
  return req.responseText;
}

function resetBoard() {
  letterBoard = emptyBoard(width, height);
  playerBoard = emptyBoard(width, height);
}

function emptyBoard(width, height) {
  let base = []
  for (let i = 0; i < width; i++) {
    let column = [];
    for (let j = 0; j < height; j++) {
      column.push(null);
    }
    base.push(column);
  }
  return base;
}

let words = JSON.parse(getWords());
let wordTree = {};
for (let word of words) {
  let frame = wordTree;
  for (let i = 0; i < word.length; i++) {
    if (!frame[word[i]]) {
      frame[word[i]] = {};
    }
    frame = frame[word[i]];
  }
  frame.end = true;
}

let boardContainer = document.getElementById('board-container');

function displayBoard() {
  while (boardContainer.firstChild) {
    boardContainer.removeChild(boardContainer.firstChild);
  }

  let table = document.createElement('table')
  table.className = 'table table-bordered';

  for (let i = 0; i < letterBoard[0].length; i++) {
    let row = document.createElement('tr');
    for (let j = 0; j < letterBoard.length; j++) {
      let element = document.createElement('td');

      if (bonusBoard[i][j] === dl) {
        element.className = 'dl';
      } else if (bonusBoard[i][j] === dw) {
        element.className = 'dw';
      } else if (bonusBoard[i][j] === tl) {
        element.className = 'tl';
      } else if (bonusBoard[i][j] === tw) {
        element.className = 'tw';
      }


      if (letterBoard[i][j]) {
        element.innerText = letterBoard[i][j].toUpperCase();
      } else {
        element.innerText = '　';
      }
      let x = i;
      let y = j;
      element.onclick = () => {
        let input = prompt('Enter the letter');
        if (input === '') {
          letterBoard[x][y] = null;
          playerBoard[x][y] = null;
          displayBoard();
          return;
        }
        if (!input) {
          return;
        }
        if (input.length !== 1 || !/[A-z]/.test(input)) {
          alert('Not a single letter');
          return;
        }
        letterBoard[x][y] = input.toLowerCase();
        playerBoard[x][y] = 0;
        displayBoard();
      };
      row.appendChild(element);
    }
    table.appendChild(row);
  }

  boardContainer.appendChild(table);
}

let letterPoolInput = document.getElementById('letter-pool');
function getLetterPool() {
  let pool = {};
  let inputValue = letterPoolInput.value;
  for (let letter of inputValue) {
    pool[letter] = pool[letter] ? pool[letter] + 1 : 1;
  }
  return pool;
}

function getAvailableLetters() {
  let available = {
    '*': 2,
    'e': 12,
    'a': 9,
    'i': 9,
    'o': 8,
    'n': 6,
    'r': 6,
    't': 6,
    'l': 4,
    's': 4,
    'u': 4,
    'd': 4,
    'g': 3,
    'b': 2,
    'c': 2,
    'm': 2,
    'p': 2,
    'f': 2,
    'h': 2,
    'v': 2,
    'w': 2,
    'y': 2,
    'k': 1,
    'j': 1,
    'x': 1,
    'q': 1,
    'z': 1
  };
  for (let letter of getLetterPool()) {
    available[letter]--;
  }
  for (let row of letterBoard) {
    for (let letter of row) {
      available[letter]--;
    }
  }
  return available;
}

let playerCountInput = document.getElementById('player-count-input');
function getPlayerCount() {
  return Number.parseInt(playerCountInput.innerHTML);
}

function normalizeLetters(letters) {
  let toReturn = alphabetizeLetters(letters);
  return toReturn.filter((letter, index, letters) => {
    return letters.indexOf(letter) === index && /[a-z]/.test(letter);
  });
}

function alphabetizeLetters(letters) {
  let toReturn = letters.toLowerCase().trim().split('');
  toReturn.sort();
  return toReturn;
}

function lettersOnly(letters) {
  return letters.join('').replace(/[^a-z]/, '').split('');
}

function combinations(array, amountToChoose) {
  if (amountToChoose === 1) {
    return array;
  } else if (amountToChoose < 1) {
    return [];
  }
  let combinationList = [];
  for (let i = 0; i < array.length; i++) {
    Array.prototype.push.apply(
      combinationList,
      combinations(array.slice(0, i).concat(array.slice(i + 1)), amountToChoose - 1)
      .map((fragment) => {
        return array[i] + fragment;
      })
    );
  }
  return combinationList.map((element) => {
    return alphabetizeLetters(element).join('');
  }).filter((letter, index, letters) => {
    return letters.indexOf(letter) === index;
  });
}

let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let letterValues = {
  'a': 1,
  'b': 3,
  'c': 3,
  'd': 2,
  'e': 1,
  'f': 4,
  'g': 2,
  'h': 4,
  'i': 1,
  'j': 8,
  'k': 5,
  'l': 1,
  'm': 3,
  'n': 1,
  'o': 1,
  'p': 3,
  'q': 10,
  'r': 1,
  's': 1,
  't': 1,
  'u': 1,
  'v': 4,
  'w': 4,
  'x': 8,
  'y': 4,
  'z': 10
};

function inBounds(point) {
  return point[0] >= 0
      && point[1] >= 0
      && point[0] < letterBoard.length
      && point[1] < letterBoard[0].length;
};

let up = p => [p[0] - 1, p[1]];
let down = p => [p[0] + 1, p[1]];
let left = p => [p[0], p[1] - 1];
let right = p => [p[0], p[1] + 1];
let directions = [down, right];

function getPlayLine(x, y, direction) {
  let coords = [[x, y]];

  let current = direction([x, y]);
  while (inBounds(current)) {
    coords.push(current);
    current = direction(current);
  }

  coords.direction = direction;

  return coords;
}

// Needs reverse mode for up/left play
// Needs modifiers
function maxSpotPlay(playLine, i, score, string, letterPool, branch, newLetter) {
  if (i === playLine.length && newLetter) {
    return [score, string];
  }

  let existingValue = letterBoard[playLine[i][0]][playLine[i][1]];
  if (existingValue !== null) {
    if (branch[existingValue]) {
      return maxSpotPlay(playLine, i + 1, score + letterValues[existingValue], string + existingValue, letterPool, branch[existingValue], newLetter);
    } else {
      return [-Infinity, ''];
    }
  }

  let bestScore = -Infinity;
  let bestString = '';

  if (branch.end && newLetter) {
    bestScore = score;
    bestString = string;
  }

  for (let letter in branch) {
    if (letterPool[letter] && letterPool[letter] > 0) {
      letterPool[letter]--;
      let maxWithLetter = maxSpotPlay(playLine, i + 1, score + letterValues[letter], string + letter, letterPool, branch[letter], true);
      letterPool[letter]++;
      if (maxWithLetter[0] > bestScore) {
        bestScore = maxWithLetter[0];
        bestString = maxWithLetter[1];
      }
    }
  }
  return [bestScore, bestString];
}

function tryLine(playLine, letterPool) {
  let firstLetter = letterBoard[playLine[0][0]][playLine[0][1]]
  let bestPlay = maxSpotPlay(playLine, 1, 0, firstLetter, letterPool, wordTree[firstLetter], false);

  return bestPlay;
}

function play() {
  let letterPool = getLetterPool();

  let playLines = [];
  for (let i = 0; i < letterBoard.length; i++) {
    for (let j = 0; j < letterBoard[0].length; j++) {
      if (letterBoard[i][j] == null) {
        continue;
      }
      for (let direction of directions) {
        let line = getPlayLine(i, j, direction);
        if (line.length !== 0) {
          playLines.push(line);
        }
      }
    }
  }

  let bestLine = null;
  let bestString = '';
  let bestScore = -1;
  for (let playLine of playLines) {
    let move = tryLine(playLine, letterPool);
    if (move[0] > bestScore) {
      bestLine = playLine;
      bestScore = move[0];
      bestString = move[1];
    }
  }

  for (let i = 0; i < bestString.length; i++) {
    letterBoard[bestLine[i][0]][bestLine[i][1]] = bestString[i];
  }
}

let resetButton = document.getElementById('reset-button');
resetButton.onclick = function() {
  resetBoard();
  displayBoard();
}

let placementButton = document.getElementById('placement-button');
placementButton.onclick = function() {
  play();
  displayBoard();
};

displayBoard();
