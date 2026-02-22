import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { RoomManager } from "./roomManager.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_PATH = path.join(__dirname, "../client");

app.use(express.static(CLIENT_PATH));

const io = new Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"]
    }
});

const roomManager = new RoomManager();

io.on("connection", (socket) => {

    socket.on("createRoom", () => {
        const roomId = roomManager.createRoom(socket.id);
        socket.join(roomId);
        socket.emit("roomCreated", roomId);
    });

    socket.on("joinRoom", (roomId) => {
        const players = roomManager.joinRoom(roomId, socket.id);

        if (!players) {
            socket.emit("errorMessage", "Invalid or full room");
            return;
        }

        socket.join(roomId);

        io.to(players[0]).emit("gameStart", { roomId, role: "player1" });
        io.to(players[1]).emit("gameStart", { roomId, role: "player2" });
    });

    socket.on("playerMove", ({ roomId, move }) => {

        if (!["rock", "paper", "scissors"].includes(move)) return;

        const role = roomManager.getRole(roomId, socket.id);
        if (!role) return;

        const result = roomManager.submitMove(roomId, role, move);

        if (result) {
            io.to(roomId).emit("roundResult", result);

            if (result.isGameOver) {
                io.to(roomId).emit("gameOver", result);
                roomManager.removeRoom(roomId);
            }
        }
    });

    socket.on("disconnect", () => {
        const roomId = roomManager.findRoomBySocket(socket.id);

        if (roomId) {
            io.to(roomId).emit("playerLeft");
            roomManager.removeRoom(roomId);
        }
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});