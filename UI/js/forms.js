var link = 'https://rajasthan-aanganwadi.herokuapp.com';
//<------ Remove in production BEGIN
var s = "f1";
create = {
  'formid': 'f1',
  'title': 'Form 1',
  'fields': [{
      'id': '1',
      'label': 'Text Input',
      'kind': 'text',
      'misc': []
    },
    {
      'id': '2',
      'label': 'Radio Question',
      'kind': 'radio',
      'misc': [{
        'subLabel':'Red',
        'subID':'red'
      },
      {
        'subLabel':'Green',
        'subID':'green'
      }
    ]
    },
    {
      'id': '3',
      'label': 'name',
      'kind': 'checkbox',
      'misc': [{
        'subLabel':'Red',
        'subID':'red'
      },
      {
        'subLabel':'Green',
        'subID':'green'
      }]
    },
    {
      'id': '4',
      'label': 'name',
      'kind': 'dropdown',
      'misc': [{
        'subLabel':'Red',
        'subID':'red'
      },
      {
        'subLabel':'Green',
        'subID':'green'
      }]
    },
    {
      'id': '5',
      'label': 'name',
      'kind': 'range',
      'misc': []
    },
    {
      'id': '6',
      'label': 'name',
      'kind': 'datepicker',
      'misc': []
    },
    {
      'id': '7',
      'label': 'name',
      'kind': 'timepicker',
      'misc': []
    }
  ],
  "token": Cookies.get('currenttoken')
};

formslist = {
  'forms': [
    {
      'href': '',
      'formid': 'Form 1'
    },
    {
        'href': 'http://google.com',
        'formid': 'Google'
      },
      {
        'href': 'http://facebook.com',
        'formid': 'Facebook'
      }
  ]
}
//Remove in production ---------------------->

$(document).ready(function() {
  // hide row container of forms
  $("#row").hide();
  //enables time picker
  $('.timepicker').pickatime({
    default: 'now', // Set default time: 'now', '1:30AM', '16:30'
    fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
    twelvehour: false, // Use AM/PM or 24-hour format
    donetext: 'OK', // text for done-button
    cleartext: 'Clear', // text for clear-button
    canceltext: 'Cancel', // Text for cancel-button
    autoclose: false, // automatic close timepicker
    ampmclickable: true, // make AM PM clickable
    aftershow: function(){} //Function for after opening timepicker
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
function createFormTag(){
  var mydiv = document.getElementById("row");
  var formTag = document.createElement('form');
  formTag.setAttribute('class', "col s12");
  formTag.setAttribute('id', 'form');
  mydiv.appendChild(formTag);
}

function create_txtField() {
  //create row
  var mydiv = document.getElementById("form");
  var rowDiv = document.createElement('div');
  rowDiv.setAttribute('class', "row");
  rowDiv.setAttribute('id', 'row_textDiv');
  mydiv.appendChild(rowDiv);

  //create input div
  var mydiv = document.getElementById('row_textDiv');
  var textIn = document.createElement('div');
  textIn.setAttribute('class', 'input-field col s12');
  textIn.setAttribute('id', 'text_div');
  mydiv.appendChild(textIn);

  //create input field
  var mydiv = document.getElementById('text_div');
  var txtInput = document.createElement('input');
  txtInput.setAttribute('id', 'last_name');
  txtInput.setAttribute('type', 'password');
  mydiv.appendChild(txtInput);

  //Create Label
  var mydiv = document.getElementById('text_div');
  var txtLabel = document.createElement('label');
  txtLabel.setAttribute('for', 'last_name');
  txtLabel.innerHTML = "Name";
  mydiv.appendChild(txtLabel);
}
//hides all forms list.
function hide_allForms(){
  $("#form_list").hide();
}

function load_form(formID){
  console.log(formID);
  //load form based on id requested
  return create
}
//temp variable s, remove in production

function create_form(s){
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
    for (var i = 0; i < fields_returned.fields.length; i++) {
      fieldIs = fields_returned.fields[i];
      console.log(fieldIs);
    }
  }
  createFormTag();
  create_txtField();

}


function create_list(lis) {
  for (var i = 0; i < lis.forms.length; i++) {
    href = lis.forms[i].href;
    name = lis.forms[i].formid;
    var mydiv = document.getElementById("form_list");
    var aTag = document.createElement('a');
    // aTag.setAttribute('href', href);
    aTag.setAttribute('class', "collection-item");
    aTag.setAttribute('onclick','create_form(this.innerHTML)')
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
