import { Widget } from "./widget.js"; 
import * as Colors from "../colors.js";

export class Button extends Widget {

    constructor(text, x, y, width, height, clickCallback = null, textFont = "36px \"Verdana\"") {
        super(x, y, width, height, clickCallback);
        this.text = text;
        this.textFont = textFont;
    }

    render(gameCanvas, ctx) {
        ctx.fillStyle = this.isHovered() ? Colors.COFFEE_BROWN_HOVERED : Colors.COFFEE_BROWN;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 20);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = this.textFont;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }

}
