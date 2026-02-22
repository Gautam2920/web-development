export const CONFIG = {
    maxRounds: 5
};

export const RULES = {
    rock: ["scissors"],
    paper: ["rock"],
    scissors: ["paper"]
};

export class Game {
    constructor(difficulty = "easy") {
        this.difficulty = difficulty;
        this.reset();
        this.loadStats();
    }

    reset() {
        this.humanScore = 0;
        this.computerScore = 0;
        this.round = 0;
        this.state = "idle";
        this.history = [];
    }

    setDifficulty(level) {
        this.difficulty = level;
    }

    start() {
        this.state = "playing";
    }

    isGameOver() {
        return this.round >= CONFIG.maxRounds;
    }

    getComputerChoice() {
        const choices = Object.keys(RULES);

        if (this.difficulty === "easy") {
            return choices[Math.floor(Math.random() * choices.length)];
        }

        if (this.difficulty === "medium") {
            if (Math.random() < 0.6 && this.history.length > 0) {
                const last = this.history[this.history.length - 1];
                return this.getCounterMove(last);
            }
            return choices[Math.floor(Math.random() * choices.length)];
        }

        if (this.difficulty === "hard" && this.history.length > 0) {
            const freq = this.getMostFrequentMove();
            return this.getCounterMove(freq);
        }

        return choices[Math.floor(Math.random() * choices.length)];
    }

    getCounterMove(move) {
        return Object.keys(RULES).find(choice =>
            RULES[choice].includes(move)
        );
    }

    getMostFrequentMove() {
        const counts = {};
        this.history.forEach(m => counts[m] = (counts[m] || 0) + 1);
        return Object.keys(counts).reduce((a, b) =>
            counts[a] > counts[b] ? a : b
        );
    }

    evaluateRound(human, computer) {
        if (human === computer) return "tie";
        return RULES[human].includes(computer) ? "human" : "computer";
    }

    play(humanChoice) {
        if (this.state === "finished") return null;

        if (this.state === "idle") this.start();

        const computerChoice = this.getComputerChoice();
        const result = this.evaluateRound(humanChoice, computerChoice);

        this.history.push(humanChoice);
        this.round++;

        if (result === "human") this.humanScore++;
        if (result === "computer") this.computerScore++;

        if (this.isGameOver()) {
            this.state = "finished";
            this.updateStats();
        }

        return {
            round: this.round,
            humanChoice,
            computerChoice,
            result,
            humanScore: this.humanScore,
            computerScore: this.computerScore,
            isGameOver: this.isGameOver()
        };
    }

    getFinalResult() {
        if (this.humanScore > this.computerScore) return "YOU WIN";
        if (this.computerScore > this.humanScore) return "COMPUTER WINS";
        return "TIE GAME";
    }

    loadStats() {
        this.stats = JSON.parse(localStorage.getItem("rpsStats")) || {
            games: 0,
            humanWins: 0,
            computerWins: 0
        };
    }

    updateStats() {
        this.stats.games++;
        if (this.humanScore > this.computerScore) this.stats.humanWins++;
        if (this.computerScore > this.humanScore) this.stats.computerWins++;
        localStorage.setItem("rpsStats", JSON.stringify(this.stats));
    }
}