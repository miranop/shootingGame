export default class DrawBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.numStars = 100;
        this.stars = this.initializeStars();
    }

    initializeStars() {
        const stars = [];
        for (let i = 0; i < this.numStars; i++) {
            stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 1.5 + 0.5,
                speed: Math.random() * 0.3 + 0.1
            });
        }
        return stars;
    }

    drawStars() {
        // 星を描画
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'white';
            this.ctx.fill();
            
            // 星を動かす
            star.x -= star.speed;
            
            // 画面外に出たら右端に戻す
            if (star.x < 0) {
                star.x = this.canvas.width;
                star.y = Math.random() * this.canvas.height;
            }
        });
    }

    // ウィンドウリサイズ時に星を再初期化
    resize() {
        this.stars = this.initializeStars();
    }
}