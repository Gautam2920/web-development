# Neon Noughts

**Live Demo:**  <https://neon-noughts.vercel.app/>

A deceptively innocent Tic Tac Toe game that starts cute… and then absolutely refuses to let you win on hard mode.

Built with clean vanilla JavaScript, a soft retro aesthetic, and an AI that does not believe in mercy.

---

## Features

- Three difficulty modes:
  - Easy -> emotionally supportive  
  - Medium -> occasionally suspicious  
  - Hard -> mathematically disrespectful  
  - Nightmare -> pure perfection

- Smooth turn-based gameplay with subtle animations
- Score tracking
- Undo system (for “that was a misclick” moments)
- Persistent settings via localStorage
- Sound effects with toggle control
- Responsive design that behaves across screens

---

## Architecture

    04NeonNoughts/
    │
    ├── index.html
    ├── style.css
    └── script.js

---

## AI System

The hard mode uses the Minimax algorithm, which means:

- It explores every possible outcome  
- It assumes you will play optimally  
- It still wins  

You are not playing the game.

The game is solving you.

---

## Persistence

Uses localStorage to remember:

- Score
- Difficulty
- Sound preference

Because forgetting your wins would be tragic.  
And forgetting your losses would be convenient.

We chose honesty.

---

## Controls

- Click -> place move  
- Reset -> start fresh  
- Undo -> rewrite history (limited power, sadly)  
- Difficulty -> choose your level of regret  
- Sound -> silence your failures if needed  

---

## Final Note

It’s Tic Tac Toe. You’ve played this before.

---

Happy Coding.
