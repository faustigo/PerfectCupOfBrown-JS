import { BaseScreen } from "./screen.js";
import * as Assets from "../asset_index.js";
import { TitleScreen } from "./title_screen.js";

export class LoadingScreen extends BaseScreen {

    constructor(screenSetter) {
        super(screenSetter);
    }

    render() {
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
            this.screenSetter(new TitleScreen(this.screenSetter));
    }

}
