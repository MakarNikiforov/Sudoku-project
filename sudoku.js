

let cells = [];
let lives = 5;

const puzzle = [
  5,3,0, 0,7,0, 0,0,0,
  6,0,0, 1,9,5, 0,0,0,
  0,9,8, 0,0,0, 0,6,0,
  8,0,0, 0,6,0, 0,0,3,
  4,0,0, 8,0,3, 0,0,1,
  7,0,0, 0,2,0, 0,0,6,
  0,6,0, 0,0,0, 2,8,0,
  0,0,0, 4,1,9, 0,0,5,
  0,0,0, 0,8,0, 0,7,9
];

const solution = [
  5,3,4, 6,7,8, 9,1,2,
  6,7,2, 1,9,5, 3,4,8,
  1,9,8, 3,4,2, 5,6,7,
  8,5,9, 7,6,1, 4,2,3,
  4,2,6, 8,5,3, 7,9,1,
  7,1,3, 9,2,4, 8,5,6,
  9,6,1, 5,3,7, 2,8,4,
  2,8,7, 4,1,9, 6,3,5,
  3,4,5, 2,8,6, 1,7,9
];



function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.add('hidden');
  });

  document.getElementById(id).classList.remove('hidden');

  if (id === "game") {
    resetGame();
  }
}

const sideMenu = document.getElementById("side-menu");
const sideTab = document.getElementById("side-tab");

sideTab.addEventListener("mouseenter", () => {
  sideMenu.style.left = "0";
});

sideMenu.addEventListener("mouseleave", () => {
  sideMenu.style.left = "-260px"; // match width
});

const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");
const overlay = document.getElementById("overlay");
const closePopupBtn = document.getElementById("close-popup");
const sudokuGrid = document.querySelector(".sudoku");


function openPopup(type) {
  overlay.classList.remove("hidden");
  popup.classList.remove("hidden");

  sudokuGrid.classList.add("blur");

  if (type === "rules") {
    popupContent.innerHTML = `
      <h2>Rules</h2>
      <p>
        Fill the grid so that every row, column,
        and each 3×3 box contains the numbers 1–9 exactly once.
      </p>
    `;
  }

  if (type === "credits") {
    popupContent.innerHTML = `
      <h2>Credits</h2>
      <p>Game created by YOU 😎</p>
    `;
  }
}

 
closePopupBtn.addEventListener("click", closePopup);
overlay.addEventListener("click", closePopup);

function closePopup() {
  overlay.classList.add("hidden");
  popup.classList.add("hidden");
  sudokuGrid.classList.remove("blur");
}


function resetGame() {
  lives = 5;
  updateLives();
  document.getElementById('win-message').style.display = "none";

  buildGrid();
  attachCellEvents();
  updateNumberBar();
}

  


function buildGrid() {
  const sudokuContainer = document.querySelector('#game .sudoku');
  sudokuContainer.innerHTML = "";

  puzzle.forEach((num) => {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('cell');

    const input = document.createElement('input');
    input.setAttribute('maxlength', '1');

    if (num !== 0) {
      input.value = num;
      input.readOnly = true;
      cellDiv.classList.add('fixed');
      input.classList.add('fixed');
    }

    cellDiv.appendChild(input);
    sudokuContainer.appendChild(cellDiv);
  });

  cells = Array.from(document.querySelectorAll('.cell input'));
}




function attachCellEvents() {

  cells.forEach((input, index) => {
    input.addEventListener('click', () => {
      clearHighlights();
      highlightRowAndColumn(index);
      highlightSameNumbers(input.value);
    });
  });

  cells.forEach((input, i) => {
    if (!input.readOnly) {
      input.addEventListener('input', (e) => {
        const val = e.target.value;
        if (!/^[1-9]?$/.test(val)) e.target.value = '';

        const conflicts = validate();
        conflicts.forEach((k) => cells[k].classList.add('conflict'));

        updateNumberBar();

        if (val && parseInt(val) !== solution[i]) {
          lives--;
          updateLives();

          if (lives <= 0) {
            showScreen("lose");
          }
        }

        if (conflicts.length === 0 && checkWin()) {
          document.getElementById('win-message').style.display = 'block';
        }
      });
    }
  });

}





