import { Game } from "./game.js";

const game = new Game();

const buttons = document.querySelectorAll("[data-choice]");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const finalEl = document.getElementById("final");
const roundEl = document.getElementById("round");
const statsEl = document.getElementById("stats");
const resetBtn = document.getElementById("reset");
const difficultySelect = document.getElementById("difficulty");
const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("rpsTheme");
if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("rpsTheme", isDark ? "dark" : "light");
});

buttons.forEach(btn => {
    btn.addEventListener("click", () => handleMove(btn.dataset.choice));
});

document.addEventListener("keydown", e => {
    if (e.key === "r") handleMove("rock");
    if (e.key === "p") handleMove("paper");
    if (e.key === "s") handleMove("scissors");
});

difficultySelect.addEventListener("change", e => {
    game.setDifficulty(e.target.value);
});

resetBtn.addEventListener("click", () => {
    game.reset();
    enableButtons();
    clearUI();
});

function handleMove(choice) {
    const data = game.play(choice);
    if (!data) return;

    render(data);

    if (data.isGameOver) {
        finalEl.textContent = game.getFinalResult();
        disableButtons();
        renderStats();
    }
}

function render(data) {
    roundEl.textContent = `ROUND ${data.round}`;
    resultEl.textContent =
        `${data.humanChoice.toUpperCase()} VS ${data.computerChoice.toUpperCase()} → ${data.result.toUpperCase()}`;
    scoreEl.textContent =
        `YOU: ${data.humanScore} | CPU: ${data.computerScore}`;
}

function renderStats() {
    const { games, humanWins, computerWins } = game.stats;
    statsEl.textContent =
        `GAMES: ${games} | YOU: ${humanWins} | CPU: ${computerWins}`;
}

function disableButtons() {
    buttons.forEach(b => b.disabled = true);
}

function enableButtons() {
    buttons.forEach(b => b.disabled = false);
}

function clearUI() {
    roundEl.textContent = "";
    resultEl.textContent = "";
    scoreEl.textContent = "";
    finalEl.textContent = "";
}