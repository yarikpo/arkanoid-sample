const canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

// creates a ball in the middle of the screen
var ballX = canvas.height - 40;
var ballY = canvas.width / 2;
// radius of the ball
const ballRadius = 10;
// speed of the ball
var ballXD = 2;
var ballYD = -2;
// size of paddle
const paddleHeight = 10;
const paddleWidth = 80;
// pressed buttons
var rightPressed = false;
var leftPressed = false;
// paddle position
var paddleX = canvas.width / 2 - paddleWidth / 2;
var paddleY = canvas.height - paddleHeight;
// paddle speed
const paddleD = 7;
// brick size
const brickColumnSize = 10;
const brickRowSize = 11;
const brickWidth = 60;
const brickHeight = 20;
// paddings
const brickPaddingRight = 10;
const brickPaddingBottom = 5;
const leftOffset = 20;
const topOffset = 30;
// colors
const color = ['pink', '#44dd44', '#ffff44', '#dc143c'];
// score
var score = 0;
// lives
const sLives = 4;
var lives = sLives;
// result
var results = [ { name: 'none', points: 0 }, { name: 'none', points: 0 }];

// creates bricks
var bricks = [];

function createBricks() {
    for (let i = 0; i < brickColumnSize; i++) {
        bricks[i] = [];
        for (let j = 0; j < brickRowSize; j++) {
            var min = 1; 
            var max = 4;          
            let live = Math.floor(Math.random() * (max - min)) + min;
            // console.log(live);

            let brickX = leftOffset + (brickWidth + brickPaddingRight) * j;
            let brickY = topOffset + (brickHeight + brickPaddingBottom) * i;
            bricks[i][j] = { x: brickX, y: brickY, lives: live, state: 1, value: live };
        }
    }
}
createBricks();


// adds result to results
function addResult() {
    function compare(a, b) {
        const ca = a.points;
        const cb = b.points;

        if (ca < cb) {
            return 1;
        } else {
            return -1;
        }
    }
    results.sort(compare);
    document.getElementById('p1').innerHTML = results[0].name + ' got ' + results[0].points;
    document.getElementById('p2').innerHTML = results[1].name + ' got ' + results[1].points
    document.getElementById('p3').innerHTML = results[2].name + ' got ' + results[2].points
    // document.getElementById('p2').innerHTML = results[1];

}

// draw lives
function drawLives() {
    ctx.beginPath();
    ctx.font = '16px Helvetica';
    ctx.fillStyle = 'efefef';
    ctx.fillText('Lives: ' + lives, canvas.width - 70, canvas.height - 20);
    ctx.closePath();
}

// draws score
function drawScore() {
    ctx.beginPath();
    ctx.font = '16px Helvetica';
    ctx.fillStyle = '#efefef';
    ctx.fillText('Score: ' + score, 10, canvas.height - 20);
    ctx.closePath();
}

// draws bricks
function drawBricks() {
    for (let i = 0; i < brickColumnSize; i++) {
        for (let j = 0; j < brickRowSize; j++) {
            let brickX = leftOffset + (brickWidth + brickPaddingRight) * j;
            let brickY = topOffset + (brickHeight + brickPaddingBottom) * i;

            if (bricks[i][j].state == 1) {
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = color[bricks[i][j].lives];
                ctx.strokeStyle = '#aaa';
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// brick collision
function brickCollision() {
    for (let i = 0; i < brickColumnSize; i++) {
        for (let j = 0; j < brickRowSize; j++) {
            let brick = bricks[i][j];
            // console.log(brick);
            if (brick.state == 1) {
                if (ballX > brick.x - ballRadius && ballX < brick.x + brickWidth + ballRadius && ballY > brick.y - ballRadius && ballY < brick.y + brickHeight + ballRadius) {
                // if (Math.abs(ballX - brick.x) <= ballRadius && Math.abs(ballX - brick.x - brickWidth) <= ballRadius && Math.abs(ballY - brick.y) <= ballRadius && Math.abs(ballY - brick.y - brickHeight) <= ballRadius) {
                    console.log('collision');
                    ballYD = -ballYD;
                    bricks[i][j].lives--;
                    if (bricks[i][j].lives < 1) {
                        brick.state = 0;
                        bricks[i][j].state = 0;
                        score+= bricks[i][j].value;
                    }
                }
            }
        }
    }
}

// draws ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ccc';
    ctx.fill();
    ctx.closePath();
}

// draws paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = '#efefef';
    ctx.fill();
    ctx.closePath();
}

// draws everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    brickCollision();
    drawScore();
    drawLives();
    // addResult();

    // walls collision
    if (ballX + ballXD + ballRadius > canvas.width || ballX + ballXD - ballRadius < 0) {
        ballXD = -ballXD;
    }
    if (ballY + ballYD + ballRadius > canvas.height || ballY + ballYD - ballRadius < 0) {
        ballYD = -ballYD;
    } else if (ballY + ballYD + ballRadius >= canvas.height && (ballX < paddleX || ballX > paddleX + paddleWidth)) {
        lives--;
        if (lives < 1) {
            let result = prompt('Game OVER! Your score: ' + score + '...\nEnter your name: ', 'nickname');
            // document.location.reload();
            results.push({ name: result, points: score });
            lives = sLives;
            score = 0;
            addResult();
            createBricks();
        }
        ballY = canvas.height - 40;
        ballX = canvas.width / 2;
        ballXD = 2;
        ballYD = -2;
        paddleX = canvas.width / 2 - paddleWidth / 2;

        
    }
    // paddle movements
    if (rightPressed && paddleX + paddleWidth < canvas.width) {
        paddleX+= paddleD;
    }
    if (leftPressed && paddleX > 0) {
        paddleX-= paddleD;
    }

    // ball movements
    ballX+= ballXD;
    ballY+= ballYD;
}

setInterval(draw, 10);

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    if (e.keyCode == 37) {
        leftPressed = false;
    }
}