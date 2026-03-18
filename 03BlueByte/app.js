(() => {
    "use strict";

    const SELECTORS = {
        display: "#display",
        history: "#history",
        buttons: ".btn",
        themeToggle: "#themeToggle",
        soundToggle: "#soundToggle",
        copyBtn: "#copyBtn"
    };

    const STORAGE_KEYS = {
        theme: "bb-theme",
        history: "bb-last-history",
        sound: "bb-sound"
    };

    class CalculatorEngine {

        constructor() {
            this.reset();
        }

        reset() {
            this.current = "";
            this.previous = "";
            this.operator = null;
            this.lastOperator = null;
            this.lastOperand = null;
        }

        inputDigit(value) {
            if (value === "." && this.current.includes(".")) return this.current;
            if (this.current === "0" && value !== ".") {
                this.current = value;
            } else {
                this.current += value;
            }
            return this.current;
        }

        setOperator(op) {
            if (!this.current && !this.previous) return;
            if (this.current && this.previous) {
                this.evaluate();
            }
            this.operator = op;
            this.previous = this.current || this.previous;
            this.current = "";
        }

        evaluate() {
            if (!this.operator) return undefined;

            const a = Number(this.previous);
            const b = Number(this.current || this.lastOperand);

            if (isNaN(a) || isNaN(b)) return null;

            const operations = {
                "+": (x, y) => x + y,
                "-": (x, y) => x - y,
                "*": (x, y) => x * y,
                "/": (x, y) => y === 0 ? null : x / y
            };

            const result = operations[this.operator]?.(a, b);
            if (result === null || result === undefined) return null;

            const rounded = Number(result.toFixed(8));

            this.lastOperator = this.operator;
            this.lastOperand = b;

            this.previous = String(rounded);
            this.current = "";
            this.operator = null;

            return rounded;
        }

        repeatLast() {
            if (!this.lastOperator || this.lastOperand === null) return null;
            this.operator = this.lastOperator;
            this.current = String(this.lastOperand);
            return this.evaluate();
        }

        backspace() {
            this.current = this.current.slice(0, -1);
            return this.current || "0";
        }

    }

    class CalculatorApp {

        constructor() {
            this.engine = new CalculatorEngine();
            this.displayEl = document.querySelector(SELECTORS.display);
            this.historyEl = document.querySelector(SELECTORS.history);
            this.soundEnabled = true;
            this.audioCtx = null;
            this.init();
        }

        init() {
            this.bindEvents();
            this.restoreTheme();
            this.restoreHistory();
            this.restoreSound();
            this.updateDisplay("0");
        }

        bindEvents() {

            document.querySelectorAll(SELECTORS.buttons)
                .forEach(btn => btn.addEventListener("click", () => {
                    this.handleButton(btn);
                }));

            document.querySelector(SELECTORS.themeToggle)
                .addEventListener("click", () => this.toggleTheme());

            document.querySelector(SELECTORS.soundToggle)
                .addEventListener("click", () => this.toggleSound());

            document.querySelector(SELECTORS.copyBtn)
                .addEventListener("click", () => this.copyToClipboard());

            document.addEventListener("keydown", (e) => this.handleKeydown(e));
        }

        handleButton(btn) {

            const { value, action } = btn.dataset;

            if (action === "equals") {
                this.playClick("equals");
                this.handleEquals();
                return;
            }

            this.playClick("digit");

            if ((value && !isNaN(value)) || value === ".") {
                this.updateDisplay(this.engine.inputDigit(value));
                return;
            }

            if (["+", "-", "*", "/"].includes(value)) {
                this.engine.setOperator(value);
                return;
            }

            if (action === "clear") {
                this.clear();
            }
        }

        handleKeydown(e) {

            if (!isNaN(e.key) || e.key === ".") {
                this.playClick("digit");
                this.updateDisplay(this.engine.inputDigit(e.key));
            }

            if (["+", "-", "*", "/"].includes(e.key)) {
                this.playClick("digit");
                this.engine.setOperator(e.key);
            }

            if (e.key === "Enter") {
                this.playClick("equals");
                this.handleEquals();
            }

            if (e.key === "Backspace")
                this.updateDisplay(this.engine.backspace());

            if (e.key === "Escape")
                this.clear();
        }

        handleEquals() {

            const prev = this.engine.previous;
            const op = this.engine.operator;
            const curr = this.engine.current;

            let result = this.engine.evaluate();

            if (result === undefined) {
                result = this.engine.repeatLast();
            }

            if (result === null) {
                this.updateDisplay("ERROR");
                return;
            }

            if (op && curr) {
                const historyText = `${prev} ${op} ${curr} =`;
                this.historyEl.textContent = historyText;
                localStorage.setItem(STORAGE_KEYS.history, historyText);
            }

            this.updateDisplay(result);

            this.displayEl.classList.remove("pop");
            void this.displayEl.offsetWidth;
            this.displayEl.classList.add("pop");
        }

        clear() {
            this.engine.reset();
            this.historyEl.textContent = "";
            this.updateDisplay("0");
        }

        updateDisplay(value) {
            this.displayEl.textContent = value;
        }

        toggleTheme() {
            const body = document.body;
            const next = body.dataset.theme === "light" ? "dark" : "light";
            body.dataset.theme = next;
            localStorage.setItem(STORAGE_KEYS.theme, next);
        }

        restoreTheme() {
            const saved = localStorage.getItem(STORAGE_KEYS.theme);
            if (saved) document.body.dataset.theme = saved;
        }

        toggleSound() {
            this.soundEnabled = !this.soundEnabled;
            localStorage.setItem(STORAGE_KEYS.sound, this.soundEnabled);
        }

        restoreSound() {
            const saved = localStorage.getItem(STORAGE_KEYS.sound);
            if (saved !== null) {
                this.soundEnabled = saved === "true";
            }
        }

        playClick(type = "digit") {

            if (!this.soundEnabled) return;

            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }

            const oscillator = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            oscillator.type = "square";

            const frequency = type === "equals" ? 900 : 600;
            oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

            gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

            oscillator.connect(gain);
            gain.connect(this.audioCtx.destination);

            oscillator.start();
            oscillator.stop(this.audioCtx.currentTime + 0.08);
        }

        copyToClipboard() {
            navigator.clipboard.writeText(this.displayEl.textContent);
            const original = this.displayEl.textContent;
            this.displayEl.textContent = "COPIED";
            setTimeout(() => {
                this.displayEl.textContent = original;
            }, 700);
        }

        restoreHistory() {
            const saved = localStorage.getItem(STORAGE_KEYS.history);
            if (saved) this.historyEl.textContent = saved;
        }

    }

    document.addEventListener("DOMContentLoaded", () => {
        new CalculatorApp();
    });

})();