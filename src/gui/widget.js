export class Widget {

    constructor(x, y, width, height, clickCallback = null) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.clickCallback = clickCallback;
        if (this.clickCallback)
            this.clickCallback.bind(this);
        this.hovered = false;
    }

    render(gameCanvas, ctx, dt) {
    }

    onClick(event) {
        if (!this.clickCallback)
            return false;
        if (this.x <= event.clientX && event.clientX < this.x + this.width && this.y <= event.clientY && event.clientY < this.y + this.height)
            return this.clickCallback(event);
        return false;
    }

    setHovered(event) {
        this.hovered = this.x <= event.clientX && event.clientX < this.x + this.width && this.y <= event.clientY && event.clientY < this.y + this.height;
    }

    setHoveredDirect(hovered) {
        this.hovered = hovered;
    }

    isHovered() {
        return this.hovered;
    }

}
