export class Widget {

    hovered = false;

    constructor(x, y, width, height, clickCallback = null, active = true) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.clickCallback = clickCallback;
        if (this.clickCallback)
            this.clickCallback.bind(this);
        this.active = active;
    }

    render(gameCanvas, ctx, dt) {
    }

    onClick(event) {
        if (!this.clickCallback || !this.active)
            return false;
        if (this.x <= event.clientX && event.clientX < this.x + this.width && this.y <= event.clientY && event.clientY < this.y + this.height)
            return this.clickCallback(event);
        return false;
    }

    setHovered(event) {
        if (this.active)
            this.hovered = this.x <= event.clientX && event.clientX < this.x + this.width && this.y <= event.clientY && event.clientY < this.y + this.height;
    }

    setHoveredDirect(hovered) {
        this.hovered = hovered && this.active;
    }

    isHovered() {
        return this.hovered && this.active;
    }

    setActive(active) {
        this.active = active;
        if (!this.active)
            this.hovered = false;
    }
    
    isActive() {
        return this.active;
    }

}
