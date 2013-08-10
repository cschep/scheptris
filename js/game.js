// HI INTERNET!

var BLOCK_WIDTH = 30;
var COLUMNS = 10;
var ROWS = 20;
var DRAW_OUTLINE = false;
var BACKGROUND_COLOR = "#050F1A";
var GAME_FPS = 60;

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = COLUMNS * BLOCK_WIDTH;
canvas.height = ROWS * BLOCK_WIDTH;
document.body.appendChild(canvas);

var board = [];

for (var i = 0; i < ROWS; i++) {
  for (var j = 0; j < COLUMNS; j++) {
    if (!board[i]) {
      board[i] = [];
    }

    board[i][j] = 0;
  }
}

var shapes = [
  {
    name: "t",
    color: "purple",
    points: 
    [
        [[-1,0], [0,0], [1,0], 
                 [0,1]],
     
                [[0,-1],
                 [0, 0], [1, 0],
                 [0, 1]],

                [[0,-1],
         [-1,0], [0, 0], [1,0]], 

                [[0,-1],
         [-1,0], [0, 0],
                 [0, 1]]
    ]
  },

  //i
  {
    name: "i",
    color: "cyan",
    points: 
    [
        [[-1,0], [0,0], [1,0], [2,0]],

        [[0, -1],
         [0, 0],
         [0, 1],
         [0, 2]],

        [[-1,0], [0,0],  [1,0], [2,0]],

        [[0,-1],
         [0, 0],
         [0, 1],
         [0, 2]]
    ]
  }
];

// square
var square = {
  //speed: 256, // movement in pixels per second
  x: 0,
  y: 0,
  shapeIndex: 0,
  rotationIndex: 0
};

addEventListener("keydown", function (e) {
  //console.log(e.keyCode);
  if (e.keyCode == 32 || e.keyCode == 38) { 
    rotate();
  }
  if (e.keyCode == 78) {
    changeShape();
  } 
  if (e.keyCode == 40) {  //down
    square.y += BLOCK_WIDTH;
  }
  if (e.keyCode == 37) { //left
    square.x -= BLOCK_WIDTH;
  }
  if (e.keyCode == 39) { //right
    square.x += BLOCK_WIDTH;
  }
}, false);

var reset = function () {
  square.x = canvas.width / 2;
  square.y = 0;
};

var rotate = function() {
  square.rotationIndex++;
  if (square.rotationIndex > 3) { square.rotationIndex = 0; }  
}

var changeShape = function() {
  square.shapeIndex++;
  if (square.shapeIndex > 1) { square.shapeIndex = 0; }
}

// update game objects
var update = function (modifier) {
  // console.log("x: " + square.x);
  if (square.x > canvas.width - (2 * BLOCK_WIDTH)) { 
    square.x = canvas.width - (2 * BLOCK_WIDTH);
  }

  if (square.x < BLOCK_WIDTH) {
    square.x = BLOCK_WIDTH;
  }
  
  if (square.y < 0) {
    square.y = 0;
  }

  if (square.y > canvas.height - (2 * BLOCK_WIDTH)) {
    square.y = canvas.height - (2 * BLOCK_WIDTH);
  }

  // slowly move piece down?
  // console.log(Date.now() - lastMove);
  timeSinceLastMove = Date.now() - lastMove;
  // console.log(Date.now() - lastMove);
  if (timeSinceLastMove > 1000) {
   square.y += BLOCK_WIDTH;
   lastMove = Date.now();
  }

};

var drawBackground = function() {
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  if (DRAW_OUTLINE) {
    for (var i = 1; i < COLUMNS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * BLOCK_WIDTH, 0);
      ctx.lineTo(i * BLOCK_WIDTH, ROWS * BLOCK_WIDTH);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#FFF";
      ctx.stroke();
    }

    for (var i = 1; i < ROWS; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * BLOCK_WIDTH);
      ctx.lineTo(COLUMNS * BLOCK_WIDTH, i * BLOCK_WIDTH);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#FFF";
      ctx.stroke();
    }
  }
}

var drawSquare = function() {
  var shape = shapes[square.shapeIndex]
  var points = shape["points"][square.rotationIndex];
  for (var i = 0; i < 4; i++) {
    var x = points[i][0];
    var y = points[i][1];

    ctx.fillStyle = shape["color"];
    ctx.fillRect(square.x + (x * BLOCK_WIDTH), square.y + (y * BLOCK_WIDTH),
                                  BLOCK_WIDTH, BLOCK_WIDTH);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(square.x + (x * BLOCK_WIDTH), square.y + (y * BLOCK_WIDTH),
                                  BLOCK_WIDTH, BLOCK_WIDTH);
  }
}

var drawAll = function () {
  drawBackground();
  drawSquare();
};

// game loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);

  then = now;
};

var render = function() {
  requestAnimationFrame(render);
  drawAll();
}
 

// start it up
reset();
var then = Date.now();
var lastMove = Date.now();

render();
updateLoopIntervalId = setInterval(main, 1000 / GAME_FPS);
