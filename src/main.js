import * as Assets from "./asset_index.js";
import { Timer } from "./timer.js";

const STATE_LOADING_INITIAL = 0;
const STATE_MAIN_MENU = 1;
let GAME_STATE = STATE_LOADING_INITIAL;

const TIMER = new Timer(60, mainloop);

function main() {
    TIMER.start();
}

function mainloop() {
    switch (GAME_STATE) {
        case STATE_LOADING_INITIAL:
            displayInitialLoadingScreen(() => GAME_STATE = STATE_MAIN_MENU);
            break;
        case STATE_MAIN_MENU:
            displayBackground();
            break;
        default:
            console.log("Broken game state");
            TIMER.stop();
            return;
    }
}

function displayInitialLoadingScreen(whenDone) {
    const gameCanvas = document.getElementById("gameCanvas");
    const ctx = gameCanvas.getContext("2d");
    var [total_assets, loaded_assets] = Assets.getLoadProgress();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.fillStyle = "white";
    ctx.font = "48px \"Verdana\"";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`Loading ${loaded_assets}/${total_assets}...`, gameCanvas.width / 2, gameCanvas.height / 2);
    if (loaded_assets === total_assets)
        whenDone();
}

const COFFEE_BROWN_TEXT = "#6F4E37";

function displayBackground() {
    const gameCanvas = document.getElementById("gameCanvas");
    const ctx = gameCanvas.getContext("2d");
    ctx.drawImage(Assets.COUNTER_BG, 0, 0, gameCanvas.width, gameCanvas.height);
    ctx.fillStyle = COFFEE_BROWN_TEXT;
    ctx.roundRect(gameCanvas.width/2 - 300, 80, 600, 120, 20);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "48px \"Verdana\"";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`A Perfect Cup of Brown`, gameCanvas.width / 2, 140);
    ctx.fillStyle = COFFEE_BROWN_TEXT;
    ctx.font = "36px \"Verdana\"";
    ctx.textBaseline = "top";
    ctx.fillText("Test text", gameCanvas.width / 2, 220);
}

main();
