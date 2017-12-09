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
  reINT()
    var hash = "asda"
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
  console.log(document.getElementById(id).innerHTML);
  $('#navi').html('');
  url = window.location.href.split('#')[0]+"#"+id;
  window.location.href = url;
  // if (id[0]=="_") {
  //   createNav(id);
  // }
  $("#_ROOT_").hide();
}
