/*Name: Ko Jia Ling
  Admin no.: 190681D*/

var accountList = JSON.parse(localStorage.getItem('accountList'));
var websiteSettings = JSON.parse(localStorage.getItem('websiteSettings'));
var currentUser = websiteSettings['username'];

if (websiteSettings.login) {
  document.getElementById('logInToSave').style.display = 'none';
  personalBest = accountList[currentUser].pbMins + ":" + accountList[currentUser].pbSecs + ":" + accountList[currentUser].pbTenths;
  document.getElementById('personalBest').innerHTML = 'Personal Best: ' + personalBest;
}

else {
  document.getElementById('personalBest').style.display = 'none';
}

function hide() {
  document.getElementById('imgGrid').classList.toggle('hide');
  document.getElementById('gameInfo').classList.toggle('hide');
  document.getElementById('finalTime').classList.toggle('hide');
  document.getElementById('buttons').classList.toggle('hide');
  document.getElementById('puzzleTitle').classList.toggle('hide');
}


/*Drag and Drop*/
//ImgDiv
var draggedImgDiv, draggedImg, replacedImg;

function allowDrop(ev, x) { //on dragover
  ev.preventDefault();
  replacedImg = x.innerHTML;
  console.log('replacedImg = ' + replacedImg);
}

function drop(ev, x) { //on drop
  ev.preventDefault();
  x.innerHTML = draggedImg;
  draggedImgDiv.innerHTML = replacedImg;
}

//Image
function drag(x) { //on dragstart
  draggedImgDiv = x.parentElement;
  draggedImg = x.parentElement.innerHTML;
  console.log('draggedImg = ' + draggedImg);
}


/*Puzzle Game*/
var image;
var numList = [1,2,3,4,5,6,7,8,9,10,
               11,12,13,14,15,16,17,18,19,20,
               21,22,23,24,25];
var imgBlocks = document.getElementById('imgGrid').getElementsByClassName('imgBlock');

function startGame() {
  hide();
  document.getElementById('startGame').disabled = true;
  shuffle();
  chooseImage(); displayImages(); startTimer();
}

function shuffle(){
  for (var i = numList.length - 1; i>0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [numList[i], numList[j]] = [numList[j], numList[i]];
  }
}

function chooseImage() {
  var randomNo = Math.floor(Math.random()*4);
  var imageList = ['console', 'arcade', 'pacman', 'space-invaders'];
  image = 'image/puzzle/' + imageList[randomNo];
  document.getElementById('finalImage').src =  image + '.png';
}

function displayImages() {
  for(var i=0; i<numList.length; i++) {
    var j = numList[i];
    var img = document.createElement('img');
    img.setAttribute('src', image + '-' + j + '.jpg');
    img.setAttribute('id', 'img' + j);
    img.setAttribute('class', 'blockImg');
    img.setAttribute('draggable', 'true');
    img.setAttribute('ondragstart', 'drag(this)');
    img.setAttribute('ondragend', 'checkIfComplete();');
    imgBlocks[i].innerHTML = '';
    imgBlocks[i].appendChild(img);
  }
}

function checkIfComplete() {
  var images = document.querySelectorAll('#imgGrid .imgBlock img');
  var complete = true;
  for(var i=0; i<images.length; i++) {
    if(images[i].id!='img'+(i+1)) {
      complete = false;
      break;
    }
  }

  if(complete) {
    gameEnd();
  }
  else {
    console.log('not completed');
  }
}

function gameEnd() {
  clearInterval(timer);
  if (websiteSettings.login) {
    recordScore(); displayLeaderboard(); updatePb();
  }
  document.querySelector('#finalTime p').innerText = 'Final time - ' + printMins + ":" + printSecs + ":" + printTenths;
  document.querySelector('#puzzleTitle h1').innerHTML = 'COMPLETE!';
  document.getElementById('startGame').innerHTML = 'REPLAY';
  document.getElementById('startGame').disabled = false;
  hide();
}


/*Timer*/
var timer;
var time = 0;
var running = 0;
var mins, secs, tenths;
var printTenths, printMins, printSecs;

function startTimer(){
  running = 0;
  time = 0;
  mins = 0;
  secs = 0;
  tenths = 0;
	increment();
};

function increment(){
  timer = setTimeout(function() {
    tenths += 1;
    if(tenths >= 100) {
      tenths -= 100;
      secs += 1;
    }
    if(secs >= 60) {
      secs -= 60;
      mins += 1;
    }
    if(mins >= 60) {
      mins = 50;
      secs = 59;
      tenths = 99;
    }

    if(tenths<10) {
      printTenths = '0' + tenths;
    }
    else {
      printTenths = tenths;
    }
    if(secs<10) {
      printSecs = '0' + secs;
    }
    else {
      printSecs = secs;
    }
    if(mins<10) {
      printMins = '0' + mins;
    }
    else {
      printMins = mins;
    }
		document.getElementById('stats-time').innerText = printMins + ":" + printSecs + ":" + printTenths;
		increment();
	}, 10);
};


