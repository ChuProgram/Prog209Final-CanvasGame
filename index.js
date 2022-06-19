// Create the canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 1000;                 // background image is "1000 x 1000"
canvas.height = 1000;
document.body.appendChild(canvas);

let gameBoard = [
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
];


let soundCaught = "sounds/caught.wav";
let soundGolden = "sounds/golden.wav";
let soundWin = "sounds/win.wav";
let soundGameOver = "sounds/gameOver.wav";
// Assign audio to soundEfx
let soundEfx = document.getElementById("soundEfx");

// Background image
let bgReady = false;
let bgImage = new Image();          // Image() = Canvas Object
bgImage.onload = function () {      // wait for image to load
    bgReady = true;
};
bgImage.src = "images/background.jpg";

// TOP & BOTTOM border Background image
let horizontalBorderReady = false;
let horizontalBorderImage = new Image();          // Image() = Canvas Object
horizontalBorderImage.onload = function () {      // wait for image to load
    horizontalBorderReady = true;
};
horizontalBorderImage.src = "images/horizontal_border.jpg";

// SIDE border Background image
let sideBorderReady = false;
let sideBorderImage = new Image();          // Image() = Canvas Object
sideBorderImage.onload = function () {      // wait for image to load
    sideBorderReady = true;
};
sideBorderImage.src = "images/vertical_border.jpg";


// Player image
let heroReady = false;
let heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/player.png";

// Football image
let footballReady = false;
let footballImage = new Image();
footballImage.onload = function () {
    footballReady = true;
};
footballImage.src = "images/football.png";

// Goldenball image
let goldenballReady = false;
let goldenballImage = new Image();
goldenballImage.onload = function () {
    goldenballReady = true;
};
goldenballImage.src = "images/goldenball.png";

// Wall image
let wallReady = false;
let wallImage = new Image();
wallImage.onload = function () {
    wallReady = true;
};
wallImage.src = "images/wall.png";

// Evil Baby image
let evilBabyReady = false;
let evilBabyImage = new Image();
evilBabyImage.onload = function () {
    evilBabyReady = true;
};
evilBabyImage.src = "images/evilBaby.png";

// POINTS
let pointsEarned = 0;
let deathPoint = 0;
let stopGame = 0;
let died = false;

/*** Game Objects ***/
// Player
let hero = {
    speed: 250, // movement in pixels per second
    x: 0,  // where on the canvas are they?
    y: 0  // where on the canvas are they?
};

// Football
let football = {
    // for this version, nobody moves except player, so just x and y
    x: 0,
    y: 0
};

// Golden Ball
let goldenball = {
    x: undefined,       // undefined, because they will be available after certain point has been reached
    y: undefined
};

// Wall
let wall1 = {
    x: 0,
    y: 0
};
let wall2 = {
    x: 0,
    y: 0
};
let wall3 = {
    x: undefined,
    y: undefined
};
let wall4 = {
    x: undefined,
    y: undefined
};

// Evil Baby
let evil1 = {
    x: 0,
    y: 0
};
let evil2 = {
    x: undefined,
    y: undefined
};
let evil3 = {
    x: undefined,
    y: undefined
};


/*** SPREADSHEET ANIMATION ***/
//  I have 4 rows and 4 cols in my "player.png" sprite sheet
let rows = 4;
let cols = 4;

let trackRight = 2; // third row for the right movement (counting the index from 0)
let trackLeft = 1;  // second row for the left movement (counting the index from 0)
let trackUp = 3;    // fourth row for up
let trackDown = 0;  // first row for down

// dimension of "player.png" sprite sheet (519 x 521)
let spriteWidth = 519;      // also  spriteWidth/cols;
let spriteHeight = 521;     // also spriteHeight/rows;
// width and height of actual character
let width = spriteWidth / cols;
let height = spriteHeight / rows;

// choosing animation set from the sheet
let curXFrame = 0;   // start on left side
let frameCount = 4;  // 4 frames per row (there are 4 columns)

