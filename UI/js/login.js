var currenttoken = '';
//runs functions to be executed at page load
$(document).ready(function() {
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); //to prevent form submission
    dologin();
});
    $(".button-collapse").sideNav();
          $("#preloader").hide();
          if (Cookies.get('currenttoken')) {
            window.open("../UI/index.html","_self")
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
    url='/user/login';
    sendData = { "email": email, "pwd": pws, "token": tok};
    apisuccess = function (data,st,xhr) {
        Cookies.set('currenttoken', tok);
        Cookies.set('email', email);
        Cookies.set('fname', data.name);
        Materialize.toast('Login Successful', 4000);
        window.open("../UI/index.html","_self")
    };
    apierror = function (returnval) {
      if (returnval.status==401) {
          Materialize.toast("Username or password incorrect", 4000);
      }
      $("#Main_Body").show();
      $("#preloader").hide();
    };
    hitApi(url,sendData,apisuccess,apierror);
};
