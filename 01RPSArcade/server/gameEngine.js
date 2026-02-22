export const RULES = {
    rock: ["scissors"],
    paper: ["rock"],
    scissors: ["paper"]
};

export class GameEngine {
    constructor({ targetWins = null, maxRounds = null } = {}) {
        this.targetWins = targetWins;
        this.maxRounds = maxRounds;
        this.reset();
    }

    reset() {
        this.player1Score = 0;
        this.player2Score = 0;
        this.round = 0;
    }

    evaluate(p1, p2) {
        if (p1 === p2) return "tie";
        return RULES[p1].includes(p2) ? "player1" : "player2";
    }

    play(p1, p2) {
        const result = this.evaluate(p1, p2);

        this.round++;

        if (result === "player1") this.player1Score++;
        if (result === "player2") this.player2Score++;

        return {
            round: this.round,
            player1Choice: p1,
            player2Choice: p2,
            result,
            player1Score: this.player1Score,
            player2Score: this.player2Score,
            isGameOver: this.isOver()
        };
    }

    isOver() {
        if (this.targetWins !== null) {
            return (
                this.player1Score >= this.targetWins ||
                this.player2Score >= this.targetWins
            );
        }

        if (this.maxRounds !== null) {
            return this.round >= this.maxRounds;
        }

        return false;
    }
}