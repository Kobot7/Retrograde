/*Name: Ko Jia Ling
  Admin no.: 190681D*/

var noMatch, cardContainer, cards, item, itemCost;
var accountList = JSON.parse(localStorage.getItem('accountList'));
var websiteSettings = JSON.parse(localStorage.getItem('websiteSettings'));
var redemptionData = JSON.parse(localStorage.getItem('redemptionData'));
var currentUser = websiteSettings.username;

if (!websiteSettings.login) {
  window.location.href = websiteSettings.lastVisited;
}

document.addEventListener("DOMContentLoaded", function() {
  cardContainer = document.getElementById('redemptionCards');
  cards = cardContainer.getElementsByClassName('cardDiv');

  loadCards();
  noMatch = document.getElementById('noMatch');
  noMatch.style.display = 'none';
  document.getElementById('userBytes').innerHTML = accountList[currentUser].bytes;
});

function loadCards() {
  for(var i=0; i<cards.length; i++) {
    var cost = cards[i].querySelector('div.card button.btn-info').innerText;
    if(accountList[currentUser].bytes<cost) {
      cards[i].querySelector('div.card button.btn-info').disabled = true;
      cards[i].querySelector('div.card button.btn-info').title = 'You do not have enough bytes to redeem this item';
    }
  }
}

function filterCards() {
   var matchFound = false;
   var input = document.getElementById('filterInput');
   var filter = input.value.toLowerCase();
   for (var i = 0; i < cards.length; i++) {
     var title = cards[i].querySelector('.card .card-header h5.card-title');
     if (title.innerText.toLowerCase().indexOf(filter) > -1) {
       cards[i].style.display = '';
       matchFound = true;
     }
     else {
       cards[i].style.display = 'none';
     }
   }

   if(matchFound) {
     noMatch.style.display = 'none';
   }
   else {
     noMatch.innerHTML = "&nbsp;&nbsp;&nbsp;There is no match found for '" + input.value + "'.";
     noMatch.style.display = '';
   }
}

function redeem(thing) {
  item = thing.parentElement.querySelector('div.card-header h5.card-title').innerText;
  itemCost = thing.parentElement.querySelector('div.card button.btn-info').innerText;
  document.getElementById('modalLabel').innerHTML = 'Redemption - ' + item;
}

function saveFormData() {
  var monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September' ,'October' ,'November' ,'December'];
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = monthList[currentDate.getMonth()];
  var year = currentDate.getFullYear();

  var redemptionData = JSON.parse(localStorage.getItem('redemptionData'));
  var transactionCode = generateTransactionCode();
  var firstName = document.getElementById('firstName').value;
  var lastName = document.getElementById('lastName').value;
  var email = document.getElementById('email').value;
  var contactNo = document.getElementById('contactNo').value;
  var address = document.getElementById('address').value;
  var remarks = document.getElementById('remarks').value;

  var dataSet = {
    item: item,
    date: day + ' ' + month + ' ' + year,
    firstName: firstName,
    lastName: lastName,
    email: email,
    contactNo: contactNo,
    address: address,
    remarks: remarks};
  redemptionData[transactionCode] = dataSet;
  localStorage.setItem('redemptionData', JSON.stringify(redemptionData));

  accountList[currentUser].transactions.push(transactionCode);
  accountList[currentUser].bytes -= itemCost;
  localStorage.setItem('accountList',JSON.stringify(accountList));
  alert('You have successfully redeemed ' + item + '!');
  return true;
}

function generateTransactionCode() {
  var code = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i=0; i<4; i++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  code += '-';
  for(var i=0; i<4; i++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  code += '-';
  for(var i=0; i<4; i++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  code += '-';
  for(var i=0; i<4; i++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  if(code in redemptionData) {
    generateReferralCode();
  }
  return code;
}
