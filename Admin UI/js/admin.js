var lastElem = "formView";

var link = 'https://rajasthan-aanganwadi.herokuapp.com';
// var link = 'http://192.168.43.126:8000';
var currenttoken = '';

var genToken = function() {
                var text = "";
                var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
                for(var i = 0; i < 100; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
}

// Hash Function
//used in login/signup
/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
 *
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 *
 * @param {string} key ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash
 */
//source https://github.com/garycourt/murmurhash-js/blob/master/murmurhash3_gc.js
function murmurhash3_32_gc(key, seed) {
    var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

    remainder = key.length & 3; // key.length % 4
    bytes = key.length - remainder;
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;

    while (i < bytes) {
        k1 =
            ((key.charCodeAt(i) & 0xff)) |
            ((key.charCodeAt(++i) & 0xff) << 8) |
            ((key.charCodeAt(++i) & 0xff) << 16) |
            ((key.charCodeAt(++i) & 0xff) << 24);
        ++i;

        k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

        h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
        h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
        h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    k1 = 0;

    switch (remainder) {
        case 3:
            k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        case 2:
            k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        case 1:
            k1 ^= (key.charCodeAt(i) & 0xff);

            k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= k1;
    }

    h1 ^= key.length;

    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
}

function REinit() {
  $('ul.tabs').tabs('select_tab', 'text');
  $(".button-collapse").sideNav();
  $("#loggedIn").show();
  $("#noLogin").hide();
  $("#formCreateDiv").hide();
  //sets navigation menu profile content
  // var currenttoken = Cookies.get('currenttoken');
  if (Cookies.get('currenttoken')) {
    $("#email_menu").text(Cookies.get('email'));
    $("#name_menu").text("Arjoonn Sharma");
    $("#profile_pic").attr('src',"https://avatars3.githubusercontent.com/u/7693265?v=4&s=400");
    $("#form_tab").show();
    $("#tabs").show();
    $("#loginDiv").hide();
    loadFormList();
    load_content();
  }
  else {
    out_changes();
  }
  $( '#fileUploadForm' ).submit( function( e ) {
    $.ajax( {
      url: link+'/content/create',
      type: 'POST',
      data: new FormData( this ),
      processData: false,
      contentType: false,
      success: function () {
        Materialize.toast('Upload Successful', 4000,'',function(){
          window.location.reload(true);
        })
      },
      error: function(){
        Materialize.toast('Upload Failed', 4000,'',function(){
          window.location.reload(true);
        })
      }
    } );
    e.preventDefault();
  } );
  //remove
  createForms();
}

$(document).ready(function() {
  REinit();
});

function deleteCont(fname) {
  tok = Cookies.get('currenttoken');
  $.ajax({
      url: (link+'/content/delete'),
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify( { "fname": fname, "token": tok} ),
      success: function(data, st, xhr){
        Materialize.toast('Delete Successful', 4000,'',function(){
          window.location.reload(true);
          // window.open("../UI/login.html","_self")
        })

      }
  });
}

function load_content() {
  $.ajax({
    url: (link + '/content/list'),
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      "token": Cookies.get('currenttoken')
    }),
    success: function(data, st, xhr) {

      for (var i = 0; i < data.contents.length; i++) {
        content = data.contents[i];
        title = content.title;
        fname = content.fname;
        ftype = (content.fname.split('.').pop());
        icon = ""
        if (ftype=="mp4") {
          ftype="Video";
          icon="movie";
        }
        else if (ftype=="mp3") {
          ftype="Audio";
          icon="music_note";
        }
        else if (ftype=="pdf") {
          ftype="PDF";
          icon="picture_as_pdf";
        }
        s = "<li><div class=\"collapsible-header\"><i class=\"material-icons\">"+icon+"</i>"+title+"</div><div class=\"collapsible-body\"><div class=\"collection\"><a href=\"#!\" class=\"collection-item\"><span class=\"badge\">October 25, 2017</span>Date Published</a><a href=\"#!\" class=\"collection-item\"><span class=\"badge\">"+ftype+"</span>Content Type</a><a onclick=\"deleteCont(this.id)\" id=\""+fname+"\" class=\"collection-item\"><span class=\"badge\"><i class=\"material-icons\">delete</i></span>Delete</a></div></div></li>"
        $('#contentList').append(s);
      }
    },
    error: function(returnval) {
      if (returnval.status!=200) {
        Materialize.toast('You need to be logged in to view this', 4000,'',function(){
          Cookies.remove('currenttoken');
          Cookies.remove('email');
          window.location.reload(true);
          // window.open("../UI/login.html","_self")
        })
      }
    }
  });
}

function loadFormList(){
  $.ajax({
    url: (link + '/form/list'),
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      "token": Cookies.get('currenttoken')
    }),
    success: function(data, st, xhr) {
      for (var i = 0; i < data.forms.length; i++) {
        name = data.forms[i];
        s = "<li><div class=\"collapsible-header\"><i class=\"material-icons\">assessment</i>"+name+"</div><div class=\"collapsible-body\"><div class=\"collection\"><a href=\"#!\" class=\"collection-item\"><span class=\"badge\">October 25, 2017</span>Date Published</a><a href=\"#!\" class=\"collection-item\"><span class=\"badge\">October 31, 2017</span>Expiry</a><a href=\"#!\" class=\"collection-item\"><span class=\"new badge\">21</span>Number of responses</a><a href=\"#!\" class=\"collection-item\"><span class=\"badge\"><i class=\"material-icons\">edit</i></span>Edit</a><a href=\"#!\" class=\"collection-item\"><span class=\"badge\"><i class=\"material-icons\">delete</i></span>Delete</a></div></div></li>"
        $('#formList').append(s);
      }
    },
    error: function(returnval) {
      if (returnval.status!=200) {
        Materialize.toast('You need to be logged in to view this', 4000,'',function(){
          Cookies.remove('currenttoken');
          Cookies.remove('email');
          window.location.reload(true);
          // window.open("../UI/login.html","_self")
        })
      }
    }
  });
}

