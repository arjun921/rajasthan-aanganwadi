var currenttoken = '';
//runs functions to be executed at page load
$(document).ready(function() {
    $(".button-collapse").sideNav();
          $("#preloader").hide();
          if (Cookies.get('currenttoken')) {
            window.open("index.html","_self")
          }

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

function dologin(){
    $("#Main_Body").hide();
    $("#preloader").show();
    var email = $('#emailinput').val();
    var pwd = $("#pwdinput").val();
    pwd = murmurhash3_32_gc(pwd,24);
    pws =  pwd.toString();
    var tok = genToken();
    $.ajax({
        url: (link+'/user/login'),
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify( { "email": email, "pwd": pws, "token": tok} ),
        success: function(data, st, xhr){
            Cookies.set('currenttoken', tok);
            Cookies.set('email', email);
            Cookies.set('fname', data.name);
            Materialize.toast('Login Successful', 4000);
            window.open("index.html","_self")
        },
        error: function(returnval) {
          if (returnval.status==401) {
              Materialize.toast("Username or password incorrect", 4000);
          }
          $("#Main_Body").show();
          $("#preloader").hide();
        }
    });
};
