var link = 'https://rajasthan-aanganwadi.herokuapp.com';
// var link = 'http://192.168.225.163:8000';
var lastElem = "form";
var formslist = [];
var data;

function create_list() {
  $.ajax({
    url: (link + '/content/list'),
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      "token": Cookies.get('currenttoken')
    }),
    success: function(data, st, xhr) {
      console.log(data.contents);
      for (var i = 0; i < data.contents.length; i++) {
        title = data.contents[i].title;
        fname = data.contents[i].fname;
        var mydiv = document.getElementById("content_list");
        var aTag = document.createElement('a');
        // aTag.setAttribute('href', href);
        aTag.setAttribute('class', "collection-item");
        aTag.setAttribute('onclick', 'load_form(this.innerHTML)')
        aTag.innerHTML = title;
        mydiv.appendChild(aTag);
      }
    }
  });
}

$(document).ready(function() {
  $('select').material_select();
  //enables nav
  $(".button-collapse").sideNav();
  //generates forms list
  create_list();
  //hides login/login based on cookie present/absent
  $("#loggedIn").show();
  $("#noLogin").hide();
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





function load_form(formID) {
  $.ajax({
    url: (link + '/form'),
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      "token": Cookies.get('currenttoken'),
      'formid': formID
    }),
    success: function(data, st, xhr) {
      data = data;
      create_form(data);
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
        Materialize.toast("User Logout Successful", 4000);
        Cookies.remove('currenttoken');
        Cookies.remove('email');
      }
    }
  });
} // ---------------------------------logout----------


function doSubmit() {
  fields_returned = JSON.parse(Cookies.get('fields_returned'));
  dataRet = {}
  data = []
  dataRet['token'] = Cookies.get('currenttoken');
  dataRet['formid'] = fields_returned.formid;
  for (var i = 0; i < fields_returned.fields.length; i++) {
    temp = fields_returned.fields[i];
    id = temp.id;
    val = {}
    if ((temp.kind == 'text') || (temp.kind == 'select') || (temp.kind == 'range') || (temp.kind == 'datepicker') || (temp.kind == 'timepicker')) {
      val['id'] = id;
      val['value'] = document.getElementById(id).value;

    } else if (temp.kind == 'radio') {
      s = "input[name='" + id + "']:checked"
      val['id'] = id;
      val['value'] = $(s).val();

    } else if (temp.kind == 'checkbox') {
      te = []
      for (var j = 0; j < temp.misc.length; j++) {
        myVals = {};
        myVals["id"] = temp.misc[j].subID;
        myVals["value"] = String(document.getElementById(temp.misc[j].subID).checked);
        te.push(myVals);
      }
      val['id'] = id;
      val['value'] = "";
      console.log(te);
      val['misc'] = te;

    }
    data.push(val)

  }
  dataRet['data'] = data;
  if (typeof Cookies.get('currenttoken') !== 'undefined') {
    $.ajax({
      url: (link + '/form/submit'),
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify(dataRet),
      success: function(data, st, xhr) {
        alert(data);
        alert(st);
        alert(xhr);
        alert(xhr.status);
        // if (xhr.status==200) {
        //   Materialize.toast("User Logout Successful", 4000);
        //   Cookies.remove('currenttoken');
        //   Cookies.remove('email');
        // }

      }
    });
  }
}