/*Leaderboard*/
var playerDetails, puzzleLeaderboardTable;
var puzzleLeaderboard = JSON.parse(localStorage.getItem('puzzleLeaderboard'));
createLeaderboard(); displayLeaderboard();

function createLeaderboard() {
  if (localStorage.getItem('puzzleLeaderboard')==undefined) {
    puzzleLeaderboard = [];
    localStorage.setItem('puzzleLeaderboard', JSON.stringify(puzzleLeaderboard));
  }

  else {
    puzzleLeaderboard = JSON.parse(localStorage.getItem('puzzleLeaderboard'));
  }
}

function updatePb() {
  if(mins<parseInt(accountList[currentUser].pbMins)) {
    accountList[currentUser].pbMins = printMins;
    accountList[currentUser].pbSecs = printSecs;
    accountList[currentUser].pbTenths = printTenths;
    personalBest = printMins + ":" + printSecs + ":" + printTenths;
  }
  else if(secs<parseInt(accountList[currentUser].pbSecs) && mins==parseInt(accountList[currentUser].pbMins)) {
    accountList[currentUser].pbMins = printMins;
    accountList[currentUser].pbSecs = printSecs;
    accountList[currentUser].pbTenths = printTenths;
    personalBest = printMins + ":" + printSecs + ":" + printTenths;
  }
  else if(tenths<parseInt(accountList[currentUser].pbTenths) && secs==parseInt(accountList[currentUser].pbSecs) && mins==parseInt(accountList[currentUser].pbMins)) {
    accountList[currentUser].pbMins = printMins;
    accountList[currentUser].pbSecs = printSecs;
    accountList[currentUser].pbTenths = printTenths;
    personalBest = printMins + ":" + printSecs + ":" + printTenths;
  }
  else {}
  document.getElementById('personalBest').innerHTML = 'Personal Best: ' + personalBest;
  localStorage.setItem('accountList', JSON.stringify(accountList));
}

function recordScore() {
  accountList[currentUser]['stats'].puzzleGP += 1;
  accountList[currentUser]['stats'].exp += 5;
  accountList[currentUser].bytes += 5;
  localStorage.setItem('accountList', JSON.stringify(accountList));

  playerDetails = {username: currentUser, mins: printMins, secs: printSecs, tenths: printTenths};
  puzzleLeaderboard.push(playerDetails);

  puzzleLeaderboard.sort(function(a, b) {
    if(parseInt(a.mins)<parseInt(b.mins)) {
      return -1;
    }
    else if(parseInt(a.mins)==parseInt(b.mins) && parseInt(a.secs)<parseInt(b.secs)) {
      return -1;
    }
    else if(parseInt(a.mins)==parseInt(b.mins) && parseInt(a.secs)==parseInt(b.secs) && parseInt(a.tenths)<parseInt(b.tenths)) {
      return -1;
    }
    else {
      return 1;
    }
  });

  localStorage.setItem('puzzleLeaderboard', JSON.stringify(puzzleLeaderboard));
}

function displayLeaderboard() {
  puzzleLeaderboardTable = document.getElementById('puzzleLeaderboardTable').querySelector('tbody');
  puzzleLeaderboardTable.innerHTML = '';
  for (var k=0; k<5; k++) {
    if (k < puzzleLeaderboard.length) {
      createRow(k);
    }
    else {
      var newRow = puzzleLeaderboardTable.insertRow(-1);
      newRow.class = 'bigPixel-light';
      newRow.innerHTML = '<td>-</td> <td>-</td>';
    }
  }
  console.log('leaderboard created');
}

function createRow(rowNo) {
  var newRow = puzzleLeaderboardTable.insertRow(-1);
  newRow.class = 'bigPixel-light';
  var usernameCell = newRow.insertCell(0);
  var timingCell = newRow.insertCell(1);
  usernameCell.innerHTML = '<img src="' + accountList[puzzleLeaderboard[rowNo].username].profilePic +'" alt="profile picture">' + puzzleLeaderboard[rowNo]['username'];
  usernameCell.setAttribute('class','align-middle');
  timingCell.innerHTML = puzzleLeaderboard[rowNo].mins + ':' + puzzleLeaderboard[rowNo].secs + ':' + puzzleLeaderboard[rowNo].tenths;
  timingCell.setAttribute('class','align-middle');
}
