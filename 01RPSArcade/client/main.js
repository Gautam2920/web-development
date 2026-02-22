import { GameEngine } from "./gameEngine.js";
import { socket } from "./socketService.js";

let engine = null;
let isMultiplayer = false;
let currentRoom = null;
let role = null;
let hasPlayedThisRound = false;

const themeToggle = document.getElementById("themeToggle");
const modeSelect = document.getElementById("modeSelect");
const gameArea = document.getElementById("gameArea");
const singleModeBtn = document.getElementById("singleMode");
const multiModeBtn = document.getElementById("multiMode");
const onlineControls = document.getElementById("onlineControls");
const createRoomBtn = document.getElementById("createRoom");
const joinRoomBtn = document.getElementById("joinRoom");
const roomInput = document.getElementById("roomInput");
const roomInfo = document.getElementById("roomInfo");
const controlsWrapper = document.getElementById("controlsWrapper");
const buttons = document.querySelectorAll("[data-choice]");
const roundEl = document.getElementById("round");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const finalEl = document.getElementById("final");
const resetBtn = document.getElementById("reset");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

singleModeBtn.addEventListener("click", () => {
    isMultiplayer = false;
    engine = new GameEngine({ maxRounds: 5, difficulty: "medium" });
    modeSelect.classList.add("hidden");
    gameArea.classList.remove("hidden");
    onlineControls.classList.add("hidden");
    controlsWrapper.classList.remove("hidden");
});

multiModeBtn.addEventListener("click", () => {
    isMultiplayer = true;
    modeSelect.classList.add("hidden");
    gameArea.classList.remove("hidden");
    onlineControls.classList.remove("hidden");
    controlsWrapper.classList.add("hidden");
});

resetBtn.addEventListener("click", () => {
    window.location.reload();
});

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const choice = btn.dataset.choice;
        handleMove(choice);
    });
});

function handleMove(choice) {
    if (!isMultiplayer) {
        const data = engine.play(choice);
        if (!data) return;

        renderSingle(data);

        if (data.isGameOver) {
            finalEl.textContent = engine.getFinalResult();
            disableButtons();
        }

        return;
    }

    if (hasPlayedThisRound) return;

    hasPlayedThisRound = true;
    disableButtons();
    resultEl.textContent = "WAITING FOR OPPONENT...";

    socket.emit("playerMove", {
        roomId: currentRoom,
        move: choice
    });
}

createRoomBtn.addEventListener("click", () => {
    socket.emit("createRoom");
});

joinRoomBtn.addEventListener("click", () => {
    const id = roomInput.value.trim();
    if (id) socket.emit("joinRoom", id);
});

socket.on("roomCreated", (roomId) => {
    roomInfo.textContent = "ROOM ID: " + roomId;
});

socket.on("gameStart", ({ roomId, role: assignedRole }) => {
    currentRoom = roomId;
    role = assignedRole;
    roomInfo.textContent = "YOU ARE " + role.toUpperCase();
    controlsWrapper.classList.remove("hidden");
    hasPlayedThisRound = false;
    enableButtons();
});

socket.on("roundResult", (data) => {
    hasPlayedThisRound = false;
    enableButtons();
    renderMulti(data);
});

socket.on("gameOver", (data) => {
    renderMulti(data);

    const iWon =
        (role === "player1" && data.player1Score > data.player2Score) ||
        (role === "player2" && data.player2Score > data.player1Score);

    finalEl.textContent = iWon ? "YOU WIN" : "YOU LOSE";
    disableButtons();
});

socket.on("playerLeft", () => {
    finalEl.textContent = "OPPONENT LEFT. YOU WIN.";
    disableButtons();
});

function renderSingle(data) {
    roundEl.textContent = "ROUND " + data.round;
    resultEl.textContent =
        data.playerChoice.toUpperCase() +
        " VS " +
        data.cpuChoice.toUpperCase() +
        " -> " +
        data.result.toUpperCase();

    scoreEl.textContent =
        "YOU: " + data.playerScore + " | CPU: " + data.cpuScore;
}

function renderMulti(data) {
    roundEl.textContent = "ROUND " + data.round;

    resultEl.textContent =
        data.player1Choice.toUpperCase() +
        " VS " +
        data.player2Choice.toUpperCase() +
        " -> " +
        data.result.toUpperCase();

    if (role === "player1") {
        scoreEl.textContent =
            "YOU: " + data.player1Score +
            " | OPP: " + data.player2Score;
    } else {
        scoreEl.textContent =
            "YOU: " + data.player2Score +
            " | OPP: " + data.player1Score;
    }
}

function disableButtons() {
    buttons.forEach(b => b.disabled = true);
}

function enableButtons() {
    buttons.forEach(b => b.disabled = false);
}