// x and y coordinates of the overall sprite image to get the single frame we want
let srcX = 0;
let srcY = 0;

// Assuming that at start the character will move right side
let left = false;
let right = true;
let up = false;
let down = false;

let counter = 0; // used to slow animation down

// Countdown Timer
let time = 30;

function countdownTimer() {
    if (time > 0) {
        time -= 1;
    }
}
let timeInterval = setInterval(countdownTimer, 1000);

// Handle keyboard controls
let keysDown = {}; //object were we properties when keys go down
// and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down.  In our game loop, we will move the hero image if when
// we go thru render, a key is down

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);


// Reset the game when the player catches a football or goldenball
let reset = function () {
    if (died == true) {
        soundEfx.src = soundGameOver;
        soundEfx.play();
    }
    else {
        placeItem(hero);
        placeItem(football);
        placeItem(wall1);
        placeItem(wall2);
        placeItem(evil1);

        // increase opponents as you increase points
        if (pointsEarned >= 4) {
            placeItem(wall3);
            placeItem(evil2);
        }
        if (pointsEarned >= 8) {
            placeItem(wall4);
            placeItem(evil3);
        }

        // place golden ball for certain points reached
        if (pointsEarned === 2) {
            placeItem(goldenball);
        }
        if (pointsEarned === 7) {
            placeItem(goldenball);
        }

        if (pointsEarned >= 11) {
            alert("You Won!");
            // change sound effect and play it
            soundEfx.src = soundWin;
            soundEfx.play();
        }
    }
};

let placeItem = function (character) {
    let X = 5;  // just random number to assign value
    let Y = 6;  // just random number to assign value

    let success = false;
    // loop until find intersection on "gameBoard" matrix
    // prevents putting character on top of another character
    while (!success) {
        X = Math.floor(Math.random() * 9); // returns 0 through 8
        Y = Math.floor(Math.random() * 9); // returns 0 through 8
        if (gameBoard[X][Y] === 'x') {
            success = true;
        }
    }
    gameBoard[X][Y] = 'O';  // mark that square as taken
    character.x = (X * 100) + 50; // allow for border (50 = size of border) (100 = 100 units on board)
    character.y = (Y * 100) + 50;
};


/**** FUNCTIONS ****/

