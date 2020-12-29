/*Name: Ko Jia Ling
  Admin no.: 190681D*/

var formData;

document.addEventListener("DOMContentLoaded", function(){
  formData = JSON.parse(localStorage.getItem('formData'));
});


function saveFormData() {
  formData = JSON.parse(localStorage.getItem('formData'));

  var firstName, lastName, email, contactNo, message;

  firstName = document.getElementById('firstName').value;
  lastName = document.getElementById('lastName').value;
  email = document.getElementById('email').value;
  contactNo = document.getElementById('contactNo').value;
  message = document.getElementById('message').value;

  var dataSet = {firstName: firstName, lastName: lastName, email: email, contactNo: contactNo, msg: message};
  formData.push(dataSet);
  localStorage.setItem('formData', JSON.stringify(formData));
}
