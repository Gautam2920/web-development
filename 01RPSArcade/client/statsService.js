export class StatsService {
    static getMulti() {
        return JSON.parse(localStorage.getItem("rpsMultiStats")) || {
            won: 0,
            lost: 0,
            left: 0
        };
    }

    static saveMulti(stats) {
        localStorage.setItem("rpsMultiStats", JSON.stringify(stats));
    }
}