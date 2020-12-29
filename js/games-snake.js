/*Name: Ko Jia Ling
  Admin no.: 190681D*/

var accountList = JSON.parse(localStorage.getItem('accountList'));
var websiteSettings = JSON.parse(localStorage.getItem('websiteSettings'));
var currentUser = websiteSettings['username'];

/*Controls*/
function addArrowListener() {
  window.addEventListener("keydown", disableArrows);
}

var disableArrows = function(e) {
  switch(e.keyCode){
    case 37: case 39: case 38:  case 40: // Arrow keys
    case 32: e.preventDefault(); break; // Space
    default: break; // do not block other keys
  }
}

/*Snake colors*/
var colors = {
  red: {body: '#FF3300', border: '#CC0000'},
  orange: {body: '#FFC000', border: '#FF910E'},
  green: {body: '#00FF00', border: '#00D22B'},
  blue: {body: '#00B0F0', border: '#0070C0'},
  purple: {body: '#893BC3', border: '#612A8A'},
  white: {body: '#F2F2F2', border: '#BFBFBF'},
};

function checkSnake() {
  document.querySelector('label input[value="' + accountList[currentUser].snakeColor +'"]').checked = true;
}

function updateSnakeDesign() {
  accountList[currentUser].snakeColor = document.querySelector('.modal-body .row .col-lg-3 label input[type=radio]:checked').value;
  localStorage.setItem('accountList', JSON.stringify(accountList));
  location.reload();
}

function snakeChoices() {
  document.getElementById('userBytes').innerHTML = accountList[currentUser].bytes;
  var snakeBought = accountList[currentUser].snakeBought;
  var snakeChoices = document.querySelectorAll('.snakeChoice');
  for(var i=0; i<snakeChoices.length; i++) {
    if(snakeBought.includes(snakeChoices[i].querySelector('label input').value)) {
      snakeChoices[i].querySelector('label input').disabled = false;
      snakeChoices[i].querySelector('button').style.visibility = 'hidden';
    }
    else {
      snakeChoices[i].querySelector('label input').disabled = true;
      snakeChoices[i].querySelector('button').style.visibility = '';
      snakeChoices[i].querySelector('button').addEventListener('click', function(){
        buy(this.value);
      });
    }
  }
}

function buy(chosenSnake) {
  if(confirm('Confirm purchase of ' + chosenSnake + ' ?')) {
    if(accountList[currentUser].bytes>=50) {
      accountList[currentUser].bytes -= 50;
      accountList[currentUser].snakeBought.push(chosenSnake);
      localStorage.setItem('accountList', JSON.stringify(accountList));
      snakeChoices();
    }
    else {
      alert('You do not have enough bytes to purchase the item!');
    }
  }
}

/*Snake game*/

var eatAudio = new Audio('audio/snakeEatAudio.mp3');

var changingDirection, changePerMs;
var snake, dx, dy, points;
const canvas = document.getElementById('gameboard');
const context = canvas.getContext('2d');

var mode, personalBest;
var snakeBody, snakeBorder;

if(websiteSettings.login) {
  snakeBody = colors[accountList[currentUser].snakeColor].body;
  snakeBorder = colors[accountList[currentUser].snakeColor].border;
  document.getElementById('snakeDesignBtn').style.display = '';
  document.getElementById('logInToSave').style.display = 'none';

  snakeChoices();
}
else {
  snakeBody = colors['green'].body;
  snakeBorder = colors['green'].border;
  document.getElementById('snakeDesignBtn').style.display = 'none';
  document.getElementById('personalBest').style.display = 'none';
}

reset(); clearCanvas(); createFood(); drawSnake(); changeMode();

context.font = '90px Retro, monospace';
context.fillStyle = 'red';
context.textAlign = 'center';
context.fillText('START', canvas.width/2, canvas.height/2.5);

function changeMode() {
  if (document.getElementById('normal').checked) {
    changePerMs = 200;
    mode = 'normal';
    if (websiteSettings.login) {
      personalBest = accountList[currentUser].pbNormal;
      document.getElementById('personalBest').innerHTML = 'Personal Best: ' + personalBest;
    }
  }
  else {
    changePerMs = 75;
    mode = 'fast';
    if (websiteSettings.login) {
      personalBest = accountList[currentUser].pbFast;
      document.getElementById('personalBest').innerHTML = 'Personal Best: ' + personalBest;
    }
  }
}

document.addEventListener('keydown', changeDirection);

function hide() {
  document.getElementById('stats-score').classList.toggle('hide');
  document.getElementById('startGame').classList.toggle('hide');
  document.getElementById('modeButtons').classList.toggle('hide');
  document.querySelector('#controls p').classList.toggle('hide');
  document.getElementById('startGame').disabled = true;
}

