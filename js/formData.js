/*Name: Ko Jia Ling
  Admin no.: 190681D*/

var websiteSettings = JSON.parse(localStorage.getItem('websiteSettings'));

document.addEventListener("DOMContentLoaded", function(){
  var accordion = document.getElementById('accordion');
  formData = JSON.parse(localStorage.getItem('formData'));
  console.log(formData);
  if (formData.length==0) {
    var newParagraph = document.createElement('p');
    newParagraph.setAttribute('class','text-white');
    newParagraph.innerHTML = 'There is currently no form data.';
    accordion.appendChild(newParagraph);
  }
  else {
    console.log('Display form data');
    displayFormData();
  }
});

function displayFormData() {
  for (var i=0; i<formData.length; i++) {
    createCard(i);
  }
}

function createCard(setNo) {
  var data = "First Name: " + formData[setNo].firstName + "<br>"
  + "Last Name: " + formData[setNo].lastName + "<br>"
  + "Email: " + formData[setNo].email + "<br>"
  + "Contact No.: " + formData[setNo].contactNo + "<br>"
  + "Message: " + formData[setNo].msg + "<br>";

  var newCard = document.createElement('div');
  newCard.class = 'card';

  var code = '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#set' + setNo + '">'
  + 'Form #' + (setNo+1)
  + '</a></div><div id="set' + setNo + '" class="collapse show" data-parent="#accordion"><div class="card-body">'
  + data + '</div></div></div>';
  newCard.innerHTML = code;
  accordion.insertBefore(newCard, accordion.childNodes[0]);
}
