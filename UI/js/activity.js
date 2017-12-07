var link = 'https://rajasthan-aanganwadi.herokuapp.com';
// var link = 'http://192.168.225.163:8000';
var lastElem = "form";
var formslist = [];
var data;

function create_list() {
  $.ajax({
    url: (link + '/content/list'),
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      "token": Cookies.get('currenttoken')
    }),
    success: function(data, st, xhr) {

      for (var i = 0; i < data.contents.length; i++) {
        title = data.contents[i].title;
        fname = data.contents[i].fname;
        var mydiv = document.getElementById("content_list");
        var aTag = document.createElement('a');
        // aTag.setAttribute('href', href);
        aTag.setAttribute('class', "collection-item");
        aTag.setAttribute('onclick', 'load_content(this.id)')
        aTag.setAttribute('id', fname);
        aTag.innerHTML = title;
        mydiv.appendChild(aTag);
      }
    },
    error: function(returnval) {
      if (returnval.status!=200) {
        var $toastContent = $('<span>Please Login to view.</span>').add($('<a href="../UI/login.html"><button class="btn-flat toast-action">OK</button></a>'));
Materialize.toast($toastContent, 4000,'',function(){window.open("../UI/login.html","_self")})
      }
    }
  });
}
$( document ).ajaxStart(function() {
  NProgress.start();
});

$(document).ajaxSuccess(function() {
  NProgress.done();
});

$(document).ready(function() {
  $('select').material_select();
  //enables nav
  $(".button-collapse").sideNav();
  //generates forms list
  create_list();
  //hides login/login based on cookie present/absent
  $("#loggedIn").show();
  $("#noLogin").hide();
  //sets navigation menu profile content
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



function load_content(contentID) {
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
        $("#content_list").hide();
        p = "<video class=\"responsive-video\" style=\"width:100%; padding-top: 25px;\" controls><source src="+link+data.url+" type=\"video/mp4\"></video>"
        $('#content').append(p);
        console.log("My video player works!");
      }
      else if (ftype=="mp3") {
        $("#content_list").hide();
        p = "<audio controls=\"controls\" style=\"width:100%; padding-top: 25px;\" id = \"player\"><source src = "+link+data.url+" /></audio>"
        $('#content').append(p);
        console.log("My music player works!");
      }
      else if (ftype=="pdf") {
        window.open('https://docs.google.com/viewer?url='+link+data.url, '_self', 'location=yes');
        console.log("My pdf is loading!!!!!!!!!!");
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
        Materialize.toast('User Logout Successful', 4000,'',function(){window.open("../UI/activity_bank.html","_self")})
      }
    }
  });}
// ---------------------------------logout----------
