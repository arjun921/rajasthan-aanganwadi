// var server = 'https://rajasthan-aanganwadi.herokuapp.com';
var server = 'http://35.154.76.18';
// var server = 'http://localhost:8000';

//Materialize workers. Implements materialze elements functionality
$('.tooltipped').tooltip({delay: 50});
$('.slider').slider();
$('.modal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '4%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
    },
    complete: function() { $('.button-collapse').sideNav('hide'); window.location.href = window.location.href;} // Callback for Modal close
  });
$('select').material_select();
$("#profile_pic").hide();


//Network related functions. Responsible for spinners
$(document).ajaxStart(function() {
  spinid = setInterval(nextSpinner, 60);
  $("#spinner").show();
  setTitle('Loading...');
});

$(document).ajaxSuccess(function() {
  clearInterval(spinid);
  $("#spinner").hide();
});

$( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
  if (jqxhr.readyState == 4) {
    // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)
  }
  else if (jqxhr.readyState == 0) {
    // Network error (i.e. connection refused, access denied due to CORS, etc.)
    clearInterval(spinid);
    $("#spinner").hide();
    Materialize.toast('Connectivity Issue', 4000);
  }
  else {
    clearInterval(spinid);
    $("#spinner").hide();
    // something weird is happening
  }
});

//checks login to set logged in status icon to green/red on all pages
checkLogin();


function resetApp() {//used in "Help"> reset
  data = Cookies.getJSON();
  for (var key in data) {
    Cookies.remove(key);
    console.log(key);
  }
  for(var i=0, len=sessionStorage.length; i<len; i++) {
    var key = sessionStorage.key(i);
    var value = sessionStorage[key];
    sessionStorage.removeItem(key);
    console.log(key + " => " + value);
}
  window.location.href = "index.html";
}


function setTitle(stri) {//sets title of the page in navigation
  if ($(window).width()<=320) {//320x568
    if(stri.length>18){
      stri = stri.substring(0,18)+'...'
    }
  }
  else if ($(window).width()>330 && $(window).width()<=375) {//375x667
    if(stri.length>21){
      stri = stri.substring(0,21)+'...'
    }
  }
  else if ($(window).width()>385 && $(window).width()<=414) {//414x736
    if(stri.length>25){
      stri = stri.substring(0,25)+'...'
    }
  }
  else {
    if(stri.length>25){
      stri = stri.substring(0,25)+'...'
    }
  }

  $('#crumbtitle').html(stri);
  $('#crumbtitle2').html(stri);
}


function nextSpinner(){
    var spinners="⣷⣯⣟⡿⢿⣻⣽⣾";
    var index = spinners.indexOf(document.getElementById("spinner").textContent);
    if(index == -1){index = 0}
    index = (index + 1) % spinners.length;
    document.getElementById("spinner").textContent = spinners[index];
}


function genToken() {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < 100; i++) {
  text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}


function hitApi(url,sendData,apisuccess,apierror) {// all API end points called using this function
  $.ajax({
    url: (server + url),
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify(sendData),
    success: function(data, st, xhr) { apisuccess(data,st,xhr) },
    error: function(returnval) { apierror(returnval) }
  });
}

function logout() {
  url='/user/logout';
  sendData = { "token": Cookies.get('currenttoken')};
  apisuccess = function (data,st,xhr) {
    if (xhr.status == 200) {
      Materialize.toast('User Logout Successful', 4000, '', function() {
        window.open("index.html", "_self")
      })
    }
  };
  hitApi(url,sendData,apisuccess,function () {});
  out_changes();
}


function checkLogin() {
  if (Cookies.get('currenttoken')) {// if logged in
    $("#loginStatus").removeClass('deep-orange-text text-accent-3');
    $("#loginStatus").addClass('green-text text-accent-3');
    $("#loginStatus").attr("data-tooltip","Logged in");
    $("#email_menu").text(Cookies.get('email'));
    $("#name_menu").text(Cookies.get('fname'));
    document.getElementById("formLink").href = "all_forms.html";
    $("#profile_pic").show();
    $("#profile_pic").attr('src', "images/turban22.png");
    $("#login_menu_but").hide();
    $("#login_Mainmenu_but").hide();
    return true;
  } else {//not logged in
    out_changes();
    return false;
  }
}


function out_changes() {//on logout
  $("#loginStatus").addClass('deep-orange-text');
  $("#loginStatus").removeClass('green-text');
  $("#loginStatus").attr("data-tooltip","Not Logged in");
  $("#email_menu").text("User not Logged In");
  $("#name_menu").text(" ");
  $("#profile_pic").show();
  $("#profile_pic").attr('src', "images/empty-profile.gif");
  $("#logout_menu_but").hide();
  $("#logout_Mainmenu_but").hide();
  $("#login_menu_but").show();
  $("#login_Mainmenu_but").show();
  document.getElementById("formLink").href = "login.html"
  Cookies.remove('currenttoken');
  Cookies.remove('email');
  Cookies.remove('fname');
}


function toastWithAction(msg,href,action) {
  var $toastContent = $('<span>'+msg+'</span>').add($('<a href="'+href+'"><button class="btn-flat toast-action">OK</button></a>'));
  Materialize.toast($toastContent, 4000, '', function() {
    action();
  })
}


function enableHamburgerMenu() {
  $('#navi').show();
  $('#hamburgerMenu').addClass('button-collapse');
  $('#hamburgerMenu').removeClass('hidden');
  $('#closeMenu').removeClass('button-collapse');
  $('#closeMenu').addClass('hidden');
  $('#MenuDownload').removeClass('button-collapse');
  $('#MenuDownload').addClass('hidden');
  $('#CloseTablet').addClass('hidden');
  $('#TabletDownload').addClass('hidden');
  $('#closeIcon').removeClass('black-text');
  $(".button-collapse").sideNav();
}


function disableHamburgerMenu() {// used when loading media to add close button
  $('#navi').hide();
  $('#closeMenu').addClass('button-collapse');
  $('#closeMenu').removeClass('hidden');
  $('#MenuDownload').addClass('button-collapse');
  $('#MenuDownload').removeClass('hidden');
  $('#CloseTablet').removeClass('hidden');
  $('#CloseTablet').addClass('tabletClose');
  $('#CloseTablet').removeClass('tabletClosePdf');
  $('#TabletDownload').removeClass('hidden');
  $('#TabletDownload').addClass('tabletDownload');
  $('#TabletDownload').removeClass('tabletDownloadPdf');
  $('#hamburgerMenu').removeClass('button-collapse');
  $('#hamburgerMenu').addClass('hidden');
}


function searchClickedFunction() {// triggered on clicking search FAB
  $('#searchForm').toggle();
  document.getElementById('newSearchInput').focus();
  updateBookCount(listing.length);
  categoryListing(listing,Cookies.get('CurrPage'));
}
