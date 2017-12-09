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
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var pwd = document.getElementById("password_confirm").value;
    var addr = document.getElementById("addr").value;
    var ph = document.getElementById("ph").value;
    pwd_hash = murmurhash3_32_gc(pwd, 124);
    var data = {
        name: name,
        email: email,
        pwd: pwd_hash.toString(),
        address: addr,
        mobile: ph
    };
    console.log(data);
    $.ajax({
        url: link+'/user/create',
        type: "POST",
        dataType: 'json',
        crossDomain: true,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result, textStatus, xhr) {
            // alert(xhr.status);
            // alert(result);
            // alert(textStatus);
            // if (xhr.status == 200) {
            //     Materialize.toast("Sign-Up Success", 4000);
            // } else {
            //     // Materialize.toast(xhr.status, 4000);
            //     // Materialize.toast(ajaxOptions, 4000);
            //     Materialize.toast(thrownError, 4000);
            // }
            // // Materialize.toast(result, 4000);
            // // Materialize.toast(result.status, 4000);
        },
        error: function(returnval) {
          if (returnval.status == 401) {
            out_changes();
            var $toastContent = $('<span>Sign Up is disabled.</span>').add($('<a href="login.html"><button class="btn-flat toast-action">OK</button></a>'));
            Materialize.toast($toastContent, 4000, '', function() {
              window.open("login.html", "_self");
            })
          }
        }
    });
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
