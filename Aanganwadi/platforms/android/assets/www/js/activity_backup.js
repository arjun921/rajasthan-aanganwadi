var link = 'https://rajasthan-aanganwadi.herokuapp.com';
$(document).ready(function() {
    $(".button-collapse").sideNav();
    $("#loggedIn").show();
    $("#noLogin").hide();
    //sets navigation menu profile content
    // var currenttoken = Cookies.get('currenttoken');
    if (Cookies.get('currenttoken')) {
      $("#email_menu").text(Cookies.get('email'));
      $("#name_menu").text("Arjoonn Sharma");
      $("#profile_pic").attr('src',"https://avatars3.githubusercontent.com/u/7693265?v=4&s=400");
      $("#login_menu_but").hide();
    }
    else {
      out_changes();
    }
    $.ajax({
        url: (link+'/content/list'),
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify( {"token": Cookies.get('currenttoken')} ),
        success: function(data, st, xhr){
          
        }
    });
});

function out_changes() {
  $("#profile_pic").attr('src',"images/empty-profile.gif");
  $("#loggedIn").hide();
  $("#logout_menu_but").hide();
  $("#login_menu_but").show();
  $("#name_menu").text(" ");
  $("#noLogin").show();
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