function show() {
  document.getElementById('stats-score').classList.toggle('hide');
  document.getElementById('startGame').classList.toggle('hide');
  document.getElementById('modeButtons').classList.toggle('hide');
  document.querySelector('#controls p').classList.toggle('hide');
  document.getElementById('startGame').disabled = false;
}

function reset() {
  changingDirection = false;

  snake = [
  {x:285, y:255},
  {x:270, y:255},
  {x:255, y:255},
  {x:240, y:255},
  {x:225, y:255},
  ];

  dx = 15;
  dy = 0;

  points = 0;
  document.getElementById('stats-score').innerHTML = 'Score: ' + points;
}

function clearCanvas() {
  context.fillStyle = '#000000';
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function randomTen(max) {
  return Math.round((Math.random()*max)/15)*15;
}

function createFood() {
  foodX = randomTen(canvas.width-15);
  foodY = randomTen(canvas.height-15);
  snake.forEach(function isFoodOnSnake(part) {
      const isFoodOnSnake = part.x == foodX && part.y == foodY;
      if(isFoodOnSnake) createFood();
  });
}

function drawFood() {
  context.fillStyle = 'red';
  context.strokeStyle= 'darkred';
  context.fillRect(foodX, foodY, 15, 15);
  context.strokeRect(foodX, foodY, 15, 15);
}

function moveSnake() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);

  const didEat = snake[0].x === foodX && snake[0].y === foodY;

  if(didEat) {
    eatAudio.play();
    createFood();
    points += 10;
    document.getElementById('stats-score').innerHTML = 'Score: ' + points;

    if (mode=='normal') {
      if (points<50) changePerMs = 200;
      else if (points<70) changePerMs = 185;
      else if (points<100) changePerMs = 175;
      else if (points<150) changePerMs = 150;
      else if (points<170) changePerMs = 135;
      else if (points<200) changePerMs = 125;
      else if (points<250) changePerMs = 115;
      else if (points<300) changePerMs = 100;
      else if (points<400) changePerMs = 90;
      else if (points<500) changePerMs = 85;
      else if (points<600) changePerMs = 80;
      else changePerMs = 75;
    }

    else {
      if (points<100) changePerMs = 75;
      else if (points<300) changePerMs = 70;
      else if (points<500) changePerMs = 60;
      else changePerMs = 50;
    }

    console.log(changePerMs);
  }
  else snake.pop();
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
  context.fillStyle = snakeBody;
  context.strokeStyle = snakeBorder;

  context.fillRect(snakePart.x, snakePart.y, 15, 15);
  context.strokeRect(snakePart.x, snakePart.y, 15, 15);
}

function changeDirection(event) {
  const leftKey = 37;
  const upKey = 38;
  const rightKey = 39;
  const downKey = 40;
  const wKey = 87;
  const aKey = 65;
  const sKey = 83;
  const dKey = 68;

  const keyPressed = event.keyCode;
  const goingUp = dy === -15;
  const goingDown = dy === 15;
  const goingLeft = dx === -15;
  const goingRight = dx === 15;

  if(changingDirection) return;
  if (keyPressed === leftKey && !goingRight) {dx = -15; dy = 0}
  if (keyPressed === upKey && !goingDown) {dx = 0; dy = -15}
  if (keyPressed === rightKey && !goingLeft) {dx = 15; dy = 0}
  if (keyPressed === downKey && !goingUp) {dx = 0; dy = 15}
  if (keyPressed === aKey && !goingRight) {dx = -15; dy = 0}
  if (keyPressed === wKey && !goingDown) {dx = 0; dy = -15}
  if (keyPressed === dKey && !goingLeft) {dx = 15; dy = 0}
  if (keyPressed === sKey && !goingUp) {dx = 0; dy = 15}
  changingDirection = true;
}

