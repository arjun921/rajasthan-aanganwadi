var link = 'https://rajasthan-aanganwadi.herokuapp.com';
// var link = 'http://192.168.0.2:8000';
spinid = setInterval(nextSpinner, 60);
$("#spinner").show();
$('.tooltipped').tooltip({delay: 50});
$('.modal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '4%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
    },
    complete: function() { $('.button-collapse').sideNav('hide'); window.location.href = window.location.href;} // Callback for Modal close
  });
$("#profile_pic").hide();
$(".button-collapse").sideNav();
$('select').material_select();
loadSideMenu();
function resetApp() {
  data = Cookies.getJSON();
  for (var key in data) {
    Cookies.remove(key);
  }
  window.location.href = "index.html";
}

function nextSpinner(){
    var spinners="⣷⣯⣟⡿⢿⣻⣽⣾";
    var index = spinners.indexOf(document.getElementById("spinner").textContent);
    if(index == -1){index = 0}
    index = (index + 1) % spinners.length;
    document.getElementById("spinner").textContent = spinners[index];
}

$(document).ajaxStart(function() {
  spinid = setInterval(nextSpinner, 60);
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
            clearInterval(spinid);
            $("#spinner").hide();
            Materialize.toast('Connectivity Issue', 4000);
  }
  else {
            // something weird is happening
  }
});

function genToken() {
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
    $("#loginStatus").attr("data-tooltip","Logged in");
    $("#email_menu").text(Cookies.get('email'));
    $("#name_menu").text(Cookies.get('fname'));
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
  $.ajax({
    url: (link + '/category'),
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      'catid': '_ROOT_'
    }),
    success: function(data, st, xhr) {
      $('#submen').html('');
      for (var i = 0; i < data.contains.length; i++) {
        item = data.contains[i];
        s = "<li><a class=\"dropdown-button\" " + item.id + "\" onclick=\"$('.button-collapse').sideNav('hide');navClick(this.id);\" id=\"" + item.id + "\">" + item.title + "</a></li>"
        $('#submen').append(s);
      }
    }
  });
}

function out_changes() {
  $("#loginStatus").addClass('deep-orange-text');
  $("#loginStatus").removeClass('green-text');
  $("#loginStatus").attr("data-tooltip","Not Logged in");
  $("#email_menu").text("User not Logged In");
  $("#name_menu").text(" ");
  $("#profile_pic").show();
  $("#profile_pic").attr('src', "images/empty-profile.gif");
  $("#logout_menu_but").hide();
  $("#login_menu_but").show();
  document.getElementById("formLink").href = "login.html"
  Cookies.remove('currenttoken');
  Cookies.remove('email');
  Cookies.remove('fname');
}
