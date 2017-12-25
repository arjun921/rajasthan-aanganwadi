var link = 'https://rajasthan-aanganwadi.herokuapp.com';
var currenttoken = '';
//runs functions to be executed at page load
$(document).ready(function() {
    $(".button-collapse").sideNav();
    document.getElementById('submit').classList.add("disabled");
});

//Checks password both same or not
function check_password(input) {
    if (input.value != document.getElementById('password').value) {
        input.setCustomValidity('Password Must be Matching.');
    } else {
        // input is valid -- reset the error message
        input.setCustomValidity('');
    }
}

function sign_up() {
    var nameval = document.getElementById("name").value;
    var emailval = document.getElementById("email").value;
    var pwdval = document.getElementById("password_confirm").value;
    var addrval = document.getElementById("addr").value;
    var phval = document.getElementById("ph").value;
    pwd_hash = murmurhash3_32_gc(phval, 124);
    var tokval = genToken();
    url='/user/create';
    sendData = {
        name: nameval,
        email: emailval,
        pwd: pwd_hash.toString(),
        address: addrval,
        mobile: phval,
        token: tokval
    }
    console.log(sendData);
    apisuccess = function (data, st, xhr) {
        if (xhr.status == 200) {
            Materialize.toast("Sign-Up Success", 4000);
        }
        // else {
        //     // Materialize.toast(xhr.status, 4000);
        //     Materialize.toast(thrownError, 4000);
        // }
        // // Materialize.toast(data, 4000);
        // // Materialize.toast(data.status, 4000);
    }
    apierror = function(returnval) {
      if (returnval.status == 401) {
        msg = 'Sign Up is disabled.'
        href = '../UI/login.html'
        function action() {
          openLoginPage()
        }
        toastWithAction(msg,href,action)
      }
      else if (returnval.status == 403) {
        msg = 'Only an admin can create users.'
        href = '../UI/login.html'
        function action() {
          openLoginPage()
        }
        toastWithAction(msg,href,action)
      }
    }
    hitApi(url,sendData,apisuccess,apierror);
}

function openLoginPage() {
  window.open("../UI/login.html", "_self");
}

$('#password_confirm').on('input propertychange paste', function() {
    validations();
});

//disables signup button until all form fields valid.
function validations() {
    if (document.getElementById("name").value != "" && document.getElementById("email").value != "" && document.getElementById("password_confirm").value != "" && document.getElementById("ph").value != "") {
        if (document.getElementById("name").validationMessage == "" && document.getElementById("email").validationMessage == "" && document.getElementById("password_confirm").validationMessage == "" && document.getElementById("ph").validationMessage == "") {
            // Materialize.toast("All Fields Valid", 4000);
            console.log("All Fields Valid");
            document.getElementById('submit').classList.remove("disabled");
            // return ("All Fields Valid");
        }
        else {
            document.getElementById('submit').classList.add("disabled");
        }
    } else {
        // Materialize.toast("Fields Invalid", 4000);
        console.log("Fields  inValid");
        document.getElementById('submit').classList.add("disabled");
        // return ("Fields Invalid");
    }
}
