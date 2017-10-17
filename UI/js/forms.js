var link = 'https://rajasthan-aanganwadi.herokuapp.com';
var lastElem = "form";
$(document).ready(function() {
  $('select').material_select();
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
      //run this code when forms list available from webservice
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

//hides all forms list.
function hide_allForms() {
  $("#form_list").hide();
}

function load_form(formID) {
  console.log(formID);
  //load form based on id requested
  return create
}
//temp variable s, remove in production

//called on click of form name from list.
function create_form(s) {
  // console.log("Create Form begins");
  fields_returned = load_form(s);
  console.log(fields_returned);
  //checks if variable is defined
  if (typeof fields_returned !== 'undefined') {
    //hides all forms list
    hide_allForms();
    //dynamically generates forms in same view
    h = "<h5>"+fields_returned.title+"</h5>"
    $('#'+lastElem).append(h);
    for (var i = 0; i < fields_returned.fields.length; i++) {
      create_newElem(fields_returned.fields[i]);
    }
    but = "<button style=\"padding-bottom:20px;\" class=\"btn waves-effect waves-light\"onclick=\"doSubmit()\">Submit<i class=\"material-icons right\">send</i></button>"
    $('#'+lastElem).append(but);
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


function create_list(lis) {
  for (var i = 0; i < lis.forms.length; i++) {
    href = lis.forms[i].href;
    name = lis.forms[i].formid;
    var mydiv = document.getElementById("form_list");
    var aTag = document.createElement('a');
    // aTag.setAttribute('href', href);
    aTag.setAttribute('class', "collection-item");
    aTag.setAttribute('onclick', 'create_form(this.innerHTML)')
    aTag.innerHTML = name;
    mydiv.appendChild(aTag);

  }
}

function create_newElem(field) {
  if (field.kind=='text') {
    s = "<div class=\"input-field col s6\"><input id="+field.id+" type="+field.misc[0].spec+"><label for="+field.id+">"+field.label+"</label></div>"
    $('#'+lastElem).append(s);
  }
  else if (field.kind=='radio') {
    p = "<p>"+field.label+"</p>"
    $('#'+lastElem).append(p);
    for (var i = 0; i < field.misc.length; i++) {
      va = field.misc[i];
      prb = "<p>  <input name="+field.id+" type=\"radio\" id="+va.subID+" value="+va.subID+" />  <label for="+va.subID+">"+va.subLabel+"</label></p>"
      $('#'+lastElem).append(prb);
    }
  }
  else if (field.kind=='checkbox') {
    p = "<p>"+field.label+"</p>"
    $('#'+lastElem).append(p);
    for (var i = 0; i < field.misc.length; i++) {
      cbv = field.misc[i];
      s = "<p><input type=\"checkbox\" id="+cbv.subID+" /><label for="+cbv.subID+">"+cbv.subLabel+"</label></p>"
      $('#'+lastElem).append(s);
    }
  }
  else if (field.kind=='select') {
    p = "<p>"+field.label+"</p>"
    $('#'+lastElem).append(p);
    s = "<select id="+field.id+"><option value=\"\" disabled selected>Choose your option</option></select>"
    $('#'+lastElem).append(s);
    for (var i = 0; i < field.misc.length; i++) {
      vs = field.misc[i];
      op = "<option value="+vs.subVal+">"+vs.subLabel+"</option>"
      $('#'+field.id).append(op);
      // console.log(field.misc[i]);
    }
  }
  else if (field.kind=='range') {
    s = "<p>"+field.label+"</p>"
    $('#'+lastElem).append(s);
    sp = "<p class=\"range-field\"><input type=\"range\" id="+field.id+" min="+field.misc[0].min+" max="+field.misc[0].max+" /></p>"
    $('#'+lastElem).append(sp);
  }
  else if (field.kind=='datepicker') {
    s = "<p>"+field.label+"</p>"
    $('#'+lastElem).append(s);
    pic = "<input type=\"text\" class=\"datepicker\" id="+field.id+" placeholder=\"Choose Date\">"
    $('#'+lastElem).append(pic);
    console.log(field);
  }
  else if (field.kind == 'timepicker') {
    s = "<p>"+field.label+"</p>"
    $('#'+lastElem).append(s);
    pic = "<input type=\"text\" class=\"timepicker\" id="+field.id+" placeholder=\"Select Time\">"
    $('#'+lastElem).append(pic);
    console.log(field);
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
} // ---------------------------------logout----------


function doSubmit() {
  alert("Submit Succes");
}
