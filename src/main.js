import { Timer } from "./timer.js";
import { LoadingScreen } from "./screens/loading_screen.js";
import * as Assets from "./asset_index.js";

const TIMER = new Timer(60, mainloop);

let CURRENT_SCREEN = null;
let CURRENT_GAME_STATE = null;

class StateSetter {
    setScreen(screen) {
        CURRENT_SCREEN = screen;
    }

    setGameState(gameState) {
        CURRENT_GAME_STATE = gameState;
    }

    getGameState() {
        return CURRENT_GAME_STATE;
    }
}

const STATE_SETTER = new StateSetter();

function main() {
    const gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.addEventListener("click", event => {
        if (CURRENT_SCREEN)
            CURRENT_SCREEN.onClick(event);
    });
    gameCanvas.addEventListener("mousemove", event => {
        if (CURRENT_SCREEN)
            CURRENT_SCREEN.setHovered(event);
    });
    document.addEventListener("keydown", event => {
        if (CURRENT_SCREEN)
            CURRENT_SCREEN.onKeyDown(event);
    })
    document.addEventListener("keyup", event => {
        if (CURRENT_SCREEN)
            CURRENT_SCREEN.onKeyUp(event);
    })
    STATE_SETTER.setScreen(new LoadingScreen(STATE_SETTER));
    TIMER.start();
}

function mainloop(dt) {
    if (CURRENT_GAME_STATE)
        CURRENT_GAME_STATE.tick(dt);
    const gameCanvas = document.getElementById("gameCanvas");
    const ctx = gameCanvas.getContext("2d");
    if (CURRENT_SCREEN) {
        CURRENT_SCREEN.render(gameCanvas, ctx, dt);
    } else {
        console.log("No screen visible, stopping");
        TIMER.stop();
    }
}

main();
