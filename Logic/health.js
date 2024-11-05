// HealthSystem.js
export default class HealthSystem {
    constructor(maxHealth) {
        this.maxHealth = 3;
        this.currentHealth = 3;
        this.lives = 1;
        this.isInvulnerable = false;
        this.invulnerabilityDuration = 2000;
        this.lastHitTime = 0;
    }

    takeDamage(damage, currentTime) {
        if (this.isInvulnerable) {
            return false;
        }

        this.currentHealth -= 1;
        this.isInvulnerable = true;
        this.lastHitTime = currentTime;

        setTimeout(() => {
            this.isInvulnerable = false;
        }, this.invulnerabilityDuration);

        if (this.currentHealth <= 0) {
            this.lives--;
            if (this.lives >= 0) {
                this.currentHealth = this.maxHealth;
            }
        }

        return true;
    }

    heal(amount) {
        this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
    }

    draw(ctx) {
        const padding = 10;
        const heartSize = 20;
        const heartSpacing = 30;
        const yPosition = 10;

        // ハートでライフを表示
        for (let i = 0; i < this.maxHealth; i++) {
            if (i < this.currentHealth) {
                drawHeart(ctx, padding + (i * heartSpacing), yPosition, heartSize, 'red');
            } else {
                drawHeart(ctx, padding + (i * heartSpacing), yPosition, heartSize, 'gray');
            }
        }

        // 無敵時間中は点滅効果
        if (this.isInvulnerable) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(padding, yPosition, heartSize * this.maxHealth, heartSize);
        }
    }

    isGameOver() {
        return this.lives < 0 || this.currentHealth <= 0;
    }
}

function drawHeart(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + size/2, y + size/5);
    const topCurveHeight = size * 0.3;
    ctx.bezierCurveTo(
        x + size/2, y, 
        x, y, 
        x, y + topCurveHeight
    );
    ctx.bezierCurveTo(
        x, y + (size + topCurveHeight)/2,
        x + size/2, y + size,
        x + size/2, y + size
    );
    ctx.bezierCurveTo(
        x + size/2, y + size,
        x + size, y + (size + topCurveHeight)/2,
        x + size, y + topCurveHeight
    );
    ctx.bezierCurveTo(
        x + size, y,
        x + size/2, y,
        x + size/2, y + topCurveHeight
    );
    ctx.fill();
}