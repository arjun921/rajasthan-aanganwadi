var lastElem = "form";
var formslist = [];
var data;
var old_id = [];

function createNav(id) {
  $('#navi').html('');
  if (id=="_up") {
    old_id.pop();
    createNav(old_id[old_id.length-1]);
    $('#content').html('');
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
          // console.log(data.contains);
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
            Cookies.remove('mediaCont');
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
}


function navClick(id) {
  $('#navi').html('');
  url = window.location.href.split('#')[0]+"#"+id;
  console.log(url);
  window.location.href = url;
  if (id[0]=="_") {
    createNav(id);
  }
  $("#_ROOT_").hide();
}

function reINT() {
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
    createNav(window.location.href.split('#')[1]);
  }
  loadSideMenu();
}

window.onpageshow = function(event) {
    reINT();
};


window.onhashchange = change;

//and read location.hash in the change function instead
function change(){
    var hash = "asda"
    hash = location.hash;
    if (hash=="") {
      console.log("Hash Empty");
      reINT()
    }
    else {
      reINT()
    }
    console.log(hash);

}
