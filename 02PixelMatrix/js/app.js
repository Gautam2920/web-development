import { createGrid, paintSquare } from "./grid.js";
import { initControls } from "./controls.js";

const gridContainer = document.getElementById("grid-container");
const gridSizeInput = document.getElementById("grid-size");
const gridSizeDisplay = document.getElementById("grid-size-display");
const colorPicker = document.getElementById("color-picker");
const modeButtons = document.querySelectorAll("[data-mode]");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");
const exportBtn = document.getElementById("export-btn");

const state = {
    gridSize: 16,
    currentColor: "#ff8c42",
    mode: "color",
    isDrawing: false
};

createGrid(gridContainer, state.gridSize);

gridContainer.addEventListener("mousedown", () => {
    state.isDrawing = true;
});

gridContainer.addEventListener("mouseup", () => {
    state.isDrawing = false;
});

gridContainer.addEventListener("mouseleave", () => {
    state.isDrawing = false;
});

gridContainer.addEventListener("mouseover", (e) => {
    if (!state.isDrawing) return;
    if (!e.target.classList.contains("square")) return;

    paintSquare(e.target, state);
});

exportBtn.addEventListener("click", () => {
  html2canvas(gridContainer).then(canvas => {
    const link = document.createElement("a");
    link.download = "pixel-matrix.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

initControls(state, {
    gridContainer,
    gridSizeInput,
    gridSizeDisplay,
    colorPicker,
    modeButtons,
    clearBtn,
    themeToggle
}, createGrid);