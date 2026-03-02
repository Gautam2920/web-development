export function initControls(state, elements, createGrid) {
    const {
        gridContainer,
        gridSizeInput,
        gridSizeDisplay,
        colorPicker,
        modeButtons,
        clearBtn,
        themeToggle
    } = elements;

    gridSizeInput.addEventListener("input", (e) => {
        state.gridSize = parseInt(e.target.value);
        gridSizeDisplay.textContent = `${state.gridSize} x ${state.gridSize}`;
        createGrid(gridContainer, state.gridSize);
    });

    colorPicker.addEventListener("input", (e) => {
        state.currentColor = e.target.value;
        state.mode = "color";
        updateActiveButton(modeButtons, "color");
    });

    modeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            state.mode = btn.dataset.mode;
            updateActiveButton(modeButtons, state.mode);
        });
    });

    clearBtn.addEventListener("click", () => {
        gridContainer.querySelectorAll(".square").forEach(square => {
            square.style.backgroundColor = "";
        });
    });

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("alt");
    });
}

function updateActiveButton(buttons, activeMode) {
    buttons.forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.mode === activeMode) {
            btn.classList.add("active");
        }
    });
}