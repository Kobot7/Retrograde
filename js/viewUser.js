/*Name: Ko Jia Ling
  Admin no.: 190681D*/

var user, userStats;
var viewUser = JSON.parse(sessionStorage.getItem('viewUser'));
var accountList = JSON.parse(localStorage.getItem('accountList'));

document.addEventListener("DOMContentLoaded", function(){
  if(viewUser==undefined) {
    window.location.href = 'community.html';
  }
  else {
    document.querySelector('title').innerHTML = 'Profile - ' + viewUser;
    user = accountList[viewUser];
    userStats = accountList[viewUser]['stats'];
    loadUserInfo(); loadUserStats();
  }
});

function loadUserInfo() {
  document.getElementById('profilePic').src = user.profilePic;
  document.querySelector('h1').innerHTML = viewUser;
}

function loadUserStats() {
  var totalGP = userStats.snakeGP + userStats.puzzleGP;
  document.getElementById('overview').innerHTML =
  'Date joined: ' + user.dateJoined
  + '<br><br>Experience: ' + userStats.exp + ' exp'
  + '<br><br>Total Games played: ' + totalGP;

  document.getElementById('snakeStats').innerHTML =
  'Games played: ' + userStats.snakeGP
  + '<br><br>Highest Score (Normal mode): ' + user.pbNormal
  + '<br><br>Highest Score (Fast mode): ' + user.pbFast;

  document.getElementById('puzzleStats').innerHTML =
  'Games played: ' + userStats.puzzleGP
  + '<br><br>Fastest Time: ' + user.pbMins + ':' + user.pbSecs + ':' + user.pbTenths;
}
