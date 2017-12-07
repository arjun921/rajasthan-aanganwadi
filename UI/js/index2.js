var link = 'https://rajasthan-aanganwadi.herokuapp.com';
// var link = 'http://192.168.225.163:8000';
var lastElem = "form";
var formslist = [];
var data;
var old_id = [];
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

$( document ).ajaxStart(function() {
  NProgress.start();
});

$(document).ajaxSuccess(function() {
  NProgress.done();
});

function createNav(id) {
  $('#navi').html('');
    $.ajax({
        url: (link + '/category'),
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({'catid': id}),
        success: function(data, st, xhr) {
          $('#navi').html('');
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
            // Cookies.remove('mediaCont');
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



function navClick(id) {
  $('#navi').html('');
  url = window.location.href.split('#')[0]
  url = url+'#'+id;
  window.location.href = url;
  if (id[0]=="_") {
      createNav(id);
  }
  else {
    $('#navi').html('');
    $('#content').show();
    load_content(id);
  }
  $("#_ROOT_").hide();
}

function loadSideMenu() {
  document.getElementById('subcontent').innerHTML = '';
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
          $('#subcontent').append(s);

        }
        s = "<li><div class=\"divider\"></div></li><li><a class=\"waves-effect \" href=\"index.html\"><i class=\"material-icons\">home</i>Home</a></li><li><a class=\"waves-effect \" href=\"#!\"><i class=\"material-icons\">settings</i>Settings</a></li><li><a class=\"waves-effect\" href=\"all_forms.html\"><i class=\"material-icons\">format_align_left</i>Forms to Fill</a></li><li><a class=\"waves-effect\" href=\"#!\" onclick=\"logout()\" id=\"logout_menu_but\"><i class=\"material-icons\">exit_to_app</i>Logout</a></li><li><a class=\"waves-effect\" href=\"login.html\" id=\"login_menu_but\"><i class=\"material-icons\">exit_to_app</i>Login</a></li>"
        $('#subcontent').append(s);
        $("#loggedIn").show();
        $("#noLogin").hide();
        //sets navigation menu profile content
        if (Cookies.get('currenttoken')) {
          $("#email_menu").text(Cookies.get('email'));
          $("#name_menu").text("Arjoonn Sharma");
          $("#profile_pic").show();
          $("#profile_pic").attr('src',"images/turban22.png");
          $("#login_menu_but").hide();
          $("#login_menu_butD").hide();
        }
        else {
          out_changes();
        }
      NProgress.set(1.0);
      }

    });
}

function reINT() {
  console.log(Cookies.get('mediaCont'));
  if (Cookies.get('mediaCont')) {
    window.history.back();
  }
  $("#profile_pic").hide();
  $('select').material_select();
  //enables nav
  $(".button-collapse").sideNav();
  //generates forms list
  //hides login/login based on cookie present/absent
  if (window.location.href.split('#').length==1) {
    createNav('_ROOT_');
  }
  else {
    navClick(window.location.href.split('#')[1]);
  }
  loadSideMenu();
  // doYourStuff();
}

$(document).ready(function() {
  reINT();
});

function out_changes() {
  $("#profile_pic").show();
  $("#profile_pic").attr('src',"images/empty-profile.gif");
  $("#loggedIn").hide();
  $("#logout_menu_but").hide();
  $("#logout_menu_butD").hide();
  $("#login_menu_but").show();
  $("#login_menu_butD").show();
  $("#name_menu").text(" ");
  $("#noLogin").show();
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
      ftype = (data.url.split('.').pop());

      if (ftype == "mp4") {
        $("#contentT").hide();
        p = "<video class=\"responsive-video\" style=\"width:100%; padding-top: 25px;\" controls><source src="+link+data.url+" type=\"video/mp4\"></video>"
        $('#content').append(p);
        p = "<div class=\"fixed-action-btn\" onclick=\"$('#content').html('');$('#contentCat').show();$('#content').hide();\"><a class=\"btn-floating btn-large red\" ><i class=\"large material-icons\">arrow_back</i></a></div>"
        $('#content').append(p);
      }
      else if (ftype=="mp3") {
        $("#contentT").hide();
        p = "<audio controls=\"controls\" style=\"width:100%; padding-top: 25px;\" id = \"player\"><source src = "+link+data.url+" /></audio>"
        $('#content').append(p);
        p = "<div class=\"fixed-action-btn\" onclick=\"$('#content').html('');$('#contentCat').show();$('#content').hide();\"><a class=\"btn-floating btn-large red\" ><i class=\"large material-icons\">arrow_back</i></a></div>"
        $('#content').append(p);
      }
      else if (ftype=="pdf") {
        window.open('https://docs.google.com/viewer?url='+link+data.url, '_self', 'location=yes');
      }

    },
    error: function(returnval) {
      if (returnval.status!=200) {
        var $toastContent = $('<span>Please Login to view.</span>').add($('<a href="../UI/login.html"><button class="btn-flat toast-action">OK</button></a>'));
        Materialize.toast($toastContent, 4000,'',function(){window.open("../UI/login.html","_self")})
      }

    }
  });
  //load form based on id requested
  // return create
}

//<Logout begins
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
        Materialize.toast('User Logout Successful', 4000,'',function(){window.open("../UI/index.html","_self")})
      }
    }
  });}


function doYourStuff() {
  if (window.location.href.split('#').length>1) {
    if (window.location.href.split('#')[1][0]=='_') {
      console.log(window.location.href.split('#')[1]);
      // console.log(window.location.href.split('#'));
      reINT();
      // navClick(window.location.href.split('#')[1]);
    }
  }
  else {
    reINT();
  }


}
window.onhashchange = function() { doYourStuff(); }
