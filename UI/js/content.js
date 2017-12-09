// $('#contentCat').hide();
medias = Cookies.get('media');
medias = JSON.parse(medias);


$(document).ready(function() {
  window.history.pushState({page: 1}, "", "");
 window.onpopstate = function(event) {
 // "event" object seems to contain value only when the back button is clicked
 // and if the pop state event fires due to clicks on a button
 // or a link it comes up as "undefined"
 if(event){
// window.open('index.html', '_self', 'location=yes');
window.history.go(-2);
 }
 else{
   // Continue user action through link or button
 }
}

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
    $("#profile_pic").attr('src', "images/empty-profile.gif");
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
  $('#contentCat').hide();
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
        out_changes();
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
