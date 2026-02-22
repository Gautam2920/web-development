# Rock Paper Scissors Arcade

A pixel-flavored Rock Paper Scissors game that looks like it
time‑traveled from an 80s arcade cabinet.\
but now runs a real-time multiplayer Node.js backend like it means
business.

Yes. It escalated.

---

## Live Status

Previously: Static browser game.\
Now: Server-authoritative multiplayer with WebSockets.

Because apparently even Rock Paper Scissors deserves infrastructure.

---

## What This Is

This is a retro-styled Rock Paper Scissors arcade featuring:

- Express + Socket.IO backend
- Real-time multiplayer
- Server-authoritative game engine
- Modular frontend architecture
- Press Start 2P pixel font
- CSS variable theme switching
- AI difficulty scaling
- Clean separation between client and server
- Deployment-ready structure

It still looks nostalgic.

---

## What Changed

Originally this project was:

- Pure browser logic
- localStorage persistence
- A slightly judgmental AI
- No backend
- Zero networking

Now it includes:

- Room creation
- Role assignment
- Move validation on the server
- Real-time round resolution
- Win detection
- Proper disconnection handling
- WebSocket communication
- No client-side cheating

---

## Architecture Overview

This project is intentionally split into layers:

### Server Layer (`/server`)

It handles:

- Room management
- Game state
- Score tracking
- Move validation
- Round resolution
- Win detection
- Disconnect cleanup

---

### Client Layer (`/client`)

It handles:

- UI rendering
- Theme toggling
- Mode switching
- Button interactions
- Single-player engine
- Multiplayer socket communication
- Score display
- State transitions

---

## Single Player Mode

Still here.

Difficulty levels:

### Easy

Pure randomness.\
Emotionally neutral. Morally fair.

### Medium

60 percent chance it counters your last move.\
40 percent chance it pretends it didn't notice.

### Hard

Analyzes your most frequent move.\
Counters it 85 percent of the time.

It doesn't cheat.\
It studies you.

That's worse.

---

## Multiplayer Mode

- Create a room
- Share the room ID
- Play in real time
- Server validates everything
- Automatic win detection
- Clean disconnect handling

Open two tabs.\
Open two devices.

---

## Rules System

Defined declaratively because we don't write 200-line if statements
anymore.

``` js
const RULES = {
  rock: ["scissors"],
  paper: ["rock"],
  scissors: ["paper"]
};
```

Want to add Lizard and Spock?\
Modify the map.

---

## State Management

Explicit states:

- idle
- playing
- finished

Multiplayer also buffers moves to prevent race conditions.

Yes. Even for Rock Paper Scissors.

---

## Project Structure

    rps-arcade/
    │
    ├── server/
    │   ├── index.js
    │   ├── roomManager.js
    │   └── gameEngine.js
    │
    ├── client/
    │   ├── index.html
    │   ├── styles.css
    │   ├── main.js
    │   ├── socketService.js
    │   └── gameEngine.js
    │
    ├── package.json
    └── .env

---

## How To Run Locally

```md

1. Clone the repository
2. Install dependencies

   npm install

3.Start the server

   npm start

4.Open

http://localhost:5000

```

---

## Deployment Notes

This project requires:

- A Node.js runtime
- Persistent WebSocket support
- Environment variable support

Recommended platforms:

- Render
- Railway
- Fly.io
- VPS

Not recommended:

- Serverless platforms that don't support persistent WebSockets

---

## Final Thought

The UI feels nostalgic.

---

Happy Coding.
