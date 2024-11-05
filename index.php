<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Space Shooter - Start</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: #000;
            color: #fff;
            font-family: 'Arial', sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
            overflow: hidden;
            position: relative;
        }

        body::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background-image:
                radial-gradient(white 1px, transparent 1px),
                radial-gradient(white 1px, transparent 1px);
            background-size: 50px 50px;
            background-position: 0 0, 25px 25px;
            animation: stars 20s linear infinite;
            opacity: 0.3;
        }

        @keyframes stars {
            from {
                transform: translateY(0);
            }

            to {
                transform: translateY(100%);
            }
        }

        .container {
            position: relative;
            z-index: 1;
            text-align: center;
        }

        h1 {
            font-size: 3.5em;
            text-align: center;
            margin-bottom: 50px;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: transparent;
            background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff);
            -webkit-background-clip: text;
            background-clip: text;
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        @keyframes gradient {
            0% {
                background-position: 0% 50%;
            }

            50% {
                background-position: 100% 50%;
            }

            100% {
                background-position: 0% 50%;
            }
        }

        .controls {
            margin-bottom: 30px;
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
        }

        .controls h2 {
            margin-bottom: 10px;
            color: #ff7f00;
        }

        .controls p {
            margin: 5px 0;
        }

        button {
            padding: 15px 40px;
            font-size: 1.5em;
            text-transform: uppercase;
            letter-spacing: 2.5px;
            color: #000;
            background-color: #fff;
            border: none;
            border-radius: 45px;
            box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            animation: shine 3s infinite;
        }

        @keyframes shine {
            100% {
                left: 100%;
            }
        }

        button:hover {
            background-color: #ff0000;
            box-shadow: 0px 15px 20px rgba(255, 0, 0, 0.4);
            color: #fff;
            transform: translateY(-7px);
        }

        button:active {
            transform: translateY(-1px);
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 2.5em;
            }

            button {
                font-size: 1.2em;
            }

            .controls {
                padding: 15px;
            }
        }

        @media (max-width: 480px) {
            h1 {
                font-size: 2em;
            }

            button {
                font-size: 1em;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Space Shooter</h1>
        <div class="controls">
            <h2>操作方法</h2>
            <p>移動: 矢印キー</p>
            <p>攻撃: スペースキー</p>
            <p>一時停止: ESC</p>
        </div>
        <a href="game.php">
            <button type="button">START</button>
        </a>
    </div>
</body>

</html>