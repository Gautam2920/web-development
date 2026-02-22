# Rock Paper Scissors Arcade

Live demo : https://rps-arcade.vercel.app/

A pixel flavored Rock Paper Scissors game that looks like it time
traveled from an 80s arcade cabinet but runs like modern modular
JavaScript.

Minimal UI. Warm colors. Clean architecture. Slightly judgmental AI.

---

## What This Is

This is a browser based Rock Paper Scissors game built with:

- Vanilla JavaScript
- Modular architecture
- CSS variables for theming
- A tiny AI system with multiple difficulty levels
- Retro arcade design using Press Start 2P font
- Persistent game state using localStorage
- Fully responsive layout

Open `index.html` and it just works.
Refresh and it stil remembers.

---

## How The App Is Structured

The project is intentionally split into layers.

### game.js

This is the brain.

It contains:

- Game state
- Rules
- Difficulty logic
- Score tracking
- Statistics
- State transitions
- Lifetime Statistics

You could plug this engine into React, Vue, or a toaster with WiFi and
it would still work.

---

### ui.js

This is the face.

It:

- Listens to button clicks
- Listens to keyboard input
- Renders round results
- Updates the scoreboard
- Handles reset
- Handles difficulty selection
- Toggles themes
- Persists theme preference
- Saves and restores match state

---

### styles.css

This is the aesthetic personality.

- Warm color palette
- Pixel style borders
- Hard shadows for arcade depth
- Responsive card layout
- Flexible controls for small screens
- Subtle square grid background
- Theme switching via CSS variables

---

## Persistence System

The game uses localStorage to maintain:

- Ongoing match state
- Selected difficulty
- Theme preference
- Lifetime statistics

If a game is in progress and the page reloads, the state is rehydrated.The engine resumes from where it left off.

No server required. Just browser memory and disciplined structure.

---

## How The Game Logic Works

### Rules System

Instead of long if statements, rules are defined in a map:

``` js
const RULES = {
  rock: ["scissors"],
  paper: ["rock"],
  scissors: ["paper"]
};
```

This makes the engine declarative and extendable.

Want to add Lizard and Spock?\
You just update the map.

---

## Difficulty Levels Explained

The difficulty is not fake. It actually changes the AI behavior.

### Easy

Pure randomness.\
Each move has equal probability.\
Mathematically fair. Emotionally neutral.

### Medium

Reactive.\
60 percent chance it counters your last move.\
40 percent chance it behaves randomly.

It punishes repetition but is not ruthless.

### Hard

Predictive.\
It analyzes your move history and finds your most frequent choice.\
Then it counters that.

This assumes you have habits.\
You probably do.

It does not cheat. It only studies.

---

## Game State

The engine maintains internal state:

- idle
- playing
- finished

This prevents weird edge cases like continuing after the game is over.

Rounds are capped using a configurable `maxRounds` value.

---

## Keyboard Support

You can play without touching the mouse:

- R for Rock
- P for Paper
- S for Scissors

Yes, it feels cooler that way.

---

## Why This Architecture Matters

This project is small, but it follows real architectural principles:

- Separation of concerns
- Pure logic layer
- UI abstraction
- Configurable behavior
- Extendable rules
- Predictable state transitions

It is intentionally simple but structurally scalable.

You could:

- Add animations
- Add sound effects
- Convert to TypeScript
- Plug it into a framework
- Add multiplayer

Without rewriting the core engine.

---

## How To Run

1. Clone or download the folder
2. Open `index.html`
3. Click buttons

---

## Final Thoughts

This is Rock Paper Scissors.\
But structured like it matters.

Because even small apps deserve clean thinking.

And also because the CPU is watching your patterns.

---
Happy Coding.
