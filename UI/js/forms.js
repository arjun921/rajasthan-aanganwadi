var link = 'https://rajasthan-aanganwadi.herokuapp.com';
//<------ Remove in production BEGIN
create = {
  'formid': 'f1',
  'title': 'form1',
  'fields': [{
      'id': '1',
      'label': 'name',
      'kind': 'text',
      'misc': []
    },
    {
      'id': '2',
      'label': 'name',
      'kind': 'text',
      'misc': []
    },
  ],
  "token": Cookies.get('currenttoken')
};

formslist = {
  'forms': [{
      'href': 'http://google.com',
      'name': 'Google'
    },
    {
      'href': 'http://facebook.com',
      'name': 'Facebook'
    },
    {
      'href': 'form1.html',
      'name': 'Form 1'
    },
  ]
}
//Remove in production ---------------------->

$(document).ready(function() {
  //enables nav
  $(".button-collapse").sideNav();
  //generates forms list
  create_list(formslist);
  //hides login/login based on cookie present/absent
  $("#loggedIn").show();
  $("#noLogin").hide();
  //sets navigation menu profile content
  if (Cookies.get('currenttoken')) {
    $("#email_menu").text(Cookies.get('email'));
    $("#name_menu").text("Arjoonn Sharma");
    $("#profile_pic").attr('src', "https://avatars3.githubusercontent.com/u/7693265?v=4&s=400");
    $("#login_menu_but").hide();
  } else {
    out_changes();
  }
});

function out_changes() {
  $("#profile_pic").attr('src', "images/empty-profile.gif");
  $("#loggedIn").hide();
  $("#logout_menu_but").hide();
  $("#login_menu_but").show();
  $("#name_menu").text(" ");
  $("#noLogin").show();
}


function load_list() {
  $.ajax({
    url: (link + '/form/list'),
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      "token": Cookies.get('currenttoken')
    }),
    success: function(data, st, xhr) {
      //run this code when forms list available
      alert(data);
      alert(st);
      alert(xhr);
      // if (xhr.status==200) {
      //   Materialize.toast("User Logout Successful", 4000);
      //   Cookies.remove('currenttoken');
      //   Cookies.remove('email');
      // }

    }
  });
}



function create_list(lis) {
  for (var i = 0; i < lis.forms.length; i++) {
    console.log(lis.forms[i]);
    href = lis.forms[i].href;
    name = lis.forms[i].name;
    var mydiv = document.getElementById("form_list");
    var aTag = document.createElement('a');
    aTag.setAttribute('href', href);
    aTag.setAttribute('class', "collection-item");
    aTag.innerHTML = name;
    mydiv.appendChild(aTag);

  }
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
        Materialize.toast("User Logout Successful", 4000);
        Cookies.remove('currenttoken');
        Cookies.remove('email');
      }

    }
  });

}; // ---------------------------------logout----------
