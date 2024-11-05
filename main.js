// main.js
import KeyHandler from './Logic/keyboard.js';
import Character from './Logic/character.js';
import Enemy from './Logic/enemy.js';
import Beam from './Logic/beam.js';
import DrawBackground from './Logic/background.js';
import Boss from './Logic/boss.js';
import HealthSystem from './Logic/health.js';

// Canvas設定
const canvas = document.getElementById('can');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// パワーアップアイテムクラス
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type; // 'health' or 'speed'
        this.speed = 2;
        this.collected = false;
    }

    update() {
        this.x -= this.speed;
        return this.x > -this.width;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, 10, 0, Math.PI * 2);
        
        // タイプに応じて色を変更
        if (this.type === 'health') {
            ctx.fillStyle = '#00FF00'; // 緑
            ctx.strokeStyle = '#008800';
        } else {
            ctx.fillStyle = '#FFFF00'; // 黄
            ctx.strokeStyle = '#888800';
        }
        
        ctx.fill();
        ctx.stroke();

        // 回復アイテムの場合は+マークを描画
        if (this.type === 'health') {
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.moveTo(this.x + this.width/2, this.y + 5);
            ctx.lineTo(this.x + this.width/2, this.y + this.height - 5);
            ctx.moveTo(this.x + 5, this.y + this.height/2);
            ctx.lineTo(this.x + this.width - 5, this.y + this.height/2);
            ctx.stroke();
        }
    }
}

// ゲームの状態
let gameState = {
    isRunning: true,
    isPaused: false,
    score: 0,
    bossSpawned: false,
    gameOver: false
};

// ゲームオブジェクトの初期化
const background = new DrawBackground(canvas);
const keyHandler = new KeyHandler();
const player = new Character(50, canvas.height / 2, 30, 30, 5, 'blue');
const playerHealth = new HealthSystem(3);
const boss = new Boss(canvas.width - 100, canvas.height / 2, 60, 60, 3, 'purple');

// ゲーム内オブジェクト配列
let enemies = [];
let playerBeams = [];
let enemyBeams = [];
let powerUps = [];

// タイミング制御
let lastFireTime = 0;
let lastEnemySpawnTime = 0;
const fireInterval = 200;
const enemyInterval = 2000;
const maxenemies = 5;

// ビクトリー画面用タイマー
let victoryTimer = null;

function gameLoop(currentTime) {
    try {
        if (gameState.isPaused) {
            if (victoryTimer) {
                showVictoryScreen();
            }
            requestAnimationFrame(gameLoop);
            return;
        }

        // 背景クリアと描画
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        background.drawStars();

        // プレイヤーの更新と描画
        const movement = keyHandler.getMovement();
        player.move(movement.x, movement.y);
        player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
        player.y = Math.max(0, Math.min(player.y, canvas.height - player.height));
        player.update(currentTime); // スピードブーストの更新
        player.draw(ctx);

        // パワーアップアイテムの生成
        if (Math.random() < 0.002) { // 0.2%の確率でアイテム生成
            const type = Math.random() < 0.5 ? 'health' : 'speed';
            const y = Math.random() * (canvas.height - 20);
            powerUps.push(new PowerUp(canvas.width, y, type));
        }

        // パワーアップの更新と描画
        powerUps = powerUps.filter(powerUp => {
            powerUp.draw(ctx);
            return powerUp.update();
        });

        // ボスの出現条件をチェック
        if (!gameState.bossSpawned && gameState.score >= 1000) {
            console.log("Boss spawning...");
            gameState.bossSpawned = true;
            boss.isActive = true;
            enemies = [];
        }

        // 敵の生成（ボス出現前のみ）
        if (!gameState.bossSpawned && currentTime - lastEnemySpawnTime > enemyInterval && enemies.length < maxenemies) {
            spawnEnemy();
            lastEnemySpawnTime = currentTime;
        }

        // 敵の更新と描画
        enemies = enemies.filter(enemy => {
            const enemyBeam = enemy.update(currentTime, player, canvas.width, canvas.height);
            if (enemyBeam) {
                enemyBeams.push(enemyBeam);
            }
            enemy.draw(ctx);
            return enemy.x > -enemy.width;
        });

        // ボスの更新と描画
        if (boss.isActive) {
            const bossAttack = boss.update(currentTime, player, canvas.width, canvas.height);
            if (Array.isArray(bossAttack)) {
                enemyBeams.push(...bossAttack);
            } else if (bossAttack) {
                enemyBeams.push(bossAttack);
            }
            boss.draw(ctx);
        }

        // プレイヤーのビーム発射
        if (keyHandler.isFireKeyPressed() && currentTime - lastFireTime > fireInterval) {
            const newBeam = new Beam(
                player.x + player.width,
                player.y + player.height / 2,
                10,
                0,
                'orange'
            );
            playerBeams.push(newBeam);
            lastFireTime = currentTime;
        }

        // ビームの更新と描画
        updateAndDrawBeams(playerBeams, ctx, canvas.width, canvas.height);
        updateAndDrawBeams(enemyBeams, ctx, canvas.width, canvas.height);

        // 衝突判定
        checkCollisions(currentTime);

        // UI の描画
        drawUI();

        // ゲームオーバー判定
        if (playerHealth.isGameOver()) {
            gameState.gameOver = true;
            drawGameOverScreen();
            return;
        }

        requestAnimationFrame(gameLoop);
    } catch (error) {
        console.error("Error in game loop:", error);
    }
}

