var canvas = document.getElementById('game-area');
var context = canvas.getContext('2d');
var scoreView = document.getElementById('score')
var gameOn = true;
var player = {
    x: 50,
    y: 50,
    radius: 15 
};
var food = {
    x: 0,
    y: 0,
    width: 30,
    height: 30
};
var balls = [];
var score = 0;
var keys = {
    down: false,
    up: false,
    left: false,
    right: false
};

function setGame(){
    score = 0;
    balls = [];
    gameOn = true;
    addBall();
    setFood();
    scoreView.innerHTML = "Score: " + score;
}

function setFood(){
    food.x = Math.floor(Math.random() * (500 - 2*food.width)) + food.width;
    food.y = Math.floor(Math.random() * (375 - 2*food.height)) + food.height;
}

function addBall(){
    var ball = {
        isVertical: Math.floor(Math.random()*2) === 1,
        direction: Math.floor(Math.random()*2) === 1,
        radius: 10,
        x: (Math.floor(Math.random() * (500 - 2*10)) + 10),
        y: (Math.floor(Math.random() * (375 - 2*10)) + 10)
    }
    balls.push(ball);
}

function drawPlayer() {
    context.beginPath();
    context.arc(player.x, player.y, player.radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'black';
    context.fill();
    context.closePath();
}

function drawBalls() {
    for (ball of balls) {
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'blue';
        context.fill();
        context.strokeStyle = 'black';
        context.stroke();
        context.closePath();
    }
}

function drawFood() {
    context.beginPath();
    context.rect(food.x, food.y, 30, 30);
    context.fillStyle = 'gray';
    context.fill();
    context.strokeStyle = 'black';
    context.stroke();
    context.closePath();
}

function movePlayer() {
    if (keys.down) {
        if ((player.y + 15) + 2 < canvas.height) {
             player.y += 2;
        }  
    }
    if (keys.up) {
        if ((player.y - 15) - 2 > 0) {
             player.y -= 2;
        }  
    }
    if (keys.left) {
        if ((player.x - 15) - 2 > 0) {
             player.x -= 2;
        }  
    }
    if (keys.right) {
        if ((player.x + 15) + 2 < canvas.width) {
             player.x += 2;
        }  
    }
}

function moveBalls(){
    for(var x = 0; x < balls.length; x++){
        var ball = balls[x];
        if (ball.isVertical){
            if (ball.y + ball.radius + 2 > canvas.height){
                ball.direction = false;
            } else if (ball.y - ball.radius - 2 < 0) {
                ball.direction = true;
            }
            
            if( ball.direction ) {
                ball.y += 2;
            } else {
                ball.y -= 2;
            }
        } else if (!ball.isVertical) {
            if (ball.x + ball.radius + 2 > canvas.width){
                ball.direction = false;
            } else if (ball.x - ball. radius - 2 < 0) {
                ball.direction = true;
            }
            
            if( ball.direction ) {
                ball.x += 2;
            } else {
                ball.x -= 2;
            }
        }
    }
}

function checkFoodCollision() {
    var dx = Math.abs(player.x - (food.x + food.width/2));
    var dy = Math.abs(player.y - (food.y + food.height/2));
    
    if (dx < (food.width/2) + player.radius && dy < (food.height/2) + player.radius){
        setFood();
        score += 10;
        scoreView.innerHTML = "Score: " + score;
        addBall();
    }
}

function checkBallsCollision() {
    for (ball of balls){
        var dx = Math.abs(player.x - ball.x);
        var dy = Math.abs(player.y - ball.y);
        
        if (dx < 2*ball.radius && dy < 2*ball.radius){
            gameOn = false;
        }
    }
}

function endGame(){
    context.fillStyle= 'black';
    context.font = "30px Times New Roman";
    context.fillText("Game Over: press enter to play", 80, 175);
}

function draw() {
    if (gameOn){
        context.clearRect(0, 0, canvas.width, canvas.height);
        movePlayer();
        moveBalls();
        checkFoodCollision();
        checkBallsCollision();
        drawFood();
        drawPlayer();
        drawBalls();
    } else {
        endGame();
    }
}

function handleKeyDown(e) {
    if (e.type === "keydown") {
        if (e.keyCode === 38) {
            keys.up = true;
        } 
    
        if (e.keyCode === 40) {
            keys.down = true;
        } 
    
        if (e.keyCode === 37) {
            keys.left = true;
        } 
    
        if (e.keyCode === 39) {
            keys.right = true; 
        }
        
        if (e.keyCode === 13 && !gameOn){
            setGame();
        }
    } else if (e.type === 'keyup') {
        if (e.keyCode === 38) {
            keys.up = false;
        } 
    
        if (e.keyCode === 40) {
            keys.down = false;
        } 
    
        if (e.keyCode === 37) {
            keys.left = false;
        } 
    
        if (e.keyCode === 39) {
            keys.right = false; 
        }
    }
}

setGame();
window.addEventListener('keydown', handleKeyDown, true);
window.addEventListener('keyup', handleKeyDown, true);
setInterval(draw, 10);