function out_changes() {
  $("#tabs").hide();
  $("#form_tab").hide();
  $("#loginDiv").show();
  $("#nav-mobile").hide();
  $("#sideLogin").hide();
  $("#contentList").hide();
  $("#content_tab").hide();


  // $("#logout_menu_but").hide();
  // $("#logout_menu_butD").hide();
  // $("#login_menu_but").show();
  // $("#login_menu_butD").show();
}

function dologin(){
    var email = $('#emailinput').val();
    var pwd = $("#pwdinput").val();
    pwd = murmurhash3_32_gc(pwd,24);
    pws =  pwd.toString();
    var tok = genToken();
    $.ajax({
        url: (link+'/user/login'),
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify( { "email": email, "pwd": pws, "token": tok} ),
        success: function(data, st, xhr){
            Cookies.set('currenttoken', tok);
            Cookies.set('email', email);
            Materialize.toast('Login Successful', 4000);
            $("#form_tab").show();
            $("#tabs").show();
            $("#loginDiv").hide();
            $("#nav-mobile").show();
            $("#sideLogin").show();
            window.location.reload(true);
        }
    });

};

function contentShow() {
  $("#contentTitle").text("Content");
$("#contentList").show();
$("#contUploadDiv").hide();
}

function contentPushPage() {
  $("#contentList").hide();
  $("#contentTitle").text("Content > Upload");
  $("#contUploadDiv").show();
}

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
        Materialize.toast('User Logout Successful', 4000,'',function(){window.open("#!","_self")})
      }
    }
  });}


function createForms() {
  $("#formList").hide();
  $("#formTitle").text("Forms > Create");
  $("#formCreateDiv").show();

}

function formsShow() {
  $("#formTitle").text("Forms");
  $("#formList").show();
  $("#formCreateDiv").hide();
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
      create_formView(data);
    }
  });
  //load form based on id requested
  // return create
}

function create_formView(s) {
  $('#formView').html('');
  fields_returned = s;
  Cookies.set('fields_returned', fields_returned);
  //checks if variable is defined
  if (typeof fields_returned !== 'undefined') {
    //hides all forms list
    //dynamically generates forms in same view
    h = "<h5>" + fields_returned.title + "</h5>"
    $('#' + lastElem).append(h);
    di = "<div class=\"divider\"></div>"
    // $('#' + lastElem).append(di);
    finaldat = fields_returned.fields;
    for (var i = 0; i < fields_returned.fields.length; i++) {
      create_newElem(fields_returned.fields[i]);
    }
    // but = "<button style=\"padding-bottom:20px;\" class=\"btn waves-effect waves-light\"onclick=\"doSubmit()\">Submit<i class=\"material-icons right\">send</i></button>"
    // $('#' + lastElem).append(but);
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

function create_newElem(field) {
  if (field.kind == 'text') {
    s = "<div class=\"input-field col s12\"><input id=" + field.id + " type=\"text\" " + "><label for=" + field.id + ">" + field.label + "</label></div>"
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

var formJson = {
    "formid": "Dummy Form",
    "title": "Dummy Form 1",
    "fields": [
        {
            "id": "1",
            "label": "name",
            "kind": "text"
        },
        {
            "id": "2",
            "label": "email",
            "kind": "text"
        },
        {
            "id": "3",
            "label": "What do you need at school?",
            "kind": "checkbox",
            "misc": [
                {
                    "subLabel": "more books",
                    "subID": "books"
                },
                {
                    "subLabel": "access to internet",
                    "subID": "internet"
                }
            ]
        },
        {
            "id": "4",
            "label": "is aanganwadi regular?",
            "kind": "radio",
            "misc": [
                {
                    "subLabel": "yes",
                    "subID": "yes"
                },
                {
                    "subLabel": "no",
                    "subID": "no"
                }
            ]
        },
        {
            "id": "5",
            "label": "Pick a Date",
            "kind": "datepicker"
        },
        {
            "id": "6",
            "label": "Pick a Time",
            "kind": "timepicker"
        },
        {
            "id": "7",
            "label": "Select something",
            "kind": "select",
            "misc": [
                {
                    "subVal": "something1",
                    "subLabel": "something1"
                },
                {
                    "subVal": "something2",
                    "subLabel": "something2"
                }
            ]
        },
        {
            "id": "8",
            "label": "Pick a number between 1 and 10",
            "kind": "range",
            "misc": [
                {
                    "min": 1,
                    "max": 10
                }
            ]
        }
    ]
};

function idGen() {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < 21; i++) {
  text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}


function setFormName() {
  e = $('#formName').val();
  formJson.title = e;
  formJson.formid = e;
  updateForm();
}

tempArr = [];

function addTextField() {
  temp = {}
  temp.id = idGen();
  temp.label = $('#txtQuestion').val();
  temp.kind = "text";
  tempArr.push(temp);
  formJson.fields = tempArr;
  updateForm()
}



function updateForm() {
    create_formView(formJson);
}
