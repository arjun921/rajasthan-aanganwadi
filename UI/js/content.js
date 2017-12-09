var link = 'https://rajasthan-aanganwadi.herokuapp.com';
medias = Cookies.get('media');
medias = JSON.parse(medias);
$(document).ready(function() {
  loadSideMenu();
  $(".button-collapse").sideNav();
  $("#loggedIn").show();
  $("#noLogin").hide();
  $('#contentT').hide();
  $('#content').hide();
  $('#navi').hide();
  //sets navigation menu profile content
  // var currenttoken = Cookies.get('currenttoken');
  if (Cookies.get('currenttoken')) {
    $("#email_menu").text(Cookies.get('email'));
    $("#name_menu").text("Arjoonn Sharma");
    $("#profile_pic").attr('src', "https://avatars3.githubusercontent.com/u/7693265?v=4&s=400");
    $("#login_menu_but").hide();
  } else {
    out_changes();
  }
  load_contentTabs();
});


function load_contentTabs() {
  for (var i = 0; i < medias.files.length; i++) {
    // file = s.files[i];
    file = medias.files[i];
    p = "<div class=\"col s6 m6 l6\" onclick=\"loadContent(this.id)\" id=\"" + file.type + "\"><div class=\"card red accent-2\"><div class=\"card-content\"><span class=\"card-title white-text text-darken-4\">" + file.type.toUpperCase() + "</span></div></div></div>"
    // p = "<div class=\"col s6 m6 l6\"><div class=\"card red accent-2\"><div class=\"card-content\"><span class=\"card-title white-text text-darken-4\">"+file.type.toUpperCase()+"</span></div></div></div>"
    $('#contentCat').append(p);
  }
  // Cookies.remove('media');
}


function loadContent(type) {
  $('#contentT').show();
  $('#contentT').html('');
  $('#contentCat').hide();
  for (var i = 0; i < medias.files.length; i++) {
    if (type == medias.files[i].type) {
      filest = medias.files[i][type]

      for (var j = 0; j < filest.length; j++) {
        item = filest[j];
        p = "<a class=\"collection-item\" onclick=\"navClick(this.id)\" id=\"" + item.id + "\">" + item.title + "</a>";
        $('#contentT').append(p);
      }
    }
  }

}


//new
function navClick(id) {
  $('#navi').html('');
  if (id[0] == "_") {
    if (id != "_ROOT_") {
      createNav(id);
      p = "<a class=\"collection-item\" onclick=\"navClick('_up')\" id=\"" + old_id[old_id.length - 1] + "\">" + ".. Go Up" + "</a>";
      $('#navi').append(p);
    } else {
      createNav(id);
    }
  } else {
    $('#navi').html('');
    $('#content').show();
    load_content(id);
  }
  $("#_ROOT_").hide();
}


function load_content(contentID) {
  $('#content').html('');
  $.ajax({
    url: (link + '/content'),
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      "token": Cookies.get('currenttoken'),
      'fname': contentID
    }),
    success: function(data, st, xhr) {
      data = data;
      d = data;
      ftype = (data.url.split('.').pop());

      if (ftype == "mp4") {
        $("#contentT").hide();
        p = "<video class=\"responsive-video\" style=\"width:100%; padding-top: 25px;\" controls><source src=" + link + data.url + " type=\"video/mp4\"></video>"
        $('#content').append(p);
        p = "<div class=\"fixed-action-btn\" onclick=\"$('#content').html('');$('#contentCat').show();$('#content').hide();\"><a class=\"btn-floating btn-large red\" ><i class=\"large material-icons\">arrow_back</i></a></div>"
        $('#content').append(p);
      } else if (ftype == "mp3") {
        $("#contentT").hide();
        p = "<audio controls=\"controls\" style=\"width:100%; padding-top: 25px;\" id = \"player\"><source src = " + link + data.url + " /></audio>"
        $('#content').append(p);
        p = "<div class=\"fixed-action-btn\" onclick=\"$('#content').html('');$('#contentCat').show();$('#content').hide();\"><a class=\"btn-floating btn-large red\" ><i class=\"large material-icons\">arrow_back</i></a></div>"
        $('#content').append(p);
      } else if (ftype == "pdf") {
        window.open('https://docs.google.com/viewer?url=' + link + data.url, '_self', 'location=yes');
      }

    },
    error: function(returnval) {
      if (returnval.status != 200) {
        var $toastContent = $('<span>Please Login to view.</span>').add($('<a href="../UI/login.html"><button class="btn-flat toast-action">OK</button></a>'));
        Materialize.toast($toastContent, 4000, '', function() {
          window.open("../UI/login.html", "_self")
        })
      }

    }
  });
  //load form based on id requested
  // return create
}

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
        Materialize.toast('User Logout Successful', 4000,'',function(){window.open("../UI/index.html","_self")})
      }
    },
    error: function(returnval) {
      NProgress.done();
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
        s = "<li><a class=\"dropdown-button\" href=\"index.html#" + item.id + "\" onclick=\"$('.button-collapse').sideNav('hide');\" id=\"" + item.id + "\">" + item.title + "</a></li>"
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
        $("#profile_pic").attr('src', "images/turban22.png");
        $("#login_menu_but").hide();
      } else {
        out_changes();
      }
      NProgress.set(1.0);
    }
  });
}

$(document).ajaxStart(function() {NProgress.start();});

$(document).ajaxSuccess(function() {NProgress.done();});
