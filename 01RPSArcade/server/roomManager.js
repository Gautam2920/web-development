import { GameEngine } from "./gameEngine.js";

export class RoomManager {
    constructor() {
        this.rooms = new Map();
        this.games = new Map();
    }

    createRoom(socketId) {
        const roomId = this.generateRoomId();
        this.rooms.set(roomId, [socketId]);
        this.games.set(roomId, new GameEngine({ targetWins: 10 }));
        return roomId;
    }

    joinRoom(roomId, socketId) {
        if (!this.rooms.has(roomId)) return null;

        const players = this.rooms.get(roomId);

        if (players.length >= 2) return null;

        players.push(socketId);
        return players;
    }

    getRole(roomId, socketId) {
        const players = this.rooms.get(roomId);
        if (!players) return null;

        return players[0] === socketId ? "player1" : "player2";
    }

    submitMove(roomId, role, move) {
        const game = this.games.get(roomId);
        if (!game) return null;

        if (!game.pendingMoves) {
            game.pendingMoves = {};
        }

        game.pendingMoves[role] = move;

        if (game.pendingMoves.player1 && game.pendingMoves.player2) {
            const result = game.play(
                game.pendingMoves.player1,
                game.pendingMoves.player2
            );

            game.pendingMoves = {};

            return result;
        }

        return null;
    }

    findRoomBySocket(socketId) {
        for (const [roomId, players] of this.rooms.entries()) {
            if (players.includes(socketId)) {
                return roomId;
            }
        }
        return null;
    }

    removeRoom(roomId) {
        this.rooms.delete(roomId);
        this.games.delete(roomId);
    }

    generateRoomId() {
        return Math.random().toString(36).substring(2, 8);
    }
}