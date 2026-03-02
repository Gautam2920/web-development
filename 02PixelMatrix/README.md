# Pixel Matrix

**Live Demo:**  

A retro-inspired pixel drawing app that looks like it belongs on an arcade cabinet but runs on clean, modular vanilla JavaScript.

---

## Features

- Drag-to-draw interaction  
- Adjustable grid size (8×8 → 64×64)  
- Color, Random, and Eraser modes  
- Theme switching (Warm Arcade <-> Purple Night)  
- Export drawing as PNG  
- Responsive layout  
- Subtle paint micro-animations

---

## Export System

Uses html2canvas to capture the grid and generate a PNG download.

Because if you draw something impressive, you deserve evidence.

---

## Architecture

    02PixelMatrix/
    │
    ├── index.html
    ├── css/
    │ ├── base.css
    │ ├── layout.css
    │ └── components.css
    │
    └── js/
     ├── app.js
     ├── grid.js
     └── controls.js

---

## Final Note

It draws tiny squares.

---

Happy Coding.
