'use strict';

let doubleLetter = {
  word: false,
  factor: 2
};
let tripleLetter = {
  word: false,
  factor: 3
};

let doubleWord = {
  word: true,
  factor: 2
};
let tripleWord = {
  word: true,
  factor: 3
};

let width = 15,
    height = 15;

let bonusBoard = emptyBoard(width, height);

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
  return x >= 0
    && y >= 0
    && x < letterBoard.length
    && y < letterBoard[0].length
    && letterBoard[x][y] === null;
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
  return plays[0];
}

let placementButton = document.getElementById('placement-button');
placementButton.onclick = function() {
  let letterPool = getLetterPool();
  if (letterPool.length === 0) { return; }

  let playSpots = getPlaySpots();
  let plays = getPlays(playSpots, letterPool);
  let play = choosePlay(plays);

  console.log(playSpots);
  console.log(plays);
};

displayBoard();
