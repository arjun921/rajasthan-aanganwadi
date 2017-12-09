var lastElem = "form";
var formslist = [];
var data;
var old_id = [];

function reINT() {
  $("#profile_pic").hide();
  $('select').material_select();
  //enables nav
  $(".button-collapse").sideNav();
  //generates forms list
  //hides login/login based on cookie present/absent
  if (window.location.href.split('#').length==1) {
    createNav('_ROOT_');
    document.getElementById('crumbtitle').innerHTML = "Home";
  }
  else {
    document.getElementById('crumbtitle').innerHTML = "Activity";
    if (location.hash.split(".").length<2) {
      createNav(window.location.href.split('#')[1]);
    } else {
      console.log("Load content");
      load_content(window.location.href.split('#')[1]);
    }

  }
  loadSideMenu();
}

window.onpageshow = function(event) {

    reINT();
};


window.onhashchange = change;

//and read location.hash in the change function instead
function change(){
  $('#content').html('');
  $('#contentCat').show();
  $('#content').hide();
  reINT()
    var hash = "asda"
}


function load_content(contentID) {
  $('#navi').html('');
  $('#content').show();
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
        p = "<video class=\"responsive-video\" style=\"width:100%; padding-top: 25px;\" controls><source src=" + link + data.url + " type=\"video/mp4\"></video>"
        $('#content').append(p);
        // p = "<div class=\"fixed-action-btn\" onclick=\"$('#content').html('');$('#contentCat').show();$('#content').hide();\"><a class=\"btn-floating btn-large red\" ><i class=\"large material-icons\">arrow_back</i></a></div>"
        // $('#content').append(p);
      } else if (ftype == "mp3"){
        p = "<p>"+contentID+"</p><audio controls=\"controls\" style=\"width:100%; padding-top: 25px;\" id = \"player\"><source src = " + link + data.url + " /></audio>"
        $('#content').append(p);
        // p = "<div class=\"fixed-action-btn\" onclick=\"$('#content').html('');$('#contentCat').show();$('#content').hide();\"><a class=\"btn-floating btn-large red\" ><i class=\"large material-icons\">arrow_back</i></a></div>"
        // $('#content').append(p);
      } else if (ftype == "pdf") {
        // "https://docs.google.com/viewer?srcid=[YOUR_FILE'S_ID_HERE]&pid=explorer&efh=false&a=v&chrome=false&embedded=true"
        flink = 'https://docs.google.com/viewer?url=' + link + data.url+"&pid=explorer&efh=false&a=v&chrome=false&embedded=true"
        console.log(flink);
        p = "<iframe src=\""+flink+"\" style=\"position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;\">Your browser doesn't support iframes</iframe>"
        // window.open('https://docs.google.com/viewer?url=' + link + data.url, '_self', 'location=yes');
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
  //load form based on id requested
  // return create
}


function createNav(id) {
  $('#navi').html('');
    $.ajax({
        url: (link + '/category'),
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({'catid': id}),
        success: function(data, st, xhr) {
              for (var i = 0; i < data.contains.length; i++) {
                item = data.contains[i];
                console.log(item);
                p = "<a class=\"collection-item\" onclick=\"navClick(this.id)\" id=\""+item.id+"\">"+item.title+"</a>";
                $('#navi').append(p);
              }
            }
      });

}


function navClick(id) {

  // console.log(id.split('.')[id.split('.').length-1]);

  $('#navi').html('');
  url = window.location.href.split('#')[0]+"#"+id;
  window.location.href = url;
  // if (id[0]=="_") {
  //   createNav(id);
  // }
  $("#_ROOT_").hide();
}
