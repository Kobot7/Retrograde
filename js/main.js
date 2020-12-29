/* Name: Ko Jia Ling
   Admin no.: 190681D */

defaultSettings();
var fileName;
var accountList = JSON.parse(localStorage.getItem('accountList'));
var websiteSettings = JSON.parse(localStorage.getItem('websiteSettings'));

document.addEventListener("DOMContentLoaded", function(){
  load(); logVisit();
  console.log(websiteSettings);
});

function load() {
  console.log('load');
  websiteSettings = JSON.parse(localStorage.getItem('websiteSettings'));

  /*Form Data access*/
  if (websiteSettings.username=='Admin') {
    console.log('admin account');
    document.getElementById('data').style.display = '';
  }
  else {
    document.getElementById('data').style.display = 'none';
  }

  /*Login Status*/
  if (websiteSettings.login) {
    console.log('status: logged in');
    document.getElementById('loginSignUp').style.display = 'none';
    document.getElementById('profileDropdown').style.display = '';
    var textNode = document.createTextNode(websiteSettings.username);
    document.getElementById('profileDropdown').querySelector('button').appendChild(textNode);
    document.getElementById('profileDropdown').querySelector('.dropdown-menu-right button img').src = accountList[websiteSettings.username].profilePic;
  }
  else {
    console.log('status: not logged in');
    document.getElementById('loginSignUp').style.display = '';
    document.getElementById('profileDropdown').style.display = 'none';
  }
}

function defaultSettings() {
  if (localStorage.getItem('accountList')==undefined) {
    accountList = {};
    var adminAccount = {
      email: '190681D@mymail.nyp.edu.sg',
      password: '7af2d10b73ab7cd8f603937f7697cb5fe432c7ff',
      profilePic: 'image/profilePic-pacman.png',
      dateJoined: 'At the birth of Retrograde',
      referralCode: 'HelloItsTheAdmin',
      newReferral: false,
      pbNormal: 0,
      pbFast: 0,
      bytes: 10000,
      snakeColor: 'green',
      snakeBought: ['red','orange','white','blue','purple'],
      pbMins: 59,
      pbSecs: 59,
      pbTenths: 99,
      stats: {snakeGP: 0, puzzleGP: 0, exp: 0},
      transactions: []
    };
    accountList['Admin'] = adminAccount;
    localStorage.setItem('accountList', JSON.stringify(accountList));
  }

  if (localStorage.getItem('websiteSettings')==undefined) {
    websiteSettings = {login: false, username: '', lastVisited: 'index.html', profileUpdated: false};
    localStorage.setItem('websiteSettings', JSON.stringify(websiteSettings));
  }

  if (localStorage.getItem('formData')==undefined) {
    formData = [];
    localStorage.setItem('formData', JSON.stringify(formData));
  }

  if (localStorage.getItem('redemptionData')==undefined) {
    redemptionData = {};
    localStorage.setItem('redemptionData', JSON.stringify(redemptionData));
  }

  if (localStorage.getItem('normalLeaderboard')==undefined) {
    normalLeaderboard = [];
    localStorage.setItem('normalLeaderboard', JSON.stringify(normalLeaderboard));
  }

  if (localStorage.getItem('fastLeaderboard')==undefined) {
    fastLeaderboard = [];
    localStorage.setItem('fastLeaderboard', JSON.stringify(fastLeaderboard));
  }
}

function logVisit() {
  fileName = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
  if (fileName=='formData.html' && websiteSettings.username!='Admin') {
    window.location.href = websiteSettings.lastVisited;
  }

  else if (fileName=='redemptionData.html' && websiteSettings.username!='Admin') {
    window.location.href = websiteSettings.lastVisited;
  }

  else if (fileName!='login.html' && fileName!='formData.html' && fileName!='redemptionData.html' && fileName!='settings.html' && fileName!='redemption.html' && fileName!='myTransactions.html') {
    websiteSettings.lastVisited = fileName;
    localStorage.setItem('websiteSettings', JSON.stringify(websiteSettings));
  }

  else {}
}

function logOut() {
  websiteSettings.login = false;
  websiteSettings.username = '';
  localStorage.setItem('websiteSettings', JSON.stringify(websiteSettings));
  websiteSettings.login = false;

  load(); refresh();
}

function refresh() {
  logVisit();
  if(!websiteSettings.login) {
    window.location.href = websiteSettings.lastVisited;
  }
  else {
    location.reload();
  }
}

function viewOwnProfile() {
  sessionStorage.setItem('viewUser', JSON.stringify(websiteSettings.username));
  window.location.href = 'viewUser.html';
}
