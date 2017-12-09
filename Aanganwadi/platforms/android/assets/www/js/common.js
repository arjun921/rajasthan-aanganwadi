var link = 'https://rajasthan-aanganwadi.herokuapp.com';
// var link = 'http://192.168.0.2:8000';
$(document).ajaxStart(function() {
  NProgress.start();
});
$(document).ajaxSuccess(function() {
  NProgress.done();
});

$( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
  NProgress.done();
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

function out_changes() {
  $("#profile_pic").show();
  $("#profile_pic").attr('src', "images/empty-profile.gif");
  $("#loggedIn").hide();
  $("#logout_menu_but").hide();
  $("#login_menu_but").show();
  $("#name_menu").text(" ");
  $("#noLogin").show();
  Cookies.remove('currenttoken');
  Cookies.remove('email');
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
          window.open("index.html", "_self")
        })
      }
    }
  });
  out_changes();
}

function loadSideMenu() {
  $.ajax({
    url: (link + '/category'),
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      'catid': '_ROOT_'
    }),
    success: function(data, st, xhr) {
      for (var i = 0; i < data.contains.length; i++) {
        item = data.contains[i];
        // s = "<li><a class=\"dropdown-button\" onclick=\"$('.button-collapse').sideNav('hide');navClick(this.id)\" id=\""+item.id+"\">"+item.title+"</a></li>"
        s = "<li><a class=\"dropdown-button\" " + item.id + "\" onclick=\"$('.button-collapse').sideNav('hide');navClick(this.id);\" id=\"" + item.id + "\">" + item.title + "</a></li>"
        $('#mobile-demo').append(s);

      }
      s = "<li><div class=\"divider\"></div></li><li><a class=\"waves-effect \" href=\"index.html\"><i class=\"material-icons\">home</i>Home</a></li><li><a class=\"waves-effect \"  ><i class=\"material-icons\">settings</i>Settings</a></li><li><a class=\"waves-effect\" href=\"all_forms.html\"><i class=\"material-icons\">format_align_left</i>Forms to Fill</a></li><li><a class=\"waves-effect\"   onclick=\"logout()\" id=\"logout_menu_but\"><i class=\"material-icons\">exit_to_app</i>Logout</a></li><li><a class=\"waves-effect\" href=\"login.html\" id=\"login_menu_but\"><i class=\"material-icons\">exit_to_app</i>Login</a></li>"
      $('#mobile-demo').append(s);
      $("#loggedIn").show();
      $("#noLogin").hide();
      //sets navigation menu profile content
      if (Cookies.get('currenttoken')) {
        $("#email_menu").text(Cookies.get('email'));
        $("#name_menu").text("Arjoonn Sharma");
        $("#profile_pic").show();
        $("#profile_pic").attr('src', "images/turban22.png");
        $("#login_menu_but").hide();
      } else {
        out_changes();
      }
      NProgress.set(1.0);
    }

  });
}
