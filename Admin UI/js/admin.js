var link = 'https://rajasthan-aanganwadi.herokuapp.com';
var currenttoken = '';

var genToken = function() {
                var text = "";
                var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
                for(var i = 0; i < 100; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
}
$(document).ready(function() {
    $(".button-collapse").sideNav();
    $("#loggedIn").show();
    $("#noLogin").hide();
    //sets navigation menu profile content
    // var currenttoken = Cookies.get('currenttoken');
    if (Cookies.get('currenttoken')) {
      $("#email_menu").text(Cookies.get('email'));
      $("#name_menu").text("Arjoonn Sharma");
      $("#profile_pic").attr('src',"https://avatars3.githubusercontent.com/u/7693265?v=4&s=400");
      $("#form_tab").show();
      $("#tabs").show();
      $("#loginDiv").hide();
    }
    else {
      out_changes();
    }
});

function out_changes() {
  $("#tabs").hide();
  $("#form_tab").hide();
  $("#loginDiv").show();
  $("#nav-mobile").hide();
  $("#sideLogin").hide();


  // $("#logout_menu_but").hide();
  // $("#logout_menu_butD").hide();
  // $("#login_menu_but").show();
  // $("#login_menu_butD").show();
}

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
            Cookies.set('currenttoken', tok);
            Cookies.set('email', email);
            Materialize.toast('Login Successful', 4000);
            $("#form_tab").show();
            $("#tabs").show();
            $("#loginDiv").hide();
            $("#nav-mobile").show();
            $("#sideLogin").show();
        }
    });

};

//<------------- Login begin
function logout() {
  $.ajax({
    url: (link + '/user/logout'),
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      "token": Cookies.get('currenttoken')
    }),
    success: function(data, st, xhr) {
      out_changes();
      if (xhr.status == 200) {
        Cookies.remove('currenttoken');
        Cookies.remove('email');
        Materialize.toast('User Logout Successful', 4000,'',function(){window.open("#!","_self")})
      }
    }
  });}
 // ---------------------------------logout----------

//Login end ------------->
