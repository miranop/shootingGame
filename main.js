import KeyHandler from './keyboard.js';
import Character from './character.js';
import Enemy from './enemy.js';
import Beam from './beam.js';

const canvas = document.getElementById('can');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const keyHandler = new KeyHandler();
const player = new Character(50, canvas.height / 2, 30, 30, 5, 'blue');
let enemies = [];
let playerBeams = [];
let enemyBeams = [];

let lastFireTime = 0;
const fireInterval = 200;

let lastEnemySpawnTime = 0;
const enemyInterval = 2000;//2秒ごとに更新
const maxenemies = 5;//敵の数の上限

function gameLoop(currentTime) {
    try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // プレイヤーの更新と描画
        const movement = keyHandler.getMovement();
        player.move(movement.x, movement.y);
        player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
        player.y = Math.max(0, Math.min(player.y, canvas.height - player.height));
        player.draw(ctx);

           //敵の生成
        if (currentTime - lastEnemySpawnTime > enemyInterval && enemies.length < maxenemies) {
            spawnEnemy();
            lastEnemySpawnTime = currentTime;
        }

        //敵の更新と描画
        enemies = enemies.filter(enemy =>{
            const enemyBeam = enemy.update(currentTime,player,canvas.width,canvas.height);
            if(enemyBeam){
                enemyBeams.push(enemyBeam);
            }
            enemy.draw(ctx);
            return enemy.x > -enemy.width;
        })
        // プレイヤーのビーム発射
        if (keyHandler.isFireKeyPressed() && currentTime - lastFireTime > fireInterval) {
            const newBeam = new Beam(player.x + player.width, player.y + player.height / 2, 10, 0, 'blue');
            playerBeams.push(newBeam);
            lastFireTime = currentTime;
        }

        // ビームの更新と描画
        updateAndDrawBeams(playerBeams, ctx, canvas.width, canvas.height);
        updateAndDrawBeams(enemyBeams, ctx, canvas.width, canvas.height);

        // 衝突判定
        checkCollisions();

        requestAnimationFrame(gameLoop);
    } catch (error) {
        console.error("Error in game loop:", error);
    }
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

function checkCollisions() {
    // プレイヤーのビームと敵の当たり判定
    for (let i = playerBeams.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (isColliding(playerBeams[i], enemies[j])) {
                playerBeams.splice(i, 1);
                enemies.splice(j, 1);
                console.log("Enemy hit!");
                break;
            }
        }
    }

    // 敵のビームとプレイヤーの当たり判定
    for (let i = enemyBeams.length - 1; i >= 0; i--) {
        if (isColliding(enemyBeams[i], player)) {
            enemyBeams.splice(i, 1);
            console.log("Player hit!");
            // ここでプレイヤーのライフを減らすなどの処理を追加
        }
    }
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function spawnEnemy(){
    const x = canvas.width
    const y = Math.random() * (canvas.height - 30);
    const speed = Math.random() * 2 + 1; // 1-3のランダムな速度
    enemies.push(new Enemy(x,y,30,30,speed,'red'));
}

console.log("Starting game loop");
gameLoop();

// ウィンドウサイズが変更されたときにキャンバスサイズを調整
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});