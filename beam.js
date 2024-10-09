class Beam {
    constructor(x, y, dx, dy, color = 'red', width = 10, height = 5) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    isOffScreen(canvasWidth, canvasHeight) {
        return this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight;
    }
}

export default Beam;