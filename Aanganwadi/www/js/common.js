var link = 'https://rajasthan-aanganwadi.herokuapp.com';
// var link = 'http://192.168.0.2:8000';


function nextSpinner(){
    var spinners="⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
    var index = spinners.indexOf(document.getElementById("spinner").textContent);
    if(index == -1){index = 0}
    index = (index + 1) % spinners.length;
    document.getElementById("spinner").textContent = spinners[index];
}

$(document).ajaxStart(function() {
  spinid = setInterval(nextSpinner, 50);
  $("#spinner").show();
});
$(document).ajaxSuccess(function() {
  clearInterval(spinid);
  $("#spinner").hide();
});


$( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
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

var genToken = function() {
                var text = "";
                var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
                for(var i = 0; i < 100; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
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

//source https://github.com/garycourt/murmurhash-js/blob/master/murmurhash3_gc.js
function murmurhash3_32_gc(key, seed) {
    var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

    remainder = key.length & 3; // key.length % 4
    bytes = key.length - remainder;
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;

    while (i < bytes) {
        k1 =
            ((key.charCodeAt(i) & 0xff)) |
            ((key.charCodeAt(++i) & 0xff) << 8) |
            ((key.charCodeAt(++i) & 0xff) << 16) |
            ((key.charCodeAt(++i) & 0xff) << 24);
        ++i;

        k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

        h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
        h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
        h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    k1 = 0;

    switch (remainder) {
        case 3:
            k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        case 2:
            k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        case 1:
            k1 ^= (key.charCodeAt(i) & 0xff);

            k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= k1;
    }

    h1 ^= key.length;

    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
}

function checkLogin() {
  if (Cookies.get('currenttoken')) {
    $("#email_menu").text(Cookies.get('email'));
    $("#name_menu").text("Arjoonn Sharma");
    document.getElementById("formLink").href = "all_forms.html";
    $("#profile_pic").show();
    $("#profile_pic").attr('src', "images/turban22.png");
    $("#login_menu_but").hide();
  } else {
    out_changes();
  }
}

function loadSideMenu() {
  checkLogin();
  $.ajax({
    url: (link + '/category'),
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      'catid': '_ROOT_'
    }),
    success: function(data, st, xhr) {
      $('#submen').html('');
      for (var i = 0; i < data.contains.length; i++) {
        item = data.contains[i];
        s = "<li><a class=\"dropdown-button\" " + item.id + "\" onclick=\"$('.button-collapse').sideNav('hide');navClick(this.id);\" id=\"" + item.id + "\">" + item.title + "</a></li>"
        $('#submen').append(s);
      }
    }
  });
}

function out_changes() {
  $("#email_menu").text("User not Logged In");
  $("#name_menu").text(" ");
  $("#profile_pic").show();
  $("#profile_pic").attr('src', "images/empty-profile.gif");
  $("#logout_menu_but").hide();
  $("#login_menu_but").show();
  document.getElementById("formLink").href = "login.html"
  Cookies.remove('currenttoken');
  Cookies.remove('email');
}
