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


// Hash Function
//used in login/signup
//source https://github.com/garycourt/murmurhash-js/blob/master/murmurhash3_gc.js
function murmurhash3_32_gc(key, seed) {
    var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

    remainder = key.length & 3; // key.length % 4
    bytes = key.length - remainder;
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;

    while (i < bytes) {
        k1 =
            ((key.charCodeAt(i) & 0xff)) |
            ((key.charCodeAt(++i) & 0xff) << 8) |
            ((key.charCodeAt(++i) & 0xff) << 16) |
            ((key.charCodeAt(++i) & 0xff) << 24);
        ++i;

        k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

        h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
        h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
        h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    k1 = 0;

    switch (remainder) {
        case 3:
            k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        case 2:
            k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        case 1:
            k1 ^= (key.charCodeAt(i) & 0xff);

            k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= k1;
    }

    h1 ^= key.length;

    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
}

var genToken = function() {
                var text = "";
                var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
                for(var i = 0; i < 100; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }


//<------------- Login begin

function dologin(){
    var email = $('#emailinput').val();
    var pwd = $("#pwdinput").val();
    var tok = genToken();
    $.ajax({
        url: (link+'/user/login'),
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify( { "email": email, "pwd": pwd, "token": tok} ),
        success: function(data, st, xhr){
            // $('#emailinput').hide();
            // $("#pwdinput").hide();
            // $("#loginbutton").hide();
            // $("#logoutbutton").show();
            // $("#username").text(email);
            currenttoken = tok;
            Materialize.toast('Login Successful', 4000)
        }
    });

};

//Login end ------------->


//<------------- register.html script begin

//disables signup button until all form fields valid.
function validations() {
    if (document.getElementById("name").value != "" && document.getElementById("email").value != "" && document.getElementById("password_confirm").value != "" && document.getElementById("ph").value != "") {
        if (document.getElementById("name").validationMessage == "" && document.getElementById("email").validationMessage == "" && document.getElementById("password_confirm").validationMessage == "" && document.getElementById("ph").validationMessage == "") {
            // Materialize.toast("All Fields Valid", 4000);
            console.log("All Fields Valid");
            document.getElementById('submit').classList.remove("disabled");
            // return ("All Fields Valid");
        }
    } else {
        // Materialize.toast("Fields Invalid", 4000);
        console.log("Fields  inValid");
        document.getElementById('submit').classList.add("disabled");
        // return ("Fields Invalid");
    }
}

//signup function, called when clicking sign-up button
function sign_up() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var pwd = document.getElementById("password_confirm").value;
    var addr = document.getElementById("addr").value;
    var ph = document.getElementById("ph").value;
    var tok = genToken();
    pwd_hash = murmurhash3_32_gc(pwd, 124);
    var data = {
        name: name,
        email: email,
        pwd: pwd_hash.toString(),
        address: addr,
        mobile: ph,
        token: tok
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
          Materialize.toast(xhr.status, 4000);
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
          if (returnval.status==422) {
              Materialize.toast("Registration is not enabled.", 4000);
          }
          else if (returnval.status==403) {
            a = returnval;
            console.log(a);
            Materialize.toast("User not logged in", 4000);
          }
    }});
}
//register.html end ------------->
