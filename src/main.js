import { Timer } from "./timer.js";
import * as Assets from "./asset_index.js";
import { LoadingScreen } from "./screens/loading_screen.js";

const TIMER = new Timer(60, mainloop);

let CURRENT_SCREEN = null;

function setScreen(screen) {
    CURRENT_SCREEN = screen;
}

function main() {
    const gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.addEventListener("click", (event) => {
        if (CURRENT_SCREEN)
            CURRENT_SCREEN.onClick(event);
    });
    gameCanvas.addEventListener("mousemove", (event) => {
        if (CURRENT_SCREEN)
            CURRENT_SCREEN.setHovered(event);
    });
    setScreen(new LoadingScreen(setScreen))
    TIMER.start();
}

function mainloop() {
    const gameCanvas = document.getElementById("gameCanvas");
    const ctx = gameCanvas.getContext("2d");
    if (CURRENT_SCREEN) {
        CURRENT_SCREEN.render(gameCanvas, ctx);
    } else {
        console.log("Broken game state");
        TIMER.stop();
    }
}

main();
