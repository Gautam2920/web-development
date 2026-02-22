export const socket = io(window.location.origin);

export const RULES = {
    rock: ["scissors"],
    paper: ["rock"],
    scissors: ["paper"]
};