function didEnd() {
  for (i=3;i<snake.length;i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  if(snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) return true;
  else return false;
}

function main() {
  if (didEnd()) {
    endScreen();
  }

  else {
    setTimeout(function onTick() {
      changingDirection = false; clearCanvas(); drawFood(); moveSnake(); drawSnake(); main();
      if(websiteSettings.login) {
        updatePb()
      };
    }, changePerMs);
  }
}

function endScreen() {
  window.removeEventListener("keydown", disableArrows);

  if (websiteSettings.login) {
    recordScore(); snakeChoices(); displayLeaderboard(); updatePb();
    document.querySelector('#controls p').innerHTML = 'You have earned '+ bytes + ' <i class="fa fa-lock fa-bolt" aria-hidden="true"></i>';
  }

  clearCanvas();
  context.font = '80px Retro, monospace';
  context.fillStyle = 'red';
  context.textAlign = 'center';
  context.fillText('GAME OVER', canvas.width/2, canvas.height/2.5);

  context.font = '30px Retro, monospace';
  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.fillText('Score: '+ points, canvas.width/2, canvas.height/1.9);

  document.getElementById('startGame').innerHTML = 'RETRY';
  show();
}


/*Leaderboard*/
var bytes, playerDetails, normalLeaderboard, fastLeaderboard, normalLeaderboardTable, fastLeaderboardTable;

createLeaderboard(); displayLeaderboard();

function createLeaderboard() {
  if (localStorage.getItem('normalLeaderboard')==undefined) {
    normalLeaderboard = [];
    localStorage.setItem('normalLeaderboard', JSON.stringify(normalLeaderboard));
  }

  else {
    normalLeaderboard = JSON.parse(localStorage.getItem('normalLeaderboard'));
  }

  if (localStorage.getItem('fastLeaderboard')==undefined) {
    fastLeaderboard = [];
    localStorage.setItem('fastLeaderboard', JSON.stringify(fastLeaderboard));
  }

  else {
    fastLeaderboard = JSON.parse(localStorage.getItem('fastLeaderboard'));
  }
}

function updatePb() {
  if(mode =='normal') {
    if(points>accountList[currentUser].pbNormal) {
      accountList[currentUser].pbNormal = points;
      personalBest = points;
    }
    document.getElementById('personalBest').innerHTML = 'Personal Best: ' + personalBest;
    localStorage.setItem('accountList', JSON.stringify(accountList));
  }
  else {
    if(points>accountList[currentUser].pbFast) {
      accountList[currentUser].pbFast = points;
      personalBest = points;
    }
    document.getElementById('personalBest').innerHTML = 'Personal Best: ' + personalBest;
    localStorage.setItem('accountList', JSON.stringify(accountList));
  }
}

function recordScore() {
  accountList = JSON.parse(localStorage.getItem('accountList'));
  bytes = Math.floor(points/10);
  accountList[currentUser].bytes += bytes;
  accountList[currentUser]['stats'].exp += bytes;
  accountList[currentUser]['stats'].snakeGP += 1;
  localStorage.setItem('accountList', JSON.stringify(accountList));

  playerDetails = {username: currentUser, score: points};

  if(mode =='normal') {
    normalLeaderboard.push(playerDetails);

    normalLeaderboard.sort(function(a, b) {
      return b.score - a.score;
    });

    localStorage.setItem('normalLeaderboard', JSON.stringify(normalLeaderboard));
  }

  else {
    fastLeaderboard.push(playerDetails);

    fastLeaderboard.sort(function(a, b) {
      return b.score - a.score;
    });

    localStorage.setItem('fastLeaderboard', JSON.stringify(fastLeaderboard));
  }
}

function displayLeaderboard() {
  normalLeaderboardTable = document.getElementById('normalLeaderboardTable').querySelector('tbody');
  normalLeaderboardTable.innerHTML = '';
  for (var k=0; k<5; k++) {
    if (k < normalLeaderboard.length) {
      createRowNormal(k);
    }
    else {
      var newRow = normalLeaderboardTable.insertRow(-1);
      newRow.class = 'bigPixel-light';
      newRow.innerHTML = '<td>-</td> <td>-</td>';
    }
  }

  fastLeaderboardTable = document.getElementById('fastLeaderboardTable').querySelector('tbody');
  fastLeaderboardTable.innerHTML = '';
  for (var l=0; l<5; l++) {
    if (l < fastLeaderboard.length) {
      createRowFast(l);
    }
    else {
      var newRow = fastLeaderboardTable.insertRow(-1);
      newRow.class = 'bigPixel-light';
      newRow.innerHTML = '<td>-</td> <td>-</td>';
    }
  }
  console.log('leaderboard created');
}

function createRowNormal(rowNo) {
  var newRow = normalLeaderboardTable.insertRow(-1);
  newRow.class = 'bigPixel-light';
  var usernameCell = newRow.insertCell(0);
  var scoreCell = newRow.insertCell(1);
  usernameCell.innerHTML = '<img src="' + accountList[normalLeaderboard[rowNo].username].profilePic +'" alt="profile picture">' + normalLeaderboard[rowNo]['username'];
  usernameCell.setAttribute('class','align-middle');
  scoreCell.innerHTML = normalLeaderboard[rowNo]['score'];
  scoreCell.setAttribute('class','align-middle');
}

function createRowFast(rowNo) {
  var newRow = fastLeaderboardTable.insertRow(-1);
  newRow.class = 'bigPixel-light';
  var usernameCell = newRow.insertCell(0);
  var scoreCell = newRow.insertCell(1);
  usernameCell.innerHTML = '<img src="' + accountList[fastLeaderboard[rowNo].username].profilePic +'" alt="profile picture">' + fastLeaderboard[rowNo]['username'];
  usernameCell.setAttribute('class','align-middle');
  scoreCell.innerHTML = fastLeaderboard[rowNo]['score'];
  scoreCell.setAttribute('class','align-middle');
}
