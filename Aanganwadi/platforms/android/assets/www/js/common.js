var link='https://rajasthan-aanganwadi.herokuapp.com';var server='https://rajasthan-aanganwadi.herokuapp.com';$('.tooltipped').tooltip({delay:50});$('.modal').modal({dismissible:true,opacity:.5,inDuration:300,outDuration:200,startingTop:'4%',endingTop:'10%',ready:function(modal,trigger){},complete:function(){$('.button-collapse').sideNav('hide');window.location.href=window.location.href;}});$("#profile_pic").hide();$('select').material_select();loadSideMenu();function resetApp(){data=Cookies.getJSON();for(var key in data){Cookies.remove(key);}
window.location.href="index.html";}
function nextSpinner(){var spinners="⣷⣯⣟⡿⢿⣻⣽⣾";var index=spinners.indexOf(document.getElementById("spinner").textContent);if(index==-1){index=0}
index=(index+1)%spinners.length;document.getElementById("spinner").textContent=spinners[index];}
$(document).ajaxStart(function(){spinid=setInterval(nextSpinner,60);$("#spinner").show();});$(document).ajaxSuccess(function(){clearInterval(spinid);$("#spinner").hide();});$(document).ajaxError(function(event,jqxhr,settings,thrownError){if(jqxhr.readyState==4){}
else if(jqxhr.readyState==0){clearInterval(spinid);$("#spinner").hide();Materialize.toast('Connectivity Issue',4000);}
else{}});function genToken(){var text="";var possible="abcdefghijklmnopqrstuvwxyz0123456789";for(var i=0;i<100;i++){text+=possible.charAt(Math.floor(Math.random()*possible.length));}
return text;}
function hitApi(url,sendData,apisuccess,apierror){$.ajax({url:(server+url),type:'post',contentType:'application/json',data:JSON.stringify(sendData),success:function(data,st,xhr){apisuccess(data,st,xhr)},error:function(returnval){apierror(returnval)}});}
function logout(){url='/user/logout';sendData={"token":Cookies.get('currenttoken')};apisuccess=function(data,st,xhr){if(xhr.status==200){Materialize.toast('User Logout Successful',4000,'',function(){window.open("index.html","_self")})}};hitApi(url,sendData,apisuccess,function(){});out_changes();}
function checkLogin(){if(Cookies.get('currenttoken')){$("#loginStatus").removeClass('deep-orange-text text-accent-3');$("#loginStatus").addClass('green-text text-accent-3');$("#loginStatus").attr("data-tooltip","Logged in");$("#email_menu").text(Cookies.get('email'));$("#name_menu").text(Cookies.get('fname'));document.getElementById("formLink").href="all_forms.html";$("#profile_pic").show();$("#profile_pic").attr('src',"images/turban22.png");$("#login_menu_but").hide();return true;}else{out_changes();return false;}}
function loadSideMenu(){checkLogin();}
function out_changes(){$("#loginStatus").addClass('deep-orange-text');$("#loginStatus").removeClass('green-text');$("#loginStatus").attr("data-tooltip","Not Logged in");$("#email_menu").text("User not Logged In");$("#name_menu").text(" ");$("#profile_pic").show();$("#profile_pic").attr('src',"images/empty-profile.gif");$("#logout_menu_but").hide();$("#login_menu_but").show();document.getElementById("formLink").href="login.html"
Cookies.remove('currenttoken');Cookies.remove('email');Cookies.remove('fname');}
function toastWithAction(msg,href,action){var $toastContent=$('<span>'+msg+'</span>').add($('<a href="'+href+'"><button class="btn-flat toast-action">OK</button></a>'));Materialize.toast($toastContent,4000,'',function(){action();})}
function enableHamburgerMenu(){$('#navi').show();$('#hamburgerMenu').addClass('button-collapse');$('#hamburgerMenu').removeClass('hidden');$('#closeMenu').removeClass('button-collapse');$('#closeMenu').addClass('hidden');$('#closeIcon').removeClass('black-text');$(".button-collapse").sideNav();}
function disableHamburgerMenu(){$('#navi').hide();$('#closeMenu').addClass('button-collapse');$('#closeMenu').removeClass('hidden');$('#hamburgerMenu').removeClass('button-collapse');$('#hamburgerMenu').addClass('hidden');}