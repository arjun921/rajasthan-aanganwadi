var start,end;
var paginateSplit = 25;
window.onpageshow = function(event) {
  reINT();
  document.getElementById('crumbtitle').innerHTML = "Activity"
  document.getElementById('crumbtitle2').innerHTML = document.getElementById('crumbtitle').innerHTML;

};

window.onhashchange = change;

function search(key) {

}

function change(){
  $('#content').html('');
  $('#content').hide();
  reINT();
}

function reINT() {
  $('#preloader').hide();
  $('#searchForm').hide();
  if (window.location.href.split('#').length==1) {
    createNav('_ROOT_');
  }
  else {
    if (window.location.href.split('#')[1]=="help") {

      }
      else if (location.hash.split(".").length<2 ) {
      createNav(window.location.href.split('#')[1]);
      }
    else {
      if (Cookies.get('currenttoken')) {
        load_content(window.location.href.split('#')[1]);
        document.getElementById('docIframe').onload = function() {
          $('#preloader').hide();
        }
      }
      else {
        window.location.href = "login.html";
      }

    }
  }
}

function load_content(contentID) {
  $('#preloader').show();
  $('#navi').html('');
  $('#crumbtitle').html("Loading file");
  $('#crumbtitle2').html("Loading file");
  $.ajax({
    url: (link + '/content'),
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      "token": Cookies.get('currenttoken'),
      'fname': contentID
    }),
    success: function(data, st, xhr) {
      $('#content').show();
      $('#content').html('');
      $('#crumbtitle').html(contentID);
      $('#crumbtitle2').html(contentID);
      ftype = (data.url.split('.').pop());
      if (ftype == "mp4") {
        p = "<video class=\"responsive-video\" style=\"width:100%; padding-top: 25px;\" controls><source src=" + link + data.url + " type=\"video/mp4\"></video>"
        $('#preloader').hide();
        $('#content').append(p);
      } else if (ftype == "mp3"){
        p = "<p></p><audio controls=\"controls\" style=\"width:100%; padding-top: 25px;\" id = \"player\"><source src = " + link + data.url + " /></audio>"
        $('#preloader').hide();
        $('#content').append(p);
      } else if (ftype == "pdf") {
        flink = 'https://docs.google.com/viewer?url=' + link + data.url+"&pid=explorer&efh=false&a=v&chrome=false&embedded=true"
        p = "<iframe src=\""+flink+"\" id=\"docIframe\" style=\"position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;\">Your browser doesn't support iframes</iframe>"
        $('#content').append(p);
      }
    },
    error: function(returnval) {
      if (returnval.status != 200) {
        out_changes();
        var $toastContent = $('<span>Please Login to view.</span>').add($('<a href="login.html"><button class="btn-flat toast-action">OK</button></a>'));
        Materialize.toast($toastContent, 4000, '', function() {
          window.open("login.html", "_self")
        })
      }
    }
  });
}
var totalCategories;
function createNav(id) {
    $.ajax({
        url: (link + '/category'),
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({'catid': id}),
        success: function(data, st, xhr) {
              $('#crumbtitle').html(data.title);
              $('#crumbtitle2').html(data.title);
              listing = data.contains;
              searchInput.oninput = searchCategories;
              var updateBookCount = function(numCategories) {
                bookCountBadge.innerText = numCategories + ' items';
              };
              updateBookCount(listing.length);
              totalCategories = listing.length;
              if (totalCategories>paginateSplit) {
                start = 0;
                end = paginateSplit;
              }
              else {
                start= 0;
                end = totalCategories;
              }
              showElement(indexedCategoriesTable);
              rebuildSearchIndex();
              updateCategoriesTable(listing);
            }
      });
}


function navClick(id) {
  url = window.location.href.split('#')[0]+"#"+id;
  window.location.href = url;
}

var count=0;

function loadNextList50() {
  count+=1
  var numTimesPaginate = Math.floor(totalCategories/paginateSplit);
  if (count<numTimesPaginate) {
    start += paginateSplit
    end = start+paginateSplit
  }
  else {
    start +=paginateSplit
    end = start+(totalCategories-start);
  }
  updateCategoriesTable(listing);
  window.scrollTo(0, 0);
}

function loadPreviousList50() {
  count-=1
  var numTimesPaginate = Math.floor(totalCategories/paginateSplit);
  if (count<numTimesPaginate) {
    start -=paginateSplit
    end = start+paginateSplit
  }
  else {
    start -=paginateSplit
    end = start+(totalCategories-start);
  }
  updateCategoriesTable(listing);
}
