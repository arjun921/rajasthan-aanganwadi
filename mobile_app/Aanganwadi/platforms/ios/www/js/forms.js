//getHTML* functions are used to seperate HTML code from app logic.
//getHTML* functions are declared in returnHtml.js

//global variables
var fields_returned;

$(document).ready(function() {
  $('#form').hide();
  fetchForms();
  setTitle("Forms");
  enableHamburgerMenu();
});

function TokenPresent() {
  if (typeof Cookies.get('currenttoken') !== 'undefined') {
    return true
  } else {
    return false
  }
}

function makeList(data) {
  for (var i = 0; i < data.forms.length; i++) {
    item = data.forms[i];
    p = getHTMLFormsListElement(item)
    $('#form_list').append(p);
  }
}

function noFormsToast() {
  Materialize.toast('No forms to fill at the moment', 4000, '', function() {window.open("index.html", "_self")})
}


function createLabel(field) {
  p = getHTMLLabel(field);
  $('#form').append(p);
}

function createTxtField(field) {
  s = getHTMLTxtField(field);
  $('#form').append(s);
}

function createRadio(field) {
  createLabel(field)
  for (var i = 0; i < field.misc.length; i++) {//creates individual radio buttons
    va = field.misc[i];
    prb = getHTMLRadioButtons(field, va);
    $('#form').append(prb);
  }
}

function createCB(field) {//creates checkbox
  createLabel(field)
  for (var i = 0; i < field.misc.length; i++) {//creates individual checkbox for one question
    cbv = field.misc[i];
    s = getHTMLCheckBoxes(cbv);
    $('#form').append(s);
  }
}

function createSelect(field) {//creates dropdown/select
  createLabel(field)
  s = getHTMLSelect(field);
  $('#form').append(s);
  for (var i = 0; i < field.misc.length; i++) {//create select options
    vs = field.misc[i];
    op = getHTMLSelectFields(vs);
    $('#' + field.id).append(op);
  }
}

function createRange(field) {//choose from a range of 0 to n
  createLabel(field);
  sp = getHTMLRange(field);
  $('#form').append(sp);
}

function createDatePicker(field) {//formatted date input
  createLabel(field)
  pic = getHTMLDatePicker(field);
  $('#form').append(pic);
}

function createTimePicker(field) {//formatted time input
  createLabel(field)
  pic = getHTMLTimePicker(field);
  $('#form').append(pic);
}

function createFormField(field) {
  if (field.kind == 'text') {
    createTxtField(field)
  } else if (field.kind == 'radio') {
    createRadio(field)
  } else if (field.kind == 'checkbox') {
    createCB(field)
  } else if (field.kind == 'select') {
    createSelect(field)
  } else if (field.kind == 'range') {
    createRange(field)
  } else if (field.kind == 'datepicker') {
    createDatePicker(field)
  } else if (field.kind == 'timepicker') {
    createTimePicker(field)
  }
}

function create_form(fields_returned) {//create form using fields and params supplied.
  //checks if variable is defined
  $('#form').show();
  setTitle("Forms");
  Cookies.set('fields_returned',fields_returned)
  if (typeof fields_returned !== 'undefined') {
    $("#form_list").hide();
    h = getHTMLFormTitle(fields_returned);
    $('#form').append(h);
    for (var i = 0; i < fields_returned.fields.length; i++) {
      createFormField(fields_returned.fields[i]);
    }
    but = getHTMLFormSubmitButton()
    $('#form').append(but);
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

function getFormValues(fields_returned) {//getch all values from form in view
  data = []
  for (var i = 0; i < fields_returned.fields.length; i++) {
    temp = fields_returned.fields[i];
    id = temp.id;
    fieldType = temp.kind;
    val = {}
    if ((fieldType == 'text') || (fieldType == 'select') || (fieldType == 'range') || (fieldType == 'datepicker') || (fieldType == 'timepicker')) {
      // if field is text, select, range, datepicker, timepicker then get string value
      val['id'] = id;
      val['value'] = document.getElementById(id).value;
    } else if (fieldType == 'radio') {
      s = "input[name='" + id + "']:checked"
      val['id'] = id;
      if ($(s).val()) {
        val['value'] = $(s).val();
      } else {
        val['value'] = "";
      }
    } else if (fieldType == 'checkbox') {
      cbval = []
      for (var j = 0; j < temp.misc.length; j++) {
        myVals = {};
        myVals["id"] = temp.misc[j].subID;
        myVals["value"] = String(document.getElementById(temp.misc[j].subID).checked);
        cbval.push(myVals);
      }
      val['id'] = id;
      val['value'] = "";
      val['misc'] = cbval;
    }
    data.push(val)
  }
  return data
}


function fetchForms() {//list all forms
  sendData = { "token": Cookies.get('currenttoken')}
  apisuccess = function(data, st, xhr) {
    //if forms available, make list
    $('#preloader').hide();
    if (data.forms.length > 0) {
      makeList(data)
    }
    else {
      $('#form_list').append(getHTMLNoFormsToFill);
      noFormsToast();
    }
  }
  apierror = function(returnval) {
    if (returnval.status != 200) {
      out_changes();
      msg = 'Please Login to view.'
      href = 'login.html'
      action = function() {
        window.open("login.html", "_self")
      }
      toastWithAction(msg, href, action)
    }
  }
  if (Cookies.get('currenttoken')) {
    hitApi('/form/list', sendData, apisuccess, apierror);
  }
  else {
    window.open("login.html", "_self")
  }
}

function load_form(formID) {//load form from list
  sendData = {
    "token": Cookies.get('currenttoken'),
    'formid': formID
  }
  apisuccess = function (data, st, xhr) {
    create_form(data);
  }
  hitApi('/form',sendData,apisuccess,function() {});
}


function doSubmit() {//submit form
  fields_returned = JSON.parse(Cookies.get('fields_returned'));
  dataRet = {}
  dataRet['token'] = Cookies.get('currenttoken');
  dataRet['formid'] = fields_returned.formid;
  dataRet['data'] = getFormValues(fields_returned);
  if (TokenPresent()) {
    sendData = dataRet
    apisuccess = function (data, st, xhr) {
      if (xhr.status == 200) {
        Materialize.toast('Form Submitted Succesfully', 4000, '', function() {
          window.open("index.html", "_self")
        });
      }
    }
    apierror = function(returnval) {
      if (returnval.status != 200) {
        Materialize.toast('Form Submit Failed', 4000);
      }
    }
    hitApi('/form/submit',sendData,apisuccess,apierror);
  }
}
