import enemyCharacter from './enemycharacter.js';
import Beam from './beam.js';

export default class Enemy extends enemyCharacter {
    constructor(x, y, width, height, speed, color) {
        super(x, y, width, height, speed, color);
        this.movementTimer = 0;
        this.movementInterval = 1000; // 1秒ごとに動きを変える
        this.dx = 0;
        this.dy = 0;
        this.lastPlayerPosition = { x: 0, y: 0 };
        this.shootTimer = 0;
        this.shootInterval = 2000; // 2秒ごとに発射判定
        this.shootChance = 0.5;    // 50%の確率で発射
    }

    update(currentTime, player, canvasWidth, canvasHeight) {
        // ランダムな動き
        if (currentTime - this.movementTimer > this.movementInterval) {
            this.dx = Math.random() * 2 - 1; // -1から1の範囲
            this.dy = Math.random() * 2 - 1; // -1から1の範囲
            this.movementTimer = currentTime;
        }

        // 移動処理
        this.move(this.dx, this.dy);
        
        // 画面内に収める
        this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, canvasHeight - this.height));
        
        // プレイヤーの位置を記録
        this.lastPlayerPosition = { x: player.x, y: player.y };

        // ビーム発射判定
        if (currentTime - this.shootTimer > this.shootInterval) {
            this.shootTimer = currentTime; // タイマーをリセット
            if (Math.random() < this.shootChance) {
                return this.createBeam();
            }
        }
        return null;
    }

    draw(ctx) {
        super.draw(ctx);
        // 体力ゲージの描画
        const healthBarWidth = this.width;
        const healthBarHeight = 4;
        const healthPercentage = this.health / 100;

        // 背景（赤）
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 8, healthBarWidth, healthBarHeight);

        // 現在の体力（緑）
        ctx.fillStyle = 'lime';
        ctx.fillRect(this.x, this.y - 8, healthBarWidth * healthPercentage, healthBarHeight);
    }

    createBeam() {
        return new Beam(
            this.x,
            this.y + this.height / 2,
            5,  // speed
            1,  // direction (左向き)
            'red' // 色
        );
    }

    calculateTargetAngle() {
        const dx = this.lastPlayerPosition.x - this.x;
        const dy = this.lastPlayerPosition.y - this.y;
        return Math.atan2(dy, dx);
    }
}