class KeyHandler {
    constructor() {
        this.keys = {};
        this.movementX = 0;
        this.movementY = 0;
        this.isFiring = false;
        window.addEventListener('keydown', this.keyDown.bind(this));
        window.addEventListener('keyup', this.keyUp.bind(this));
    }

    keyDown(e) {
        this.keys[e.code] = true;
        this.updateMovement();
        if (e.code === 'Space') {
            this.isFiring = true;
        }
    }

    keyUp(e) {
        this.keys[e.code] = false;
        this.updateMovement();
        if (e.code === 'Space') {
            this.isFiring = false;
        }
    }

    updateMovement() {
        this.movementX = 0;
        this.movementY = 0;
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) this.movementX -= 1;
        if (this.keys['ArrowRight'] || this.keys['KeyD']) this.movementX += 1;
        if (this.keys['ArrowUp'] || this.keys['KeyW']) this.movementY -= 1;
        if (this.keys['ArrowDown'] || this.keys['KeyS']) this.movementY += 1;
    }

    getMovement() {
        return { x: this.movementX, y: this.movementY };
    }

    isFireKeyPressed() {
        return this.isFiring;
    }
}

export default KeyHandler;