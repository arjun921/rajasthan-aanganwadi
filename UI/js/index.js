var link = 'https://rajasthan-aanganwadi.herokuapp.com';
// var link = 'http://192.168.225.163:8000';
var lastElem = "form";
var formslist = [];
var data;
var old_id = [];
function createNav(id) {
  $('#navi').html('');
  if (id=="_up") {
    old_id.pop();
    createNav(old_id[old_id.length-1]);
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
          for (var i = 0; i < data.contains.length; i++) {
            item = data.contains[i];
            p = "<a class=\"collection-item\" onclick=\"navClick(this.id)\" id=\""+item.id+"\">"+item.title+"</a>";
            $('#navi').append(p);
          }
        }
      });
  }
}

function navClick(id) {
  if (id[0]=="_") {
    if (id!="_ROOT_") {
      createNav(id);
      p = "<a class=\"collection-item\" onclick=\"navClick('_up')\" id=\""+old_id[old_id.length-1]+"\">"+".. Go Up"+"</a>";
      $('#navi').append(p);
    }
    else {
      $('#navi').html('');
      createNav(id);
    }
  }
  else {
    load_content(id)
  }
  $("#_ROOT_").hide();
}


$(document).ready(function() {
  $('select').material_select();
  //enables nav
  $(".button-collapse").sideNav();
  //generates forms list
  //hides login/login based on cookie present/absent
  $("#loggedIn").show();
  $("#noLogin").hide();
  createNav('_ROOT_');
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
      }
      else if (ftype=="mp3") {
        $("#content_list").hide();
        p = "<audio controls=\"controls\" style=\"width:100%; padding-top: 25px;\" id = \"player\"><source src = "+link+data.url+" /></audio>"
        $('#content').append(p);
      }
      else if (ftype=="pdf") {
        window.open('https://docs.google.com/viewer?url='+link+data.url, '_self', 'location=yes');
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
        $("#navi").hide();
        p = "<video class=\"responsive-video\" style=\"width:100%; padding-top: 25px;\" controls><source src="+link+data.url+" type=\"video/mp4\"></video>"
        $('#content').append(p);
      }
      else if (ftype=="mp3") {
        $("#navi").hide();
        p = "<audio controls=\"controls\" style=\"width:100%; padding-top: 25px;\" id = \"player\"><source src = "+link+data.url+" /></audio>"
        $('#content').append(p);
      }
      else if (ftype=="pdf") {
        window.open('https://docs.google.com/viewer?url='+link+data.url, '_self', 'location=yes');
      }

    }
  });
  //load form based on id requested
  // return create
}
