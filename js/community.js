/*Name: Ko Jia Ling
  Admin no.: 190681D*/

var table, noMatch;
var accountList = JSON.parse(localStorage.getItem('accountList'));

document.addEventListener("DOMContentLoaded", function(){
  table = document.querySelector('table tbody');
  noMatch = document.getElementById('noMatch');
  noMatch.style.display = 'none';
  displayTable();
});

function displayTable() {
  for(var account in accountList) {
    var newRow = table.insertRow(-1);
    newRow.class = 'bigPixel-light align-middle';

    var usernameCell = newRow.insertCell(0);
    usernameCell.innerHTML = '<a href="#" onclick="selectUser(this.innerText)"><img src="' + accountList[account].profilePic +'" alt="profile picture">' + account + '</a>';
    usernameCell.setAttribute('class','align-middle');

    var expCell = newRow.insertCell(1);
    expCell.innerHTML = accountList[account]['stats'].exp;
    expCell.setAttribute('class','align-middle');

    var totalGPCell = newRow.insertCell(2);
    var totalGP = accountList[account]['stats'].snakeGP + accountList[account]['stats'].puzzleGP;
    totalGPCell.innerHTML = totalGP;
    totalGPCell.setAttribute('class','align-middle');
  }
}

function filterUsers() {
  var matchFound = false;
  var input = document.getElementById('filterInput');
  var filter = input.value.toLowerCase();
  var accounts = document.querySelectorAll('table tbody tr');

  for (var i = 0; i < accounts.length; i++) {
   var text = accounts[i].querySelector('td').innerText;
   if (text.toLowerCase().indexOf(filter) > -1) {
     accounts[i].style.display = '';
     matchFound = true;
   }
   else {
     accounts[i].style.display = 'none';
   }
  }

  if(matchFound) {
   noMatch.style.display = 'none';
   document.querySelector('table').style.display = '';
  }
  else {
   noMatch.innerHTML = "&nbsp;&nbsp;&nbsp;There is no match found for '" + input.value + "'.";
   noMatch.style.display = '';
   document.querySelector('table').style.display = 'none';
  }
}

function selectUser(selected) {
  sessionStorage.setItem('viewUser', JSON.stringify(selected));
  window.location.href = 'viewUser.html';
}
