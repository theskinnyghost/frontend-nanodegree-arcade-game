/** Set-up game constants */
var CANVAS_WIDTH = 707,
    CANVAS_HEIGHT = 606,
    COLUMN_WIDTH = 101,
    ROW_HEIGHT = 83,
    ADJUST_Y = 20,
    LIMIT_TOP = 0,
    LIMIT_RIGHT = 606,
    LIMIT_BOTTOM = 404,
    LIMIT_LEFT = 0;

/**
 * Game class constructor
 */
var Game = function(){
    this.state = true;
    this.gameOver = false;
    this.level = 1;

    this.enemies = [];
    this.setEnemies();
    this.player = new Player(303, 404);

    this.renderGameInfo();
};

Game.prototype.setEnemies = function() {
    for(var i = 1; i < 4; i++){
        this.enemies.push(new Enemy(0 - (i * COLUMN_WIDTH), i * ROW_HEIGHT));
    }
    for(var i = 1; i < 4; i++){
        this.enemies.push(new Enemy(0 - (i * COLUMN_WIDTH), i * ROW_HEIGHT));
    }
    for(var i = 1; i < 4; i++){
        this.enemies.push(new Enemy(0 - (i * COLUMN_WIDTH), i * ROW_HEIGHT));
    }
};

Game.prototype.renderGameInfo = function() {
    var playerLives = document.getElementById('playerLives'),
        gameLevel   = document.getElementById('gameLevel');

    playerLives.innerHTML = this.player.lives;
    gameLevel.innerHTML = this.level;
};

// Handle key input and move player accordingly
// check if player has reached one of canvas' side
// if so, stop moving it
Game.prototype.handleInput = function(key) {
    switch(key) {
        case 'up':
            if(player.y < ROW_HEIGHT && this.state){
                player.reset();
                this.changeLevel();
            } else if(player.y > LIMIT_TOP && this.state){
                player.y -= ROW_HEIGHT;
            }
            break;

        case 'down':
            if(player.y < LIMIT_BOTTOM && this.state)
                player.y += ROW_HEIGHT;
            break;

        case 'left':
            if(player.x > LIMIT_LEFT && this.state)
                player.x -= COLUMN_WIDTH;
            break;

        case 'right':
            if(player.x < LIMIT_RIGHT && this.state)
                player.x += COLUMN_WIDTH;
            break;
        case 'pause':
            if(!this.gameOver)
                this.toggleState();
            break;
    }
};

Game.prototype.toggleState = function() {
    this.state = !this.state;
};

Game.prototype.changeLevel = function(){
    if(this.level == 4){
        // Reach end of game
        this.end();
    } else {
        // else level up
        this.level++;
        this.renderGameInfo();
    }
};

Game.prototype.end = function() {
    var body = document.getElementsByTagName('body');

    if( (player.lives == 0 && game.level == 4) || player.lives > 1 ) {
        this.state = false;
        this.gameOver = true;

        body[0].innerHTML = "<h1>Congratulations, you made it!</h1>" +
            "<p>You've finished the game, you should be happy. " +
            "If you want to play again simply refresh the page.</p>";
    } else {
        this.state = false;
        this.gameOver = true;

        body[0].innerHTML = "<h1>Game over</h1>" +
            "<p>Oh no, if you want to play again simply refresh the page.</p>";
    }
};

/**
 * Character Superclass Constructor
 * Set character image, initial position and speed
 */
var Character = function(sprite, x, y){
    this.sprite = sprite;
    this.initialX = x;
    this.initialY = y;
    this.x = x;
    this.y = y;
};

/**
 * Draw the character on the screen, required method for game
 */
Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/**
 * Reset character to its initial position
 */
Character.prototype.reset = function() {
    this.x = this.initialX;
    this.y = this.initialY;
}

/**
 * Enemy Subclass
 * It is used to instantiate our enemies
 */
var Enemy = function(x, y) {
    Character.call(this, 'images/enemy-bug.png', x, y);
    this.speed = Math.floor(Math.random() * 300);
    this.initialY = y - ADJUST_Y;
    this.y = y - ADJUST_Y;
}
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

/**
 * Update the enemy's position, required method for game
 * dt - A time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    // Multiply any movement by the dt parameter to make sure
    // the game runs at the same speed for all computers.
    if(game.state)
        this.x = this.x + (this.speed * dt);

    // Check if enemy has reached the right side
    // if so, reset its x position
    if(this.x > CANVAS_WIDTH)
        this.reset();
};

/**
 * Player Subclass
 * It is used to instantiate our player
 */
var Player = function(x, y) {
    Character.call(this, 'images/char-boy.png', x, y);
    this.lives = 3;
}
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

/* Check for enemy collision.
 * Allow for 9 pixel difference in alignment of enemy and player
 * Y positions on the same row, due to centering of sprites.
 * Collision occurs when opposite side X coords are within 75 pixels.
 */
Player.prototype.update = function() {
    var player = this;
    allEnemies.forEach(function(enemy) {
        if(player.y - enemy.y == 9) {
            if(player.x < enemy.x + 75 && player.x + 75 > enemy.x) {
                player.handleLives();
            }
        }
    });
};

Player.prototype.handleLives = function() {
    if(this.lives > 0) {
        this.lives--;
        this.reset();
        game.renderGameInfo();
    } else {
        game.end();
    }
};

// Instantiate objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var game = new Game();
var allEnemies = game.enemies;
var player = game.player;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        80: 'pause'
    };

    game.handleInput(allowedKeys[e.keyCode]);
});