// Logic/keyboard.js
export default class KeyHandler {
    constructor() {
        this.keys = {
            // 矢印キー
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            // WASDキー
            KeyW: false,
            KeyS: false,
            KeyA: false,
            KeyD: false,
            // スペースキー
            Space: false
        };

        window.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.code)) {
                this.keys[e.code] = true;
                e.preventDefault(); // キー入力によるスクロールを防止
            }
        });

        window.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.code)) {
                this.keys[e.code] = false;
            }
        });
    }

    getMovement() {
        const dx = (this.keys.ArrowRight || this.keys.KeyD ? 1 : 0) - 
                  (this.keys.ArrowLeft || this.keys.KeyA ? 1 : 0);
        const dy = (this.keys.ArrowDown || this.keys.KeyS ? 1 : 0) - 
                  (this.keys.ArrowUp || this.keys.KeyW ? 1 : 0);
        
        // 斜め移動の速度を正規化
        if (dx !== 0 && dy !== 0) {
            const normalizer = 1 / Math.sqrt(2);
            return { x: dx * normalizer, y: dy * normalizer };
        }
        
        return { x: dx, y: dy };
    }

    isFireKeyPressed() {
        return this.keys.Space;
    }
}