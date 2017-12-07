var link = 'https://rajasthan-aanganwadi.herokuapp.com';
$.ajaxSetup({
    timeout: 15000 //Time in milliseconds
});

$(document).ajaxError(function (event, jqXHR, options, thrownError) {
    if (thrownError== 'timeout') {
      NProgress.done();
      Materialize.toast('Timed Out', 4000);
        $("#preloader").hide();

    }
});
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
      $("#login_menu_but").hide();
      $("#login_menu_butD").hide();
    }
    else {
      out_changes();
    }
});

$( document ).ajaxStart(function() {
  NProgress.start();
});

$(document).ajaxSuccess(function() {
  NProgress.done();
});

function out_changes() {
  $("#profile_pic").attr('src',"images/empty-profile.gif");
  $("#loggedIn").hide();
  $("#logout_menu_but").hide();
  $("#logout_menu_butD").hide();
  $("#login_menu_but").show();
  $("#login_menu_butD").show();
  $("#name_menu").text(" ");
  $("#noLogin").show();
}


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
        Materialize.toast('User Logout Successful', 4000,'',function(){window.open("../UI/activity_bank.html","_self")})
      }
    }
  });}
 // ---------------------------------logout----------

//Login end ------------->
