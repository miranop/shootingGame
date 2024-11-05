// Character.js
export default class Character {
    constructor(x, y, width, height, speed, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.baseSpeed = speed;
        this.currentSpeed = speed;
        this.color = color;
        this.speedBoostActive = false;
        this.speedBoostEndTime = 0;
        this.speedBoostDuration = 5000; // 5秒間
    }

    move(dx, dy) {
        if (dx !== 0 || dy !== 0) {
            // 斜め移動時の速度調整
            const normalizedSpeed = dx !== 0 && dy !== 0 ? 
                this.currentSpeed / Math.sqrt(2) : this.currentSpeed;
            
            this.x += dx * normalizedSpeed;
            this.y += dy * normalizedSpeed;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // スピードブースト中のエフェクト
        if (this.speedBoostActive) {
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        }
    }

    activateSpeedBoost(currentTime) {
        this.speedBoostActive = true;
        this.speedBoostEndTime = currentTime + this.speedBoostDuration;
        this.currentSpeed = this.baseSpeed * 1.5; // 1.5倍速
    }

    update(currentTime) {
        if (this.speedBoostActive && currentTime >= this.speedBoostEndTime) {
            this.speedBoostActive = false;
            this.currentSpeed = this.baseSpeed;
        }
    }
}

