window.onpageshow = function(event) {
  document.getElementById('crumbtitle').innerHTML = "Activity"
    reINT();
};

window.onhashchange = change;


function change(){
  $('#content').html('');
  $('#content').hide();
  reINT();
}

function reINT() {
  // $('.modal').modal();
  $('.modal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
      },
      complete: function() { $('.button-collapse').sideNav('hide'); window.location.href = window.location.href;} // Callback for Modal close
    });
  $('#preloader').hide();
  $("#profile_pic").hide();
  $('select').material_select();
  $(".button-collapse").sideNav();
  if (window.location.href.split('#').length==1) {
    createNav('_ROOT_');
    document.getElementById('crumbtitle').innerHTML = "Home";
  }
  else {
    if (window.location.href.split('#')[1]=="help") {

      }
      else if (location.hash.split(".").length<2 ) {
      createNav(window.location.href.split('#')[1]); 
      }
    else {
      if (Cookies.get('currenttoken')) {
        load_content(window.location.href.split('#')[1]);
        document.getElementById('docIframe').onload = function() {
          $('#preloader').hide();
        }
      }
      else {
        window.location.href = "login.html";
      }

    }
  }
  loadSideMenu();
}

function load_content(contentID) {
  $('#preloader').show();
  $('#navi').html('');
  $('#crumbtitle').html("Loading file");
  $.ajax({
    url: (link + '/content'),
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      "token": Cookies.get('currenttoken'),
      'fname': contentID
    }),
    success: function(data, st, xhr) {

      $('#content').show();
      $('#content').html('');
      $('#crumbtitle').html(contentID);
      ftype = (data.url.split('.').pop());
      if (ftype == "mp4") {
        p = "<video class=\"responsive-video\" style=\"width:100%; padding-top: 25px;\" controls><source src=" + link + data.url + " type=\"video/mp4\"></video>"
        $('#preloader').hide();
        $('#content').append(p);
      } else if (ftype == "mp3"){
        p = "<p></p><audio controls=\"controls\" style=\"width:100%; padding-top: 25px;\" id = \"player\"><source src = " + link + data.url + " /></audio>"
        $('#preloader').hide();
        $('#content').append(p);
      } else if (ftype == "pdf") {
        flink = 'https://docs.google.com/viewer?url=' + link + data.url+"&pid=explorer&efh=false&a=v&chrome=false&embedded=true"
        p = "<iframe src=\""+flink+"\" id=\"docIframe\" style=\"position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;\">Your browser doesn't support iframes</iframe>"
        $('#content').append(p);
      }
    },
    error: function(returnval) {
      if (returnval.status != 200) {
        out_changes();
        var $toastContent = $('<span>Please Login to view.</span>').add($('<a href="login.html"><button class="btn-flat toast-action">OK</button></a>'));
        Materialize.toast($toastContent, 4000, '', function() {
          window.open("login.html", "_self")
        })
      }
    }
  });
}

function createNav(id) {
    $.ajax({
        url: (link + '/category'),
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({'catid': id}),
        success: function(data, st, xhr) {
              $('#navi').html('');
              $('#crumbtitle').html(data.title);
              for (var i = 0; i < data.contains.length; i++) {
                item = data.contains[i];
                p = "<a class=\"collection-item\" onclick=\"navClick(this.id)\" id=\""+item.id+"\">"+item.title+"</a>";
                $('#navi').append(p);
              }
            }
      });
}

function navClick(id) {
  // document.getElementById('crumbtitle').innerHTML = document.getElementById(id).innerHTML;
  url = window.location.href.split('#')[0]+"#"+id;
  window.location.href = url;
}
