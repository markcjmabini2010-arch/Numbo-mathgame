const gridEl = document.getElementById("grid");
const questionEl = document.getElementById("question");
const statusEl = document.getElementById("status");

const nextBtn = document.getElementById("nextBtn");
const newBoardBtn = document.getElementById("newBoardBtn");
const resetMarksBtn = document.getElementById("resetMarksBtn");

const SIZE = 5;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeQuestion() {
  const type = randFrom(["+", "-", "×"]);
  let a = randInt(1, 20);
  let b = randInt(1, 20);

  if (type === "-" && b > a) [a, b] = [b, a];

  const text = `${a} ${type} ${b} = ?`;
  const answer = (type === "+") ? a + b : (type === "-") ? a - b : a * b;
  return { text, answer };
}

let board = [];
let marked = [];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function render() {
  gridEl.innerHTML = "";
  board.forEach((val, idx) => {
    const cell = document.createElement("div");
    cell.className = "cell" + (marked[idx] ? " marked" : "");
    cell.textContent = val;

    cell.addEventListener("click", () => {
      marked[idx] = !marked[idx];
      cell.classList.toggle("marked");
      checkBingo();
    });

    gridEl.appendChild(cell);
  });
}

function newBoard() {
  statusEl.textContent = "";
  const answers = new Set();

  while (answers.size < SIZE * SIZE) {
    const q = makeQuestion();
    answers.add(q.answer);
  }

  board = Array.from(answers);
  shuffle(board);
  marked = Array(SIZE * SIZE).fill(false);
  render();
}

function resetMarks() {
  marked = Array(SIZE * SIZE).fill(false);
  render();
  statusEl.textContent = "";
}

function checkBingo() {
  const lines = [];

  for (let r = 0; r < SIZE; r++) {
    lines.push([...Array(SIZE)].map((_, c) => r * SIZE + c));
  }

  for (let c = 0; c < SIZE; c++) {
    lines.push([...Array(SIZE)].map((_, r) => r * SIZE + c));
  }

  lines.push([...Array(SIZE)].map((_, i) => i * SIZE + i));
  lines.push([...Array(SIZE)].map((_, i) => i * SIZE + (SIZE - 1 - i)));

  const hasBingo = lines.some(line => line.every(i => marked[i]));
  statusEl.textContent = hasBingo ? "🎉 BINGO! You got 5 in a row!" : "";
}

let current = null;
function nextQuestion() {
  current = makeQuestion();
  questionEl.textContent = current.text;

  const exists = board.includes(current.answer);
  statusEl.textContent = exists ? "" : "No matching answer on this board — press Next Question again.";
}

nextBtn.addEventListener("click", nextQuestion);
newBoardBtn.addEventListener("click", () => {
  newBoard();
  questionEl.textContent = "Press “Next Question”";
});
resetMarksBtn.addEventListener("click", resetMarks);

newBoard();
