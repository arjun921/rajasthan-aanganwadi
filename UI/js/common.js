var link = 'https://rajasthan-aanganwadi.herokuapp.com';
// var link = 'http://192.168.0.2:8000';
$('.tooltipped').tooltip({delay: 50});

function nextSpinner(){
    var spinners="⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
    var index = spinners.indexOf(document.getElementById("spinner").textContent);
    if(index == -1){index = 0}
    index = (index + 1) % spinners.length;
    document.getElementById("spinner").textContent = spinners[index];
}

$(document).ajaxStart(function() {
  spinid = setInterval(nextSpinner, 50);
  $("#spinner").show();
});
$(document).ajaxSuccess(function() {
  clearInterval(spinid);
  $("#spinner").hide();
});


$( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
  if (jqxhr.readyState == 4) {
            // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)
  }
  else if (jqxhr.readyState == 0) {
            // Network error (i.e. connection refused, access denied due to CORS, etc.)
            Materialize.toast('Connectivity Issue', 4000);
  }
  else {
            // something weird is happening
  }
});

var genToken = function() {
                var text = "";
                var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
                for(var i = 0; i < 100; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
}




function logout() {
  $.ajax({
    url: (link + '/user/logout'),
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      "token": Cookies.get('currenttoken')
    }),
    success: function(data, st, xhr) {
      if (xhr.status == 200) {
        Materialize.toast('User Logout Successful', 4000, '', function() {

          window.open("../UI/index.html", "_self")
        })
      }
    }
  });
  out_changes();
}

function checkLogin() {
  if (Cookies.get('currenttoken')) {
    $("#loginStatus").removeClass('deep-orange-text text-accent-3');
    $("#loginStatus").addClass('green-text text-accent-3');
    $("#email_menu").text(Cookies.get('email'));
    $("#name_menu").text("Arjoonn Sharma");
    document.getElementById("formLink").href = "all_forms.html";
    $("#profile_pic").show();
    $("#profile_pic").attr('src', "images/turban22.png");
    $("#login_menu_but").hide();
    return true;
  } else {
    out_changes();
    return false;
  }
}

function loadSideMenu() {
  checkLogin();
  //##########Uncomment to enable sidebar activities
  // $.ajax({
  //   url: (link + '/category'),
  //   type: 'post',
  //   contentType: 'application/json',
  //   data: JSON.stringify({
  //     'catid': '_ROOT_'
  //   }),
  //   success: function(data, st, xhr) {
  //     $('#submen').html('');
  //     for (var i = 0; i < data.contains.length; i++) {
  //       item = data.contains[i];
  //       s = "<li><a class=\"dropdown-button\" " + item.id + "\" onclick=\"$('.button-collapse').sideNav('hide');navClick(this.id);\" id=\"" + item.id + "\">" + item.title + "</a></li>"
  //       $('#submen').append(s);
  //     }
  //   }
  // });
}

function out_changes() {
  $("#loginStatus").addClass('deep-orange-text');
  $("#loginStatus").removeClass('green-text');
  $("#email_menu").text("User not Logged In");
  $("#name_menu").text(" ");
  $("#profile_pic").show();
  $("#profile_pic").attr('src', "images/empty-profile.gif");
  $("#logout_menu_but").hide();
  $("#login_menu_but").show();
  document.getElementById("formLink").href = "login.html"
  Cookies.remove('currenttoken');
  Cookies.remove('email');
}