function checkCollisions(currentTime) {
    // パワーアップアイテムとプレイヤーの衝突判定
    for (let i = powerUps.length - 1; i >= 0; i--) {
        if (isColliding(powerUps[i], player)) {
            if (powerUps[i].type === 'health') {
                playerHealth.heal(1);
            } else {
                player.activateSpeedBoost(currentTime);
            }
            powerUps.splice(i, 1);
        }
    }

    // プレイヤーのビームと敵の当たり判定
    for (let i = playerBeams.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (isColliding(playerBeams[i], enemies[j])) {
                playerBeams.splice(i, 1);
                enemies.splice(j, 1);
                gameState.score += 100;
                break;
            }
        }
    }

    // 敵のビームとプレイヤーの当たり判定
    for (let i = enemyBeams.length - 1; i >= 0; i--) {
        if (isColliding(enemyBeams[i], player)) {
            if (playerHealth.takeDamage(10, currentTime)) {
                enemyBeams.splice(i, 1);
            }
        }
    }

    // ボスとプレイヤーのビームの衝突判定
    if (boss.isActive) {
        for (let i = playerBeams.length - 1; i >= 0; i--) {
            if (isColliding(playerBeams[i], boss)) {
                playerBeams.splice(i, 1);
                if (boss.takeDamage(10)) {
                    boss.isActive = false;
                    gameState.score += 5000;
                    showVictoryScreen();
                }
            }
        }
    }
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function updateAndDrawBeams(beams, ctx, canvasWidth, canvasHeight) {
    for (let i = beams.length - 1; i >= 0; i--) {
        beams[i].update();
        beams[i].draw(ctx);
        if (beams[i].isOffScreen(canvasWidth, canvasHeight)) {
            beams.splice(i, 1);
        }
    }
}

function spawnEnemy() {
    const x = canvas.width;
    const y = Math.random() * (canvas.height - 30);
    const speed = Math.random() * 2 + 1;
    enemies.push(new Enemy(x, y, 30, 30, speed, 'red'));
}

function drawUI() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 10, 60);
    playerHealth.draw(ctx);
}

function drawGameOverScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Final Score: ${gameState.score}`, canvas.width/2, canvas.height/2 + 40);

    setTimeout(() => {
        window.location.href = 'index.php';
    }, 3000);
}

function showVictoryScreen() {
    gameState.isPaused = true;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'gold';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('VICTORY!', canvas.width/2, canvas.height/2);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Final Score: ${gameState.score}`, canvas.width/2, canvas.height/2 + 40);

    if (!victoryTimer) {
        victoryTimer = setTimeout(() => {
            window.location.href = 'index.php';
        }, 5000);
    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ゲーム開始
console.log("Starting game loop");
gameLoop();