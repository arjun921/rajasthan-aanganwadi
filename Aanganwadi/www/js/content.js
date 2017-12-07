var link = 'https://rajasthan-aanganwadi.herokuapp.com';
medias = Cookies.get('media');
medias = JSON.parse(medias);

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
// Cookies.set('mediaCont', false);
$(document).ready(function() {
  window.history.pushState({page: 1}, "", "");
  window.onpopstate = function(event) {
  // "event" object seems to contain value only when the back button is clicked
  // and if the pop state event fires due to clicks on a button
  // or a link it comes up as "undefined"
  if(event){
window.open('index.html', '_self', 'location=yes');
  }
  else{
    // Continue user action through link or button
  }
}
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
      $("#profile_pic").attr('src',"https://avatars3.githubusercontent.com/u/7693265?v=4&s=400");
      $("#login_menu_but").hide();
      $("#login_menu_butD").hide();
    }
    else {
      out_changes();
    }


load_contentTabs();
});


function load_contentTabs() {
  for (var i = 0; i < medias.files.length; i++) {
    // file = s.files[i];
    file = medias.files[i];
    p = "<div class=\"col s6 m6 l6\" onclick=\"loadContent(this.id)\" id=\""+file.type+"\"><div class=\"card red accent-2\"><div class=\"card-content\"><span class=\"card-title white-text text-darken-4\">"+file.type.toUpperCase()+"</span></div></div></div>"
    // p = "<div class=\"col s6 m6 l6\"><div class=\"card red accent-2\"><div class=\"card-content\"><span class=\"card-title white-text text-darken-4\">"+file.type.toUpperCase()+"</span></div></div></div>"
    $('#contentCat').append(p);
  }
  // Cookies.remove('media');
}

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
function loadContent(type) {
  $('#contentT').show();
  $('#contentT').html('');
  $('#contentCat').hide();
  for (var i = 0; i < medias.files.length; i++) {
    if (type==medias.files[i].type) {
      filest = medias.files[i][type]

      for (var j = 0; j < filest.length; j++) {
        item = filest[j];
        p = "<a class=\"collection-item\" onclick=\"navClick(this.id)\" id=\""+item.id+"\">"+item.title+"</a>";
        $('#contentT').append(p);
      }
    }
  }

}


//<------------- Login begin
function logout(){
                $.ajax({
                    url: (link+'/user/logout'),
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify( {"token": Cookies.get('currenttoken')} ),
                    success: function(data, st, xhr){
                        out_changes();
                        if (xhr.status==200) {
                          Materialize.toast("User Logout Successful", 4000);
                          Cookies.remove('currenttoken');
                          Cookies.remove('email');
                        }

                    }
                });

            }; // ---------------------------------logout----------

//Login end ------------->
