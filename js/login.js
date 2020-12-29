/*Name: Ko Jia Ling
  Admin no.: 190681D*/

var authenticateUser;
var referred = false;

var accountList = JSON.parse(localStorage.getItem('accountList'));
var websiteSettings = JSON.parse(localStorage.getItem('websiteSettings'));
if (websiteSettings.login) {
  window.location.href = websiteSettings.lastVisited;
}

document.addEventListener("DOMContentLoaded", function(){
  document.getElementById('usernameCA').addEventListener('invalid', usernameValidity);
  document.getElementById('passwordCA').addEventListener('invalid', passwordValidity);

  document.getElementById('usernameAvailable').style.display='none';
  document.getElementById('usernameTaken').style.display='none';
});

function usernameValidity() {
  var usernameInput = document.getElementById('usernameCA');
  if (usernameInput.validity.patternMismatch) {
    usernameInput.setCustomValidity('Invalid username. Please ensure that your username only contains letters, numbers or underscores.');
  }
  else {
    usernameInput.setCustomValidity('');
  }
}

function passwordValidity() {
  var passwordInput = document.getElementById('passwordCA');
  if (passwordInput.validity.patternMismatch) {
    passwordInput.setCustomValidity('Password must be 8-20 characters, and contain at least 1 capital letter, 1 lowercase letter and a number.');
  }
  else {
    passwordInput.setCustomValidity('');
  }
}

function generateReferralCode() {
  var referralCode = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i=0; i<16; i++) {
    referralCode+= possible.charAt(Math.floor(Math.random() * possible.length));
  }

  for(var account in accountList) {
    if(accountList[account].referralCode == referralCode) {
      generateReferralCode();
    }
  }

  return referralCode;
}

function checkUsernameAvailable(newUsername) {
  console.log('username input: ' + newUsername);

  if (newUsername in accountList) {
    console.log('username taken');
    document.getElementById('usernameAvailable').style.display='none';
    document.getElementById('usernameTaken').style.display='';
    document.getElementById('signUpBtn').disabled = true;
    usernameAvailable = false;
  }
  else {
    console.log('username available');
    document.getElementById('usernameTaken').style.display='none';
    document.getElementById('usernameAvailable').style.display='';
    document.getElementById('signUpBtn').disabled = false;
    usernameAvailable = true;
  }
}

function checkReferral(code) {
  if(code!= '') {
    for(account in accountList) {
      if(accountList[account].email==document.getElementById('emailCA').value) {
        alert("Sorry! To prevent people from taking advantage of the referral code system, users that already have an account registered are not allowed to use a referral code when registering a second account using the same email.");
        return false;
      }
    }
    for(account in accountList) {
      if(accountList[account].referralCode==code) {
        accountList[account].newReferral = true;
        accountList[account].bytes += 50;
        referred = true;
        return true;
      }
    }
    alert('Invalid referral code.');
    return false;
  }
  else {
    return true;
  }
}

function createAccount() {
  if (usernameAvailable) {
    var code = document.getElementById('referralCode').value;

    if(checkReferral(code)) {
      var monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September' ,'October' ,'November' ,'December'];
      var currentDate = new Date();
      var day = currentDate.getDate();
      var month = monthList[currentDate.getMonth()];
      var year = currentDate.getFullYear();

      var referralCode = generateReferralCode();

      var newEmail = document.getElementById('emailCA').value;
      var newUsername = document.getElementById('usernameCA').value;
      var newPassword = document.getElementById('passwordCA').value;
      var newAccount = {
        email: newEmail,
        password: sha1(newPassword),
        profilePic: 'image/profilePic-pacman.png',
        dateJoined: day + ' ' + month + ' ' + year,
        referralCode: referralCode,
        newReferral: false,
        pbNormal: 0,
        pbFast: 0,
        bytes: 0,
        snakeColor: 'green',
        snakeBought: [],
        pbMins: 59,
        pbSecs: 59,
        pbTenths: 99,
        stats: {snakeGP: 0, puzzleGP: 0, exp: 0},
        transactions: []
      };

      if(referred) {
        alert("We're glad that your friend invited you here! As a welcome gift, we'll give you 50 bytes!");
        newAccount.bytes += 50;
      }

      accountList[newUsername] = newAccount;
      localStorage.setItem('accountList', JSON.stringify(accountList));
      websiteSettings.login = true;
      websiteSettings.username = newUsername;
      localStorage.setItem('websiteSettings', JSON.stringify(websiteSettings));
      alert('Account created, you are now logged in.');
      return true;
    }

    else {
      return false;
    }
  }

  else {
    alert('Invalid data. Please try again.');
    return false;
  }
}

function authenticateUser() {
  var username = document.getElementById('usernameLI').value;
  var password = document.getElementById('passwordLI').value;

  if (username in accountList && sha1(password)==accountList[username].password) {
    alert('Login successful!');
    websiteSettings.login = true;
    websiteSettings.username = username;
    localStorage.setItem('websiteSettings', JSON.stringify(websiteSettings));
    if(accountList[username].newReferral) {
      alert("Your friend used your referral code to sign up for a new account! Thank you for bringing them here! As a thank you gift, we'll give you 50 bytes!");
    }
    accountList[username].newReferral = false;
    localStorage.setItem('accountList', JSON.stringify(accountList));
    return true;
  }

  else {
    alert('Invalid username or password.');
    return false;
  }
}