// Update game objects
let update = function (modifier) {

    left = false;
    right = false;
    up = false;
    down = false;

    // move character AND prevents from going overboard border
    // (right and bottom side need to calculate width of character)

    // holding UP key
    if (38 in keysDown) {
        console.log("up");
        hero.y -= hero.speed * modifier;
        if (hero.y < (32)) {
            hero.y = 32;
        }
        up = true;      // for animation
    }
    // holding DOWN key
    if (40 in keysDown) {
        console.log("down");
        hero.y += hero.speed * modifier;
        if (hero.y > (1000 - (50 + 125))) {
            hero.y = 1000 - (50 + 125);
        }
        down = true;    // for animation
    }
    // holding LEFT key
    if (37 in keysDown) {
        console.log("left");
        hero.x -= hero.speed * modifier;
        if (hero.x < (21)) {
            hero.x = 21;
        }
        left = true;    // for animation
    }
    // holding RIGHT key (50 = pixel of border)
    if (39 in keysDown) {
        console.log("right");
        hero.x += hero.speed * modifier;
        if (hero.x > (1000 - (50 + 95))) {
            hero.x = 1000 - (50 + 95);
        }
        right = true;   // for animation
    }


    // Finding Football Event
    if (
        hero.x <= (football.x + 55)      // hero coming from right to football
        && football.x <= (hero.x + 95)   // from left to football
        && hero.y <= (football.y + 20)   // from bottom to top
        && football.y <= (hero.y + 100)  // from top to bottom
    ) {
        ++pointsEarned;       // gain 1 point everytime football is caught
        // make sound when score points
        soundEfx.src = soundCaught;
        soundEfx.play();
        console.log("Found Football");
        reset();       // start a new cycle
    }

    // Finding Golden Ball Event
    if (
        hero.x <= (goldenball.x + 55)      // hero coming from right to goldenball
        && goldenball.x <= (hero.x + 95)   // from left to goldenball
        && hero.y <= (goldenball.y + 20)   // from bottom to top
        && goldenball.y <= (hero.y + 100)  // from top to bottom
    ) {
        pointsEarned += 3;       // gain 3 points when goldenball is caught
        // make sound when score points
        soundEfx.src = soundGolden;
        soundEfx.play();
        console.log("Found Goldenball");
        reset();       // start a new cycle
    }

    // Touching Evil Baby Event
    if (
        hero.x <= (evil1.x + 35)        // from right
        && evil1.x <= (hero.x + 80)     // from left
        && hero.y <= (evil1.y + 50)     // from bottom
        && evil1.y <= (hero.y + 100)    // from top
    ) {
        console.log("Touched Evil 1");
        gameOver();
    }

    if (pointsEarned >= 4) {
    if (
        hero.x <= (evil2.x + 35)
        && evil2.x <= (hero.x + 80)
        && hero.y <= (evil2.y + 50)
        && evil2.y <= (hero.y + 100)
    ) {
        console.log("Touched Evil 2");
        gameOver();
    }
}

    if (pointsEarned >= 8) {
    if (
        hero.x <= (evil3.x + 35)
        && evil3.x <= (hero.x + 80)
        && hero.y <= (evil3.y + 50)
        && evil3.y <= (hero.y + 100)
    ) {
        console.log("Touched Evil 3");
        gameOver()
    }
}

    // Touching Wall Event
    if (
        ( hero.x <= (wall1.x + 78)      // from right
        && wall1.x <= (hero.x + 78)     // from left
        && hero.y <= (wall1.y + 70)     // from bottom
        && wall1.y <= (hero.y + 90) )   // from top
        ||    
        ( hero.x <= (wall2.x + 78)        
        && wall2.x <= (hero.x + 78)     
        && hero.y <= (wall2.y + 70)     
        && wall2.y <= (hero.y + 90) ) 
        ||    
        ( hero.x <= (wall3.x + 78)        
        && wall3.x <= (hero.x + 78)     
        && hero.y <= (wall3.y + 70)     
        && wall3.y <= (hero.y + 90) ) 
        ||    
        ( hero.x <= (wall4.x + 78)        
        && wall4.x <= (hero.x + 78)     
        && hero.y <= (wall4.y + 70)     
        && wall4.y <= (hero.y + 90) ) 

    ) {
        hero.speed = hero.speed * -1;       // blocks character from moving, when wall is hit
    } else {
        hero.speed = 250;                   // character is able to move when not facing the wall
    }


    if (time === 0) {
        gameOver();
    }

    // Updating the sprite frame index
    //curXFrame = ++curXFrame % frameCount; 
    // it will count 0,1,2,0,1,2,0, etc
    // FIX SPEED TO 5
    if (counter == 3) {  // adjust this to change "walking speed" of animation (30 / counter #) (higher number = slower)
        curXFrame = ++curXFrame % frameCount; // Updating the sprite frame index
        // it will count 0,1,2,0,1,2,0, etc
        counter = 0;
    } else {
        counter++;
    }


    // Calculating the x coordinate for spritesheet (width of character * current frame)
    srcX = curXFrame * width;

    // if left is true, pick Y dim of the correct row
    if (left) {
        // calculate y coordinate for spritesheet
        srcY = trackLeft * height;
    }

    // if the right is true, pick Y dim of the correct row
    if (right) {
        // calculating y coordinate for spritesheet
        srcY = trackRight * height;
    }

    // if the up is true, pick Y dim of the correct row
    if (up) {
        // calculating y coordinate for spritesheet
        srcY = trackUp * height;
    }

    // if the down is true, pick Y dim of the correct row
    if (down) {
        // calculating y coordinate for spritesheet
        srcY = trackDown * height;
    }

    // default image when player isn't moving
    if (left == false && right == false && up == false && down == false) {
        srcX = 0 * width;
        srcY = 0 * height;
    }
};


