import enemyCharacter from './enemycharacter.js';
import Beam from './beam.js';

export default class Boss extends enemyCharacter {
    constructor(x, y, width, height, speed, color) {
        super(x, y, width, height, speed, color);
        this.maxHealth = 200; // ボスの体力を調整
        this.health = this.maxHealth;
        this.attackPhase = 0;
        this.lastAttackTime = 0;
        this.attackInterval = 2000;
        this.isActive = false;
        this.moveTimer = 0;
        this.moveInterval = 3000;
    }

    update(currentTime, player, canvasWidth, canvasHeight) {
        if (!this.isActive) return null;

        // 上下の動き
        this.moveTimer += 16; // およそ60FPSを想定
        const amplitude = 100;
        const frequency = 0.001;
        this.y = canvasHeight / 2 + Math.sin(this.moveTimer * frequency) * amplitude;

        // 攻撃処理
        if (currentTime - this.lastAttackTime > this.attackInterval) {
            this.lastAttackTime = currentTime;
            return this.attack();
        }

        return null;
    }

    attack() {
        const attacks = [];
        
        // 攻撃パターンに応じてビームを生成
        switch (this.attackPhase) {
            case 0: // 単発
                attacks.push(new Beam(this.x, this.y + this.height / 2, 7, 1, 'purple'));
                break;
            case 1: // 3方向
                for (let i = -1; i <= 1; i++) {
                    attacks.push(new Beam(this.x, this.y + this.height / 2 + (i * 20), 7, 1, 'purple'));
                }
                break;
            case 2: // 全方向
                for (let i = 0; i < 8; i++) {
                    attacks.push(new Beam(this.x, this.y + (i * this.height / 7), 7, 1, 'purple'));
                }
                break;
        }

        // 体力に応じて攻撃パターンを変更
        const healthPercent = this.health / this.maxHealth;
        if (healthPercent < 0.3) {
            this.attackPhase = 2;
        } else if (healthPercent < 0.6) {
            this.attackPhase = 1;
        }

        return attacks;
    }

    draw(ctx) {
        if (!this.isActive) return;

        // ボスの本体
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // 体力ゲージ
        const healthBarWidth = this.width * 2;
        const healthBarHeight = 10;
        const healthBarX = this.x - (healthBarWidth - this.width) / 2;
        const healthBarY = this.y - 20;

        // 体力ゲージ背景
        ctx.fillStyle = 'red';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

        // 現在の体力
        const currentHealthWidth = (this.health / this.maxHealth) * healthBarWidth;
        ctx.fillStyle = 'lime';
        ctx.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
    }
}