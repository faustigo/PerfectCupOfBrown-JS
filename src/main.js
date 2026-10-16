import { Timer } from "./timer.js";
import * as Assets from "./asset_index.js";
import { LoadingScreen } from "./screens/loading_screen.js";

const TIMER = new Timer(60, mainloop);

let CURRENT_SCREEN = null;

function setScreen(screen) {
    CURRENT_SCREEN = screen;
}

function main() {
    setScreen(new LoadingScreen(setScreen))
    TIMER.start();
}

function mainloop() {
    if (CURRENT_SCREEN) {
        CURRENT_SCREEN.render();
    } else {
        console.log("Broken game state");
        TIMER.stop();
    }
}

main();
