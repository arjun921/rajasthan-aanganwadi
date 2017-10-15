var link = 'https://rajasthan-aanganwadi.herokuapp.com';
var lastElem = "";
$(document).ready(function() {
  // hide row container of forms
  $("#row").hide();
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
//creates the form tag with necessary fields
function createFormTag() {
  var mydiv = document.getElementById("row");
  var formTag = document.createElement('form');
  formTag.setAttribute('class', "col s12");
  formTag.setAttribute('id', 'form');
  mydiv.appendChild(formTag);
}



function createPara(id,contents){
  var mydiv = document.getElementById('form');
  var para = document.createElement('p');
  para.setAttribute('id', 'rbP'+id);
  para.innerHTML=(contents);
  mydiv.appendChild(para);
  lastElem = 'rbP'+id;
}
rb = create.fields[3];
function createrb(rb) {
  id = rb.id;
  content = rb.label;
  for (var i = 0; i < create.fields[3].misc.length; i++) {
    console.log(create.fields[3].misc[i]);
  }
  // createPara(id,content);
  // var mydiv = document.getElementById('rbP'+id);
  // var rb = document.createElement('input');
  // rb.setAttribute('name',id);
  // rb.setAttribute('type','radio');
  // rb.setAttribute('id',id);
  // var label = document.createElement('label');
  // label.setAttribute('for',id);
  // label.innerHTML=("Red");
  // mydiv.appendChild(rb);
  // mydiv.appendChild(label);
  // lastElem = id;
}


function create_txtField(id,label,kind) {

  //create input div
  var mydiv = document.getElementById('form');
  var inDiv = document.createElement('div');
  inDiv.setAttribute('class', 'input-field col s12');
  inDiv.setAttribute('id', 'text_div'+id);
  mydiv.appendChild(inDiv);

  //create input field
  var mydiv = document.getElementById('text_div'+id);
  var txtInput = document.createElement('input');
  txtInput.setAttribute('id', id);
  txtInput.setAttribute('type', kind);
  mydiv.appendChild(txtInput);

  //Create Label
  var mydiv = document.getElementById('text_div'+id);
  var txtLabel = document.createElement('label');
  txtLabel.setAttribute('for', id);
  txtLabel.innerHTML = label;
  mydiv.appendChild(txtLabel);
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

function create_form(s) {
  $("#row").show();
  // console.log("Create Form begins");
  fields_returned = load_form(s);
  //checks if variable is defined
  if (typeof fields_returned !== 'undefined') {
    //hides all forms list
    hide_allForms();
    //dynamically generates forms in same view
    var myContainer = document.getElementById("row");
    var hTag = document.createElement('h5');
    hTag.innerHTML = fields_returned.title;
    myContainer.append(hTag);
    createFormTag();
    for (var i = 0; i < fields_returned.fields.length; i++) {
      fieldIs = fields_returned.fields[i];
      if (fieldIs.kind == 'text') {
        console.log('I am createing a form field'+fieldIs.id)
        // console.log(fieldIs.id,fieldIs.label,fieldIs.kind);
        create_txtField(fieldIs.id,fieldIs.label,fieldIs.kind);
        lastElem = fieldIs.id;
      }
    }
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
