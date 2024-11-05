export default class Beam {
    constructor(x, y, speed, direction, color) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 5;
        this.speed = speed;
        this.direction = direction;
        this.color = color;
    }

    update() {
        this.x += this.direction === 0 ? this.speed : -this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // グロー効果
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    isOffScreen(canvasWidth, canvasHeight) {
        return this.x < 0 || this.x > canvasWidth ||
               this.y < 0 || this.y > canvasHeight;
    }
}
