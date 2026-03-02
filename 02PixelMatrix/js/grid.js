export function createGrid(container, size) {
    container.style.opacity = "0";

    setTimeout(() => {
        container.innerHTML = "";
        container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        container.style.gridTemplateRows = `repeat(${size}, 1fr)`;

        for (let i = 0; i < size * size; i++) {
            const square = document.createElement("div");
            square.classList.add("square");
            container.appendChild(square);
        }

        container.style.opacity = "1";
    }, 100);
}

export function paintSquare(square, state) {
    if (state.mode === "color") {
        square.style.backgroundColor = state.currentColor;
    }

    if (state.mode === "random") {
        square.style.backgroundColor = randomColor();
    }

    if (state.mode === "eraser") {
        square.style.backgroundColor = "";
    }

    square.classList.add("painted");

    setTimeout(() => {
        square.classList.remove("painted");
    }, 80);
}

function randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}