const state = {
    board: Array(9).fill(""),
    currentPlayer: "X",
    gameActive: true,
    difficulty: "easy",
    score: { X: 0, O: 0 },
    history: [],
    soundOn: true
};

const WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");

const startBtn = document.getElementById("startBtn");
const homeBtn = document.getElementById("homeBtn");
const resetBtn = document.getElementById("resetBtn");
const undoBtn = document.getElementById("undoBtn");
const soundToggle = document.getElementById("soundToggle");

const turnEl = document.getElementById("turn");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");

const boardEl = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const diffBtns = document.querySelectorAll(".diff");

const sounds = {
    click: new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"),
    win: new Audio("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"),
    draw: new Audio("https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3")
};

Object.values(sounds).forEach(s => {
    s.preload = "auto";
    s.volume = 0.6;
});

function play(sound, volume = 0.6) {
    if (!state.soundOn) return;
    sound.pause();
    sound.currentTime = 0;
    sound.volume = volume;
    sound.play().catch(() => { });
}

function saveState() {
    localStorage.setItem("ttt-state", JSON.stringify({
        score: state.score,
        difficulty: state.difficulty,
        soundOn: state.soundOn
    }));
}

function loadState() {
    const data = JSON.parse(localStorage.getItem("ttt-state"));
    if (!data) return;

    state.score = data.score || state.score;
    state.difficulty = data.difficulty || state.difficulty;
    state.soundOn = data.soundOn ?? true;

    renderScore();

    diffBtns.forEach(b => {
        b.classList.toggle("active", b.dataset.level === state.difficulty);
    });

    updateSoundUI();
}

function switchScreen(screen) {
    homeScreen.classList.remove("active");
    gameScreen.classList.remove("active");

    if (screen === "home") homeScreen.classList.add("active");
    if (screen === "game") gameScreen.classList.add("active");
}

function updateBoard(index, player) {
    state.board[index] = player;
}

function checkWinner(board) {
    for (let combo of WIN_COMBOS) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], combo };
        }
    }
    return { winner: null, combo: null };
}

function isDraw(board) {
    return !board.includes("");
}

function renderCell(cell, player) {
    cell.textContent = player;
    cell.classList.add("filled", "pop");
}

function renderBoard() {
    cells.forEach((cell, i) => {
        cell.textContent = state.board[i];
        cell.classList.remove("filled", "win");

        if (state.board[i]) {
            cell.classList.add("filled");
        }
    });
}

function renderTurn(text) {
    turnEl.textContent = text;
}

function renderScore() {
    scoreXEl.textContent = state.score.X;
    scoreOEl.textContent = state.score.O;
}

function highlightWin(combo) {
    combo.forEach(i => cells[i].classList.add("win"));
}

function disableBoard() {
    boardEl.classList.add("disabled");
}

function enableBoard() {
    boardEl.classList.remove("disabled");
}

function makeMove(index, cell) {
    state.history.push([...state.board]);

    updateBoard(index, state.currentPlayer);
    renderCell(cell, state.currentPlayer);
    play(sounds.click, 0.4);

    const result = checkWinner(state.board);

    if (result.winner) {
        state.gameActive = false;
        highlightWin(result.combo);

        play(sounds.win, 0.7);

        state.score[result.winner]++;
        renderScore();
        renderTurn(`${result.winner} Wins!`);
        saveState();

        disableBoard();
        return;
    }

    if (isDraw(state.board)) {
        state.gameActive = false;

        play(sounds.draw, 0.7);

        renderTurn("It's a Draw!");
        disableBoard();
        return;
    }

    state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";
    renderTurn(`Turn: ${state.currentPlayer}`);
}

function aiMove() {
    if (!state.gameActive || state.currentPlayer !== "O") return;

    let index;

    if (state.difficulty === "easy") {
        index = randomMove();
    } else if (state.difficulty === "medium") {
        index = Math.random() < 0.5 ? randomMove() : bestMove();
    } else {
        index = bestMove();
    }

    makeMove(index, cells[index]);
}

function randomMove() {
    const empty = state.board
        .map((v, i) => v === "" ? i : null)
        .filter(v => v !== null);

    return empty[Math.floor(Math.random() * empty.length)];
}

function bestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
        if (state.board[i] === "") {
            state.board[i] = "O";
            let score = minimax(state.board, 0, false);
            state.board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    const result = checkWinner(board);

    if (result.winner === "O") return 10 - depth;
    if (result.winner === "X") return depth - 10;
    if (isDraw(board)) return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = "";
            }
        }
        return best;
    }
}

function resetGame() {
    state.board = Array(9).fill("");
    state.currentPlayer = "X";
    state.gameActive = true;
    state.history = [];

    renderTurn("Turn: X");
    enableBoard();

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("filled", "win", "pop");
    });
}

function updateSoundUI() {
    soundToggle.textContent = state.soundOn ? "Sound: On" : "Sound: Off";
    soundToggle.classList.toggle("muted", !state.soundOn);
}

startBtn.addEventListener("click", () => {
    resetGame();
    switchScreen("game");
});

homeBtn.addEventListener("click", () => switchScreen("home"));

resetBtn.addEventListener("click", resetGame);

undoBtn.addEventListener("click", () => {
    if (state.history.length === 0 || !state.gameActive) return;

    state.board = state.history.pop();
    state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";

    renderBoard();
    renderTurn(`Turn: ${state.currentPlayer}`);
});

soundToggle.addEventListener("click", () => {
    state.soundOn = !state.soundOn;
    updateSoundUI();
    saveState();
});

cells.forEach(cell => {
    cell.addEventListener("click", (e) => {
        const index = Number(e.target.dataset.index);

        if (!state.gameActive || state.board[index] !== "") return;

        makeMove(index, e.target);

        if (state.gameActive && state.currentPlayer === "O") {
            boardEl.classList.add("disabled");

            setTimeout(() => {
                aiMove();
                boardEl.classList.remove("disabled");
            }, 500);
        }
    });
});

diffBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        diffBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        state.difficulty = btn.dataset.level;
        resetGame();
        saveState();
    });
});

loadState();
updateSoundUI();