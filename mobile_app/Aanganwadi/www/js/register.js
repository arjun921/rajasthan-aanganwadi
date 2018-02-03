//global variables
var currenttoken = '';


$(document).ready(function() {
  $(".button-collapse").sideNav();
  document.getElementById('submit').classList.add("disabled");
});


function check_password(input) {//Checks password both same or not
  if (input.value != document.getElementById('password').value) {
    input.setCustomValidity('Password Must be Matching.');
  } else { // input is valid -- reset the error message
    input.setCustomValidity('');
  }
}

function sign_up() {
  var nameval = document.getElementById("name").value;
  var emailval = document.getElementById("email").value;
  var pwdval = document.getElementById("password_confirm").value;
  var addrval = document.getElementById("addr").value;
  var phval = document.getElementById("ph").value;
  pwd_hash = murmurhash3_32_gc(pwdval, 24);
  var tokval = genToken();
  url = '/user/create';
  sendData = {
    name: nameval,
    email: emailval,
    pwd: pwd_hash.toString(),
    address: addrval,
    mobile: phval,
    token: tokval
  }
  apisuccess = function(data, st, xhr) {
    if (xhr.status == 200) {
      msg = 'Sign-Up Success'
      href = 'login.html'
      function action() {
        openLoginPage()
      }
      toastWithAction(msg, href, action)
    }
  }
  apierror = function(returnval) {
    if (returnval.status == 401) {
      msg = 'Sign Up is disabled.'
      href = 'login.html'

      function action() {
        openLoginPage()
      }
      toastWithAction(msg, href, action)
    } else if (returnval.status == 403) {
      msg = 'Only an admin can create users.'
      href = 'login.html'

      function action() {
        openLoginPage()
      }
      toastWithAction(msg, href, action)
    }
    else if (returnval.responseText.includes('user exists')) {
      msg = 'User already exists'
      href = 'register.html'
      function action() {
        openLoginPage()
      }
      toastWithAction(msg, href, action)
    }
  }
  hitApi(url, sendData, apisuccess, apierror);
}

function openLoginPage() {
  window.open("login.html", "_self");
}

$('#password_confirm').on('input propertychange paste', function() {
  validations();
});


function validations() {//disables signup button until all form fields valid.
  if (document.getElementById("name").value != "" && document.getElementById("email").value != "" && document.getElementById("password_confirm").value != "" && document.getElementById("ph").value != "") {
    if (document.getElementById("name").validationMessage == "" && document.getElementById("email").validationMessage == "" && document.getElementById("password_confirm").validationMessage == "" && document.getElementById("ph").validationMessage == "") {
      document.getElementById('submit').classList.remove("disabled");
      // All Fields Valid
    } else {
      document.getElementById('submit').classList.add("disabled");
    }
  } else {
    // Fields Invalid
    document.getElementById('submit').classList.add("disabled");
  }
}
