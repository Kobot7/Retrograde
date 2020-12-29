/*Name: Ko Jia Ling
  Admin no.: 190681D*/

var accountList = JSON.parse(localStorage.getItem('accountList'));
var websiteSettings = JSON.parse(localStorage.getItem('websiteSettings'));

if (!websiteSettings.login) {
  window.location.href = websiteSettings.lastVisited;
}

var passwordCorrect, text;
var usernameAvailable = 'same';
var passwordRequired = false;
var passwordCorrect = false;
var currentUser = websiteSettings.username;
var pfp = accountList[currentUser].profilePic;


if(websiteSettings.profileUpdated) {
  updateLeaderboard(websiteSettings.previousUsername, websiteSettings.username);
  websiteSettings.profileUpdated = false;
  localStorage.setItem('websiteSettings', JSON.stringify(websiteSettings))
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('username').addEventListener('invalid', usernameValidity);
  document.getElementById('newPassword').addEventListener('invalid', passwordValidity);

  document.getElementById('usernameAvailable').style.display='none';
  document.getElementById('usernameTaken').style.visibility='hidden';

  document.getElementById('username').value = currentUser;
  document.getElementById('profilePic').src = pfp;
  document.getElementById('referralCode').innerHTML = 'Referral Code:<br>' + accountList[currentUser].referralCode +' <i class="fa fa-clone" aria-hidden="true"></i>';
  document.querySelector('label input[value="' + pfp +'"]').checked = true;

  if(websiteSettings.username=='Admin') {
    document.getElementById('username').disabled = true;
  }
  text = 'Join me in playing games on Retrograde! Use the referral code ' + accountList[currentUser].referralCode + ' to get some bonuses when you sign up!';
  document.querySelector('i.fa-clone').addEventListener('click', function() {copyTextToClipboard(text)});
});

function usernameValidity() {
  var usernameInput = document.getElementById('username');
  if (usernameInput.validity.patternMismatch) {
    usernameInput.setCustomValidity('Invalid username. Please ensure that your username only contains letters, numbers or underscores.');
  }
  else {
    usernameInput.setCustomValidity('');
  }
}

function passwordValidity() {
  var passwordInput = document.getElementById('newPassword');
  if (passwordInput.validity.patternMismatch) {
    passwordInput.setCustomValidity('Password must be 8-20 characters, and contain at least 1 capital letter, 1 lowercase letter and a number.');
  }
  else {
    passwordInput.setCustomValidity('');
  }
}

function checkUsernameAvailable(newUsername) {
  if (newUsername==currentUser){
    console.log('no change in username');
    document.getElementById('usernameAvailable').style.display='none';
    document.getElementById('usernameTaken').style.display='';
    document.getElementById('usernameTaken').style.visibility='hidden';
    usernameAvailable = 'same';
  }
  else if (newUsername in accountList) {
    console.log('username taken');
    document.getElementById('usernameAvailable').style.display='none';
    document.getElementById('usernameTaken').style.display='';
    document.getElementById('updateProfileBtn').disabled = true;
    usernameAvailable = 'no';
  }
  else {
    console.log('username available');
    document.getElementById('usernameAvailable').style.display='';
    document.getElementById('usernameTaken').style.display='none';
    document.getElementById('usernameTaken').style.visibility='';
    document.getElementById('updateProfileBtn').disabled = false;
    usernameAvailable = 'yes';
  }
  console.log('username = ' + usernameAvailable);
}

function checkPasswordRequired(password) {
  if(password!='') {
    document.getElementById('newPassword').required = true;
    console.log('password required');
    passwordRequired = true;
  }
  else {
    document.getElementById('newPassword').required = false;
    console.log('password not required');
    passwordRequired = false;
  }
}

function checkPassword() {
  var password = document.getElementById('password').value;

  if(sha1(password)==accountList[currentUser].password){
    passwordCorrect = true;
  }

  else {
    passwordCorrect = false;
  }
}

function updateUsernamePassword() {
  switch(usernameAvailable) {
    case 'yes':
      var newUsername = document.getElementById('username').value;

      if(passwordRequired) {
        checkPassword();
        if(passwordCorrect) {
          accountList[newUsername] = accountList[currentUser];
          accountList[newUsername].password = sha1(document.getElementById('newPassword').value);
          delete accountList[currentUser];
        }
        else {
          alert('Invalid password.');
          return false;
        }
      }

      else {
        accountList[newUsername] = accountList[currentUser];
        delete accountList[currentUser];
      }

      localStorage.setItem('accountList', JSON.stringify(accountList));
      websiteSettings.profileUpdated = true;
      websiteSettings.previousUsername = currentUser;
      websiteSettings.username = newUsername;
      localStorage.setItem('websiteSettings', JSON.stringify(websiteSettings));
      alert('Update successful');
      return true;

    case 'same':
      checkPassword();
      if(passwordCorrect) {
        accountList[currentUser].password = sha1(document.getElementById('newPassword').value);
        localStorage.setItem('accountList', JSON.stringify(accountList));
        alert('Update successful');
        return true;
      }
      else {
        alert('Invalid password.');
        return false;
      }

    default:
      alert('Username unavailable.');
      return false;
  }
}

function updateLeaderboard(oldUN,newUN) {
  var normalLeaderboard = JSON.parse(localStorage.getItem('normalLeaderboard'));
  var fastLeaderboard = JSON.parse(localStorage.getItem('fastLeaderboard'));;

  for(var i=0; i<normalLeaderboard.length; i++) {
    if(normalLeaderboard[i].username==oldUN) {
      normalLeaderboard[i].username = newUN;
    }
  }
  localStorage.setItem('normalLeaderboard', JSON.stringify(normalLeaderboard));

  for(var i=0; i<fastLeaderboard.length; i++) {
    if(fastLeaderboard[i].username==oldUN) {
      fastLeaderboard[i].username = newUN;
    }
  }
  localStorage.setItem('fastLeaderboard', JSON.stringify(fastLeaderboard));
}

function updateProfilePicture() {
  accountList[currentUser].profilePic = document.querySelector('input[type=radio]:checked').value;
  localStorage.setItem('accountList', JSON.stringify(accountList));
  document.getElementById('profilePic').src = pfp;
  document.querySelector('label input[value="' + pfp +'"]').checked = true;
}


/*Clipboard*/
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
  }
  navigator.clipboard.writeText(text).then(
    function() {
      console.log("Async: Copying to clipboard was successful!");
    },
    function(err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}
