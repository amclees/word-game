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
  [null, tl  , null, null, null, dw  , null, null, null, dw  , null, null, null, tl  , null],
  [null, null, dl  , null, null, null, tl  , null, tl  , null, null, null, dl  , null, null],
  [tw  , null, null, dl  , null, null, null, dw  , null, null, null, dl  , null, null, tw  ],
  [null, null, dl  , null, null, null, tl  , null, tl  , null, null, null, dl  , null, null],
  [null, tl  , null, null, null, dw  , null, null, null, dw  , null, null, null, tl  , null],
  [null, null, null, null, dw  , null, null, null, null, null, dw  , null, null, null, null],
  [dl  , null, null, dw  , null, null, null, dl  , null, null, null, dw  , null, null, dl  ],
  [null, null, dw  , null, null, null, dl  , null, dl  , null, null, null, dw  , null, null],
  [null, dw  , null, null, null, tl  , null, null, null, tl  , null, null, null, dw  , null],
  [tw  , null, null, dl  , null, null, null, tw  , null, null, null, dl  , null, null, tw  ],
];

let letterBoard = emptyBoard(width, height);

let start = [7, 7];

function getWords() {
  let url = './eng.min.json';
  let req = new XMLHttpRequest();
  req.open('GET', url, false);
  req.overrideMimeType('application/json');
  req.send();
  return req.responseText;
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
let wordDictionary = {};
for (let i = 0; i < words.length; i++) {
  let sorted = alphabetizeLetters(words[i]);
  if (!wordDictionary[sorted]) {
    wordDictionary[sorted] = [];
  }
  wordDictionary[sorted].push(words[i]);
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
      if (letterBoard[i][j]) {
        element.innerText = letterBoard[i][j].toUpperCase();
      } else {
        element.innerText = '\u25ef';
      }
      let x = i;
      let y = j;
      element.onclick = () => {
        let input = prompt('Enter the letter');
        if (!input || input.length !== 1 || !/[A-z]/.test(input)) {
          alert('Not a single letter');
          return;
        }
        letterBoard[x][y] = input.toLowerCase();
        displayBoard();
      }
      row.appendChild(element);
    }
    table.appendChild(row);
  }

  boardContainer.appendChild(table);
}

let letterPoolInput = document.getElementById('letter-pool');
function getLetterPool() {
  return normalizeLetters(letterPoolInput.value);
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

function scorePlay(play) {
  return play.word.split('').reduce((score, letter) => {
    return score + letterValues[letter];
  }, 0);
}

function spotEmpty(x, y, outOfBounds = false) {
  if (outOfBounds) {
    return (!(x >= 0
      && y >= 0
      && x < letterBoard.length
      && y < letterBoard[0].length))
      || letterBoard[x][y] === null;
  } else {
    return x >= 0
      && y >= 0
      && x < letterBoard.length
      && y < letterBoard[0].length
      && letterBoard[x][y] === null;
  }
}

function adjacent(x, y) {
  let adjacents = [];
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
        adjacents.push([adjacentX, adjacentY]);
      }
    }
  }
  return adjacents;
}

function spotClear(x, y, whitelisted) {
  if (!whitelisted) { whitelisted = []; }

  if (
    !(x >= 0
    && x < letterBoard.length
    && y >= 0
    && y < letterBoard[0].length)
  ) {
    return false;
  }

  return adjacent(x, y).reduce(function(acc, adjacent) {
    return acc && (spotEmpty(adjacent[0], adjacent[1]) || whitelisted.reduce(function(acc, whitelisted) {
      return acc || (whitelisted[0] === adjacent[0] && whitelisted[1] == adjacent[1])
    }, false));
  }, true);
}

function getPlaySpots() {
  let playSpots = [];
  for (let i = 0; i < letterBoard.length; i++) {
    for (let j = 0; j < letterBoard[0].length; j++) {
      Array.prototype.push.apply(playSpots, playSpotsAtLocation(i, j));
    }
  }
  return playSpots;
}

function playSpotsAtLocation(i, j) {
  let spot = false,
      spotSize = 1,
      playSpots = [];

  if (letterBoard[i][j] !== null) {
    // Length of spots includes the existing letter
    if (
      spotClear(
        i, j + 1, [[i, j], [i - 1, j], [i + 1, j]]
      )
      && spotEmpty(i, j - 1, true)
    ) {
      let whitelist = [[i, j], [i - 1, j], [i + 1, j]];
      for (let k = j + 1; k < letterBoard[0].length; k++) {
        if (!spotClear(i, k, whitelist)) {
          break;
        }
        spotSize++;
        whitelist.push([i, k]);
      }

      playSpots.push({
        spot: [i, j],
        letter: letterBoard[i][j],
        // Directions are 0, 1 for right and down respectively
        direction: 0,
        length: spotSize
      });
    }
    spotSize = 1;
    if (
      spotClear(
        i + 1, j, [[i, j], [i, j - 1], [i, j + 1]]
      )
      && spotEmpty(i - 1, j, true)
    ) {
      let whitelist = [[i, j], [i, j - 1], [i, j + 1]];
      for (let k = i + 1; k < letterBoard.length; k++) {
        if (!spotClear(k, j, whitelist)) {
          break;
        }
        spotSize++;
        whitelist.push([k, j]);
      }

      playSpots.push({
        spot: [i, j],
        letter: letterBoard[i][j],
        direction: 1,
        length: spotSize
      });
    }
  }

  return playSpots;
}

function getPlays(playSpots, letterPool) {
  let plays = [];
  for (let i = 0; i < playSpots.length; i++) {
    let playSpot = playSpots[i];
    for (let length = playSpot.length; length >= 2; length--) {
      let wordBases = combinations(letterPool, length - 1).map((lettersUsed) => {
        return alphabetizeLetters(playSpot.letter + lettersUsed);
      }).filter((possibleWord) => {
        return wordDictionary[possibleWord] !== undefined;
      });
      let words = [];
      wordBases.forEach((wordBase) => {
        Array.prototype.push.apply(words, wordDictionary[wordBase].filter((potentialWord) => {
          return potentialWord.charAt(0) === playSpot.letter;
        }));
      });
      Array.prototype.push.apply(plays, words.map((word) => {
        return {
          'word': word,
          'playSpot': playSpot
        };
      }));
    }
  }
  return plays;
}

function choosePlay(plays) {
  let scores = plays.map(scorePlay);
  let highScore = -1;
  let toReturn = null;
  for (let i = 0; i < plays.length; i++) {
    if (scores[i] > highScore) {
      toReturn = plays[i];
      highScore = scores[i];
    }
  }
  return toReturn;
}

function applyPlay(play) {
  let changingDimensionStart = play.playSpot.spot[play.playSpot.direction === 1 ? 0 : 1];
  for (let i = changingDimensionStart; i < changingDimensionStart + play.word.length; i++) {
    if (play.playSpot.direction === 0) {
      letterBoard[play.playSpot.spot[0]][i] = play.word.charAt(i - changingDimensionStart);
    } else {
      letterBoard[i][play.playSpot.spot[1]] = play.word.charAt(i - changingDimensionStart);
    }
  }
  displayBoard();
}

let placementButton = document.getElementById('placement-button');
placementButton.onclick = function() {
  let letterPool = getLetterPool();
  if (letterPool.length === 0) { return; }

  let playSpots = getPlaySpots();
  let plays = getPlays(playSpots, letterPool);
  let play = choosePlay(plays);

  applyPlay(play);
};

displayBoard();
