var link = 'https://rajasthan-aanganwadi.herokuapp.com';
// var link = 'http://192.168.225.163:8000';
var lastElem = "form";
var formslist = [];
var data;

function create_list() {
  $.ajax({
    url: (link + '/form/list'),
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      "token": Cookies.get('currenttoken')
    }),
    success: function(data, st, xhr) {
      for (var i = 0; i < data.forms.length; i++) {
        name = data.forms[i]
        var mydiv = document.getElementById("form_list");
        var aTag = document.createElement('a');
        // aTag.setAttribute('href', href);
        aTag.setAttribute('class', "collection-item");
        aTag.setAttribute('onclick', 'load_form(this.innerHTML)')
        aTag.innerHTML = name;
        mydiv.appendChild(aTag);
      }
    },
    error: function(returnval) {
      if (returnval.status!=200) {
        var $toastContent = $('<span>You need to be logged in to view this</span>').add($('<a href="../UI/login.html"><button class="btn-flat toast-action">OK</button></a>'));
Materialize.toast($toastContent, 4000,'',function(){window.open("../UI/login.html","_self")})
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



//hides all forms list.
function hide_allForms() {
  $("#form_list").hide();
}

function create_newElem(field) {
  console.log(field);
  if (field.kind == 'text') {
    s = "<div class=\"input-field col s6\"><input id=" + field.id + " type=\"text\" " + "><label for=" + field.id + ">" + field.label + "</label></div>"
    // s = "<div class=\"input-field col s6\"><input id=" + field.id + " type=" + field.misc[0].spec + "><label for=" + field.id + ">" + field.label + "</label></div>"
    $('#' + lastElem).append(s);
  } else if (field.kind == 'radio') {
    p = "<p>" + field.label + "</p>"
    $('#' + lastElem).append(p);
    for (var i = 0; i < field.misc.length; i++) {
      va = field.misc[i];
      prb = "<p>  <input name=" + field.id + " type=\"radio\" id=" + va.subID + " value=" + va.subID + " />  <label for=" + va.subID + ">" + va.subLabel + "</label></p>"
      $('#' + lastElem).append(prb);
    }
  } else if (field.kind == 'checkbox') {
    p = "<p>" + field.label + "</p>"
    $('#' + lastElem).append(p);
    for (var i = 0; i < field.misc.length; i++) {
      cbv = field.misc[i];
      s = "<p><input type=\"checkbox\" id=" + cbv.subID + " /><label for=" + cbv.subID + ">" + cbv.subLabel + "</label></p>"
      $('#' + lastElem).append(s);
    }
  } else if (field.kind == 'select') {
    p = "<p>" + field.label + "</p>"
    $('#' + lastElem).append(p);
    s = "<select id=" + field.id + "><option value=\"\" disabled selected>Choose your option</option></select>"
    $('#' + lastElem).append(s);
    for (var i = 0; i < field.misc.length; i++) {
      vs = field.misc[i];
      op = "<option value=" + vs.subVal + ">" + vs.subLabel + "</option>"
      $('#' + field.id).append(op);
    }
  } else if (field.kind == 'range') {
    s = "<p>" + field.label + "</p>"
    $('#' + lastElem).append(s);
    sp = "<p class=\"range-field\"><input type=\"range\" id=" + field.id + " min=" + field.misc[0].min + " max=" + field.misc[0].max + " /></p>"
    $('#' + lastElem).append(sp);
  } else if (field.kind == 'datepicker') {
    s = "<p>" + field.label + "</p>"
    $('#' + lastElem).append(s);
    pic = "<input type=\"text\" class=\"datepicker\" id=" + field.id + " placeholder=\"Choose Date\">"
    $('#' + lastElem).append(pic);
  } else if (field.kind == 'timepicker') {
    s = "<p>" + field.label + "</p>"
    $('#' + lastElem).append(s);
    pic = "<input type=\"text\" class=\"timepicker\" id=" + field.id + " placeholder=\"Select Time\">"
    $('#' + lastElem).append(pic);
  }
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
//temp variable s, remove in production

//called on click of form name from list.
function create_form(s) {
  fields_returned = s
  Cookies.set('fields_returned', fields_returned);
  //checks if variable is defined
  if (typeof fields_returned !== 'undefined') {
    //hides all forms list
    hide_allForms();
    //dynamically generates forms in same view
    h = "<h5>" + fields_returned.title + "</h5>"
    $('#' + lastElem).append(h);
    di = "<div class=\"divider\"></div>"
    // $('#' + lastElem).append(di);
    for (var i = 0; i < fields_returned.fields.length; i++) {
      create_newElem(fields_returned.fields[i]);
    }
    but = "<button style=\"padding-bottom:20px;\" class=\"btn waves-effect waves-light\"onclick=\"doSubmit()\">Submit<i class=\"material-icons right\">send</i></button>"
    $('#' + lastElem).append(but);
    //enables time picker
    $('.timepicker').pickatime({
      default: 'now', // Set default time: 'now', '1:30AM', '16:30'
      fromnow: 0, // set default time to * milliseconds from now (using with default = 'now')
      twelvehour: false, // Use AM/PM or 24-hour format
      donetext: 'OK', // text for done-button
      cleartext: 'Clear', // text for clear-button
      canceltext: 'Cancel', // Text for cancel-button
      autoclose: false, // automatic close timepicker
      ampmclickable: true, // make AM PM clickable
      aftershow: function() {} //Function for after opening timepicker
    });
    //enables datepicker
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      closeOnSelect: false // Close upon selecting a date,
    });
    //enables select
    $('select').material_select();
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
        Cookies.remove('currenttoken');
        Cookies.remove('email');
        Materialize.toast('User Logout Successful', 4000,'',function(){window.open("../UI/activity_bank.html","_self")})
      }
    }
  });}
 // ---------------------------------logout----------


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
        if (xhr.status==200) {
          Materialize.toast('Form Submitted Succesfully', 4000,'',function(){window.open("../UI/activity_bank.html","_self")})
        }
      },
      error: function(returnval) {
        if (returnval.status!=200) {
          Materialize.toast('Form Submit Failed', 4000,'',function(){window.open("../UI/activity_bank.html","_self")})
        }
      }
    });
  }
}
