import Character from './character.js';
import Beam from './beam.js';

class Enemy extends Character {
    constructor(x, y, width, height, speed, color) {
        super(x, y, width, height, speed, color);
        this.movementTimer = 0;
        this.movementInterval = 1000; // 1秒ごとに動きを変える
        this.dx = 0;
        this.dy = 0;
        this.lastPlayerPosition = { x: 0, y: 0 };
        this.shootTimer = 0;
        this.shootInterval = 1000; // 1秒ごとに発射
    }

    update(currentTime, player, canvasWidth, canvasHeight) {
        // ランダムな動き
        if (currentTime - this.movementTimer > this.movementInterval) {
            this.dx = Math.random() * 2 - 1; // -1から1の範囲
            this.dy = Math.random() * 2 - 1; // -1から1の範囲
            this.movementTimer = currentTime;
        }

        this.move(this.dx, this.dy);

        // 画面内に収める
        this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, canvasHeight - this.height));

        // プレイヤーの位置を記録
        this.lastPlayerPosition = { x: player.x, y: player.y };

        // 弾の発射
        if (currentTime - this.shootTimer > this.shootInterval) {
            this.shootTimer = currentTime;
            return this.shoot();
        }

        return null;
    }

    shoot() {
        const dx = this.lastPlayerPosition.x - this.x;
        const dy = this.lastPlayerPosition.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 5; // ビームの速度

        return new Beam(
            this.x + this.width / 2,
            this.y + this.height / 2,
            (dx / distance) * speed,
            (dy / distance) * speed,
            'reddd'
        );
    }
}

export default Enemy;