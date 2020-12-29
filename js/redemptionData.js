/*Name: Ko Jia Ling
  Admin no.: 190681D*/

var noMatch;
var websiteSettings = JSON.parse(localStorage.getItem('websiteSettings'));
var redemptionData = JSON.parse(localStorage.getItem('redemptionData'));

document.addEventListener("DOMContentLoaded", function(){
  noMatch = document.getElementById('noMatch');
  noMatch.style.display = 'none';
  var accordion = document.getElementById('accordion');
  console.log(redemptionData);
  if (Object.keys(redemptionData).length==0) {
    var newParagraph = document.createElement('p');
    newParagraph.setAttribute('class','text-white');
    newParagraph.innerHTML = 'There is currently no redemption data.';
    accordion.appendChild(newParagraph);
  }
  else {
    console.log('Display redemption data');
    displayRedemptionData();
  }
});

function filterCards() {
   var matchFound = false;
   var input = document.getElementById('filterInput');
   var filter = input.value.toLowerCase();
   var cardContainer = document.getElementById('accordion');
   var cards = cardContainer.getElementsByClassName('card');
   for (var i = 0; i < cards.length; i++) {
     var title = cards[i].querySelector('.card-header .card-link');
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

function displayRedemptionData() {
  for (transaction in redemptionData) {
    createCard(transaction);
  }
}

function createCard(transaction) {
  var data = "Item: " + redemptionData[transaction].item + "<br>"
  + "Date: " + redemptionData[transaction].date + "<br>"
  + "First Name: " + redemptionData[transaction].firstName + "<br>"
  + "Last Name: " + redemptionData[transaction].lastName + "<br>"
  + "Email: " + redemptionData[transaction].email + "<br>"
  + "Contact No.: " + redemptionData[transaction].contactNo + "<br>"
  + "Address: " + redemptionData[transaction].address + "<br>"
  + "Remarks: " + redemptionData[transaction].remarks + "<br>"

  var newCard = document.createElement('div');
  newCard.setAttribute('class','card');

  var code = '<div class="card-header"><a class="card-link" data-toggle="collapse" href="#set' + transaction + '">'
  + transaction
  + '</a></div><div id="set' + transaction + '" class="collapse show" data-parent="#accordion"><div class="card-body">'
  + data + '</div></div>';
  newCard.innerHTML = code;
  accordion.insertBefore(newCard, accordion.childNodes[0]);
}
