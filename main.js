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

let up = (p, k = 1) => [p[0] - k, p[1]];
let down = (p, k = 1) => [p[0] + k, p[1]];
let left = (p, k = 1) => [p[0], p[1] - k];
let right = (p, k = 1) => [p[0], p[1] + k];
let directions = [down, right];

function isPlayLine(x, y, direction) {
  let current = [x, y];
  while (inBounds(current)) {
    if (letterBoard[current[0]][current[1]] !== null) return true;
    current = direction(current);
  }

  return false;
}

function char(pos) {
  return letterBoard[pos[0]][pos[1]];
}

function sidesScore(x, y, direction, letter) {
  letterBoard[x][y] = letter;
  let back, forward;
  if (direction === left || direction === right) {
    // Discover and verify up/down words
    back = up;
    forward = down;
  } else {
    // Discover and verify left/right words
    back = left;
    forward = right;
  }
  let pos = [x, y];
  let ahead;
  while (ahead = back(pos)) {
    if (ahead[0] < 0 || ahead[1] < 0 || ahead[0] >= letterBoard.length || ahead[1] >= letterBoard.length) break;
    if (char(ahead) === null) break;
    pos = ahead;
  }

  let frame = wordTree;
  let score = 0;
  let count = 0;
  while (true) {
    if (!inBounds(pos) || char(pos) === null) {
      break;
    }
    if (!frame[char(pos)]) {
      letterBoard[x][y] = null;
      return -1;
    }
    score += letterValues[char(pos)];
    frame = frame[char(pos)];
    pos = forward(pos);
    count++;
  }

  if (!frame.end && count > 1) {
    letterBoard[x][y] = null;
    return -1;
  }

  let bonus = bonusBoard[x][y];
  if (bonus) {
    if (bonus.word) {
      score *= bonus.factor;
    } else {
      let sourceChar = char([x, y]);
      score -= letterValues[sourceChar];
      score += letterValues[sourceChar] * bonus.factor;
    }
  }

  letterBoard[x][y] = null;
  return score;
}

function maxSpotPlay(playLine, i, score, string, letterPool, branch, newLetter, start, wordBonus, firstLevel, oldLetter, sideTotal) {
  let bestSkipPlay;
  if (i >= letterBoard.length) {
    return [-Infinity, '', start];
  }
  let here = playLine[2]([playLine[0], playLine[1]], i);
  if (!newLetter && !oldLetter && (!inBounds(here) || char(here) === null)) {
    let nextClear = i;
    while (true) {
      nextClear += 1;
      let clearPos = playLine[2]([playLine[0], playLine[1]], nextClear);
      if (!inBounds(clearPos)) {
        break;
      }
      if (char(clearPos) === null) break;
    }
    bestSkipPlay = maxSpotPlay(playLine, nextClear + 1, 0, '', letterPool, wordTree, false, null, 1, true, false, 0);
  }
  let x = here[0];
  let y = here[1];
  let bonus = bonusBoard[x][y];
  let letterBonus = bonus === null ? 1 : (bonus.word ? 1 : bonus.factor);

  let nextHere = playLine[2](here, 1);
  
  let existingValue = letterBoard[x][y];
  if (existingValue !== null) {
    if (branch[existingValue]) {
      // Plays on existing letters does not get their bonuses
      let usePlay = maxSpotPlay(playLine, i + 1, score + letterValues[existingValue], string + existingValue, letterPool, branch[existingValue], newLetter, start === null ? i : start, wordBonus, false, true, sideTotal);
      return bestSkipPlay && (bestSkipPlay[0] > usePlay[0]) ? bestSkipPlay : usePlay;
    } else {
      return [-Infinity, '', start];
    }
  }

  let bestScore = -Infinity;
  let bestString = '';
  let bestStart = 0;

  if (branch.end && newLetter && oldLetter) {
    bestScore = (score * wordBonus) + sideTotal;
    bestString = string;
    bestStart = start;
  }

  if (bonus && bonus.word) {
    wordBonus *= bonus.factor;
  }

  for (let letter in branch) {
    if (letter === 'end') continue;
    let sideScore = sidesScore(x, y, playLine[2], letter);

    if (sideScore === -1) {
      continue;
    }
    if (letterPool[letter] && letterPool[letter] > 0) {
      letterPool[letter]--;
      let maxWithLetter = maxSpotPlay(playLine, i + 1, score + (letterBonus * letterValues[letter]), string + letter, letterPool, branch[letter], true, start === null ? i : start, wordBonus, false, oldLetter, sideTotal + sideScore);
      letterPool[letter]++;
      if (maxWithLetter[0] > bestScore) {
        bestScore = maxWithLetter[0];
        bestString = maxWithLetter[1];
        bestStart = maxWithLetter[2];
      }
    } else if (letterPool['*'] && letterPool['*'] > 0) {
      letterPool['*']--;
      let maxWithLetter = maxSpotPlay(playLine, i + 1, score, string + letter, letterPool, branch[letter], true, start === null ? i : start, wordBonus, false, oldLetter, sideTotal + sideScore);
      letterPool['*']++;
      if (maxWithLetter[0] > bestScore) {
        bestScore = maxWithLetter[0];
        bestString = maxWithLetter[1];
        bestStart = maxWithLetter[2];
      }
    }
  }

  if (!bestSkipPlay || bestScore > bestSkipPlay[0]) {
    return [bestScore, bestString, bestStart];
  } else {
    return bestSkipPlay;
  }
}

function tryLine(playLine, letterPool) {
  let bestPlay = maxSpotPlay(playLine, 0, 0, '', letterPool, wordTree, false, 0, 1, true, false, 0);

  return bestPlay;
}

function play() {
  let letterPool = getLetterPool();

  let playLines = [];
  for (let i = 0; i < letterBoard.length; i++) {
    if (isPlayLine(0, i, down)) {
      playLines.push([0, i, down]);
    }
    if (isPlayLine(i, 0, right)) {
      playLines.push([i, 0, right]);
    }
  }

  let bestLine = null;
  let bestString = '';
  let bestScore = -1;
  let bestIndex = -1;
  for (let playLine of playLines) {
    let move = tryLine(playLine, letterPool);
    if (move[0] > bestScore) {
      bestLine = playLine;
      bestScore = move[0];
      bestString = move[1];
      bestIndex = move[2];
    }
  }

  for (let i = 0; i < bestString.length; i++) {
    let pos = bestLine[2]([bestLine[0], bestLine[1]], i + bestIndex);
    letterBoard[pos[0]][pos[1]] = bestString[i];
  }
}

let resetButton = document.getElementById('reset-button');
resetButton.onclick = function() {
  resetBoard();
  displayBoard();
};

let placementButton = document.getElementById('placement-button');
placementButton.onclick = function() {
  play();
  displayBoard();
};

displayBoard();
