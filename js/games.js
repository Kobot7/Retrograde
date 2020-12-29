/* Name: Ko Jia Ling
   Admin no.: 190681D */

var noMatch;

document.addEventListener("DOMContentLoaded", function(){
  noMatch = document.getElementById('noMatch');
  noMatch.style.display = 'none';
});

function filterCards() {
   var matchFound = false;
   var input = document.getElementById('filterInput');
   var filter = input.value.toLowerCase();
   var cardContainer = document.getElementById('gameCards');
   var cards = cardContainer.getElementsByClassName('cardDiv');
   for (var i = 0; i < cards.length; i++) {
     var title = cards[i].querySelector('.card .card-img-overlay h5.card-title');
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
