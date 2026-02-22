import { RULES } from "./socketService.js";

export class GameEngine {
    constructor({ maxRounds = 5, difficulty = "easy" } = {}) {
        this.maxRounds = maxRounds;
        this.difficulty = difficulty;
        this.reset();
    }

    reset() {
        this.playerScore = 0;
        this.cpuScore = 0;
        this.round = 0;
        this.history = [];
        this.state = "idle";
    }

    setDifficulty(level) {
        this.difficulty = level;
    }

    start() {
        this.state = "playing";
    }

    isOver() {
        return this.round >= this.maxRounds;
    }

    evaluate(player, cpu) {
        if (player === cpu) return "tie";
        return RULES[player].includes(cpu) ? "player" : "cpu";
    }

    getRandomMove() {
        const moves = Object.keys(RULES);
        return moves[Math.floor(Math.random() * moves.length)];
    }

    getCounterMove(move) {
        return Object.keys(RULES).find(choice =>
            RULES[choice].includes(move)
        );
    }

    getMostFrequentMove() {
        const counts = {};
        for (const move of this.history) {
            counts[move] = (counts[move] || 0) + 1;
        }
        return Object.keys(counts).reduce((a, b) =>
            counts[a] > counts[b] ? a : b
        );
    }

    getCpuMove() {
        if (this.difficulty === "easy") {
            return this.getRandomMove();
        }

        if (this.difficulty === "medium") {
            if (Math.random() < 0.6 && this.history.length > 0) {
                const last = this.history[this.history.length - 1];
                return this.getCounterMove(last);
            }
            return this.getRandomMove();
        }

        if (this.difficulty === "hard") {
            if (this.history.length > 0) {
                const frequent = this.getMostFrequentMove();
                if (Math.random() < 0.85) {
                    return this.getCounterMove(frequent);
                }
            }
            return this.getRandomMove();
        }

        return this.getRandomMove();
    }

    play(playerMove) {
        if (this.state === "finished") return null;
        if (this.state === "idle") this.start();

        const cpuMove = this.getCpuMove();
        const result = this.evaluate(playerMove, cpuMove);

        this.history.push(playerMove);
        this.round++;

        if (result === "player") this.playerScore++;
        if (result === "cpu") this.cpuScore++;

        if (this.isOver()) {
            this.state = "finished";
        }

        return {
            round: this.round,
            playerChoice: playerMove,
            cpuChoice: cpuMove,
            result,
            playerScore: this.playerScore,
            cpuScore: this.cpuScore,
            isGameOver: this.isOver()
        };
    }

    getFinalResult() {
        if (this.playerScore > this.cpuScore) return "YOU WIN";
        if (this.cpuScore > this.playerScore) return "CPU WINS";
        return "TIE GAME";
    }
}