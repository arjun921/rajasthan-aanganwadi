var link = 'https://rajasthan-aanganwadi.herokuapp.com';
// var link = 'http://192.168.225.163:8000';
var lastElem = "form";
var formslist = [];
var data;
var old_id = [];

$( document ).ajaxStart(function() {
  NProgress.start();
});

$(document).ajaxSuccess(function() {
  NProgress.done();
});
// $( ".trigger" ).click(function() {
//   console.log("Ajax End");
// });

function createNav(id) {
  $('#navi').html('');
  if (id=="_up") {
    old_id.pop();
    createNav(old_id[old_id.length-1]);
    $('#content').html('');
  }
  else {

    $.ajax({
        url: (link + '/category'),
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({'catid': id}),
        success: function(data, st, xhr) {
          if ($.inArray(data.id, old_id)==-1) {
            old_id.push(data.id);
          }
          // console.log(data.contains);
          var files = [];
          for (var i = 0; i < data.contains.length; i++) {
            cont = data.contains[i];
            if (cont.id[0]!='_') {
              ftype = cont.id.split('.').pop();
              file = {}
              file[ftype] = [data.contains[i]];
              file['type'] = ftype;
              files.push(file)
                Cookies.set('mediaCont', true);
                Cookies.set('media', { files});
              }
            }

          if (Cookies.get('mediaCont')) {
            s = Cookies.get('media');
            s = JSON.parse(s);
            Cookies.remove('mediaCont');
            window.open('content.html', '_self', 'location=yes');
          }
          else {
            for (var i = 0; i < data.contains.length; i++) {
              item = data.contains[i];
              p = "<a class=\"collection-item\" onclick=\"navClick(this.id)\" id=\""+item.id+"\">"+item.title+"</a>";
              $('#navi').append(p);
            }
          }
        }
      });
  }
}



function navClick(id) {
  $('#navi').html('');
  if (id[0]=="_") {
    if (id!="_ROOT_") {
      createNav(id);
      p = "<a class=\"collection-item\" onclick=\"navClick('_up')\" id=\""+old_id[old_id.length-1]+"\">"+".. Go Up"+"</a>";
      $('#navi').append(p);
    }
    else {
      createNav(id);
    }
  }
  $("#_ROOT_").hide();
}

function loadSideMenu() {
  $.ajax({
      url: (link + '/category'),
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify({'catid': '_ROOT_'}),
      success: function(data, st, xhr) {
        for (var i = 0; i < data.contains.length; i++) {
          item = data.contains[i];
          // s = "<li><a class=\"dropdown-button\" onclick=\"$('.button-collapse').sideNav('hide');navClick(this.id)\" id=\""+item.id+"\">"+item.title+"</a></li>"
          s = "<li><a class=\"dropdown-button\" href=\"index.html#"+item.id+"\" onclick=\"$('.button-collapse').sideNav('hide');\" id=\"" + item.id + "\">" + item.title + "</a></li>"
          $('#mobile-demo').append(s);

        }
        s = "<li><div class=\"divider\"></div></li><li><a class=\"waves-effect \" href=\"index.html\"><i class=\"material-icons\">home</i>Home</a></li><li><a class=\"waves-effect \" href=\"#!\"><i class=\"material-icons\">settings</i>Settings</a></li><li><a class=\"waves-effect\" href=\"all_forms.html\"><i class=\"material-icons\">format_align_left</i>Forms to Fill</a></li><li><a class=\"waves-effect\" href=\"#!\" onclick=\"logout()\" id=\"logout_menu_but\"><i class=\"material-icons\">exit_to_app</i>Logout</a></li><li><a class=\"waves-effect\" href=\"login.html\" id=\"login_menu_but\"><i class=\"material-icons\">exit_to_app</i>Login</a></li>"
        $('#mobile-demo').append(s);
        $("#loggedIn").show();
        $("#noLogin").hide();
        //sets navigation menu profile content
        if (Cookies.get('currenttoken')) {
          $("#email_menu").text(Cookies.get('email'));
          $("#name_menu").text("Arjoonn Sharma");
          $("#profile_pic").show();
          $("#profile_pic").attr('src',"images/turban22.png");
          $("#login_menu_but").hide();
        }
        else {
          out_changes();
        }
      NProgress.set(1.0);
      }

    });
}

function reINT() {
  $("#profile_pic").hide();
  $('select').material_select();
  //enables nav
  $(".button-collapse").sideNav();
  //generates forms list
  //hides login/login based on cookie present/absent
  if (window.location.href.split('#').length==1) {
    createNav('_ROOT_');
  }
  loadSideMenu();
}

$(document).ready(function() {
  reINT();
});

function out_changes() {
  $("#profile_pic").show();
  $("#profile_pic").attr('src',"images/empty-profile.gif");
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
        Materialize.toast('User Logout Successful', 4000,'',function(){window.open("../UI/index.html","_self")})
      }
    },
    error: function(returnval) {
      NProgress.done();
    }
  });
  out_changes();
}