document.addEventListener('DOMContentLoaded', () => {
  buildGrid();
  attachCellEvents();
  updateLives();
  updateNumberBar();
});










const numberBoxes = document.querySelectorAll(".num");



const livesDisplay = document.getElementById("lives");


function updateLives() {
  livesDisplay.textContent = "❤️".repeat(lives);
}


function updateNumberBar() {
  const counts = Array(10).fill(0);

  cells.forEach(input => {
    const val = input.value;
    if (/^[1-9]$/.test(val)) {
      counts[val]++;
    }
  });

  numberBoxes.forEach((box, i) => {
    const num = i + 1;
    if (counts[num] === 9) {
      box.classList.add("complete");
    } else {
      box.classList.remove("complete");
    }
  });
}




  // --- Helper functions ---
  function getPos(index) {
    return {
      row: Math.floor(index / 9),
      col: index % 9,
      box:
        Math.floor(Math.floor(index / 9) / 3) * 3 +
        Math.floor((index % 9) / 3),
    };
  }



  function getVal(input) {
    const val = input.value.trim();
    return /^[1-9]$/.test(val) ? val : null;
  }



  function clearConflicts() {
    cells.forEach((c) => c.classList.remove('conflict'));
  }



 function validate() {
  clearConflicts();
  let conflicts = new Set();

  const rows = Array.from({ length: 9 }, () => new Map());
  const cols = Array.from({ length: 9 }, () => new Map());
  const boxes = Array.from({ length: 9 }, () => new Map());

  cells.forEach((input, i) => {
    const pos = getPos(i);
    const val = getVal(input);
    if (!val) return;

    // WRONG NUMBER 
    if (parseInt(val) !== solution[i]) {
      conflicts.add(i);
    }

    // Row check
    if (rows[pos.row].has(val)) {
      conflicts.add(i);
      conflicts.add(rows[pos.row].get(val));
    } else rows[pos.row].set(val, i);

    // Column check
    if (cols[pos.col].has(val)) {
      conflicts.add(i);
      conflicts.add(cols[pos.col].get(val));
    } else cols[pos.col].set(val, i);

    // Box check
    if (boxes[pos.box].has(val)) {
      conflicts.add(i);
      conflicts.add(boxes[pos.box].get(val));
    } else boxes[pos.box].set(val, i);
  });

  return Array.from(conflicts);
}






function highlightRowAndColumn(index) {
  const row = Math.floor(index / 9);
  const col = index % 9;
  const boxRow = Math.floor(row / 3);
  const boxCol = Math.floor(col / 3);

  
  document.querySelectorAll('.cell').forEach((cell, i) => {
    const r = Math.floor(i / 9);
    const c = i % 9;

    if (r === row) cell.classList.add('highlight-row');
    if (c === col) cell.classList.add('highlight-col');

    if (
      Math.floor(r / 3) === boxRow &&
      Math.floor(c / 3) === boxCol
    ) {
      cell.classList.add('highlight-row');
    }
  });
}


 function clearHighlights() {
  document.querySelectorAll('.cell').forEach((c) => {
    c.classList.remove('highlight-number');
    c.classList.remove('highlight-row');
    c.classList.remove('highlight-col');
  });
}

function highlightSameNumbers(num) {
  if (!num) return;
  cells.forEach((input) => {
    if (input.value === num) {
      input.parentElement.classList.add('highlight-number');
    }
  });
}
  


// Attach click event to all cells (fixed or not)

  // --- Click events for highlighting ---
 



  function checkWin() {
    
    for (let i = 0; i < 81; i++) {
      if (parseInt(cells[i].value) !== solution[i]) return false;
    }
    return true;

  }















/*
    5,3,0, 0,7,0, 0,0,0,
    6,0,0, 1,9,5, 0,0,0,
    0,9,8, 0,0,0, 0,6,0,

    8,0,0, 0,6,0, 0,0,3,
    4,0,0, 8,0,3, 0,0,1,
    7,0,0, 0,2,0, 0,0,6,

    0,6,0, 0,0,0, 2,8,0,
    0,0,0, 4,1,9, 0,0,5,
    0,0,0, 0,8,0, 0,7,9
    */