// Game Over function
let gameOver = function () {
    if (time > 0) {
        alert("Game Over: You tackled a BABY!");    // player hits baby 
        soundEfx.src = soundGameOver;
        soundEfx.play();
    }
    else {
        alert("Game Over: You were out of time!");   // player out of time
        soundEfx.src = soundGameOver;
        soundEfx.play();
    }
    deathPoint = 1;
};


// DRAW everything in the main render function, when ready 
// order matters, have background image created FIRST
let render = function () {
    // background image and borders
    if (bgReady) {
        ctx.drawImage(bgImage, 50, 50); // drawImage(x, y) = (0, 0) = Upper Left Corner of screen
    }
    if (horizontalBorderReady) {
        ctx.drawImage(horizontalBorderImage, 0, 0);  // TOP side
        ctx.drawImage(horizontalBorderImage, 0, 950);  // BOTTOM side
    }
    if (sideBorderReady) {
        ctx.drawImage(sideBorderImage, 0, 0); // LEFT side
        ctx.drawImage(sideBorderImage, 950, 0); // RIGHT side
    }

    /*** CHARACTERS ***/
    // Evil Baby
    if (evilBabyReady) {
        ctx.drawImage(evilBabyImage, evil1.x, evil1.y);
        if (pointsEarned >= 4) {
            ctx.drawImage(evilBabyImage, evil2.x, evil2.y);
        }
        if (pointsEarned >= 8) {
            ctx.drawImage(evilBabyImage, evil3.x, evil3.y);
        }
    }

    // Wall
    if (wallReady) {
        ctx.drawImage(wallImage, wall1.x, wall1.y);
        ctx.drawImage(wallImage, wall2.x, wall2.y);
        if (pointsEarned >= 4) {
            ctx.drawImage(wallImage, wall3.x, wall3.y);
        }
        if (pointsEarned >= 8) {
            ctx.drawImage(wallImage, wall4.x, wall4.y);
        }
    }

    // Player
    if (heroReady) {
        ctx.drawImage(heroImage, srcX, srcY, width, height, hero.x, hero.y, width, height);
    }

    // Football
    if (footballReady) {
        ctx.drawImage(footballImage, football.x, football.y);
    }

    // Golden Ball
    if (goldenballReady) {
        if (pointsEarned === 2) {
            ctx.drawImage(goldenballImage, goldenball.x, goldenball.y);
        }
        if (pointsEarned === 7) {
            ctx.drawImage(goldenballImage, goldenball.x, goldenball.y);
        }
    }


    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "32px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    // when player wins
    if (pointsEarned >= 11) {
        stopGame = 1;
        ctx.fillText("YOU WON!", 450, 960); // 32 = tree border size
    }
    if (deathPoint === 1 || time === 0){
        stopGame = 1;   // stops game when either lose or win
        ctx.fillText("You Lost...", 450, 960);
    }
    else {
        ctx.fillText("Score: " + pointsEarned, 50, 12); // 32 = tree border size
        ctx.fillText("Time: " + time, 450, 12);
    }
};

// The main game loop
let main = function () {
    let now = Date.now();
    let delta = now - then;
    update(delta / 1000);
    render();
    then = now;

    // game stops if either win or lose ("stopGame" value changes to 1)
    if (stopGame < 1) { 
        //  Request to do this again ASAP
        requestAnimationFrame(main);
    }

};





/*** EXECUTING CODE ***/
/*** loop at the end after all is defined ***/

// Let's play this game!
let then = Date.now();
reset();    // position hero & football & opponents on the board before game start
main();  // call the main game loop.