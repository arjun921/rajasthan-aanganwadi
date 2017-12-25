var start,end;
var paginateSplit = 20;
var count=0;
window.onpageshow = function(event) {
  reINT();
  setTitle("Activity");
};

window.onhashchange = change;


function change(){
  $('#content').html('');
  $('#content').hide();
  reINT();
}

function reINT() {
  count=0;
  $('#preloader').hide();
  $('#searchForm').hide();
  $('#pagination').hide();
  if (window.location.href.split('#').length==1) {
    createNav('_ROOT_');
  }
  else {
      if (window.location.href.split('#')[1]=="help") {
        //do nothing for loading help modal
      }
      else if (location.hash.split(".").length<2 ) {
        //if hash value present, split and create nav for hash
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

function loadmp4(data) {
  p = "<video class=\"responsive-video\" style=\"width:100%; padding-top: 25px;\" controls controlsList=\"nodownload\"><source src=" + link + data.url + " type=\"video/mp4\"></video>"
  $('#preloader').hide();
  $('#content').append(p);
}

function loadmp3(data) {
  p = "<p></p><audio  controlsList=\"nodownload\" controls=\"controls\" style=\"width:100%; padding-top: 25px;\" id = \"player\"><source src = " + link + data.url + " /></audio>"
  $('#preloader').hide();
  $('#content').append(p);
}

function loadpdf(data) {
  flink = 'https://docs.google.com/viewer?url=' + link + data.url+"&pid=explorer&efh=false&a=v&chrome=false&embedded=true"
  p = "<iframe src=\""+flink+"\" id=\"docIframe\" style=\"position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;\">Your browser doesn't support iframes</iframe>"
  $('#content').append(p);
}

function load_content(contentID) {
  $('#preloader').show();
  $('#navi').html('');
  setTitle("Loading file");
  url='/content';
  sendData = {
    "token": Cookies.get('currenttoken'),
    'fname': contentID
  };
  apisuccess = function (data,st,xhr) {
    $('#content').show();
    $('#content').html('');
    setTitle(contentID);
    ftype = (data.url.split('.').pop());
    console.log(ftype);
    if (ftype == "mp4") {
      loadmp4(data)
    } else if (ftype == "mp3"){
      loadmp3(data)
    } else if (ftype == "pdf") {
      loadpdf(data)
    }
  };
  apierror = function (returnval) {
    if (returnval.status == 404) {
      var $toastContent = $('<span>File Not Found</span>').add($('<a onclick="window.history.back();"><button class="btn-flat toast-action">OK</button></a>'));
      Materialize.toast($toastContent, 4000, '', function() {
        window.history.back();
      });
    }
    else if (returnval.status == 403) {
      out_changes();
      var $toastContent = $('<span>Please Login to view.</span>').add($('<a href="../UI/login.html"><button class="btn-flat toast-action">OK</button></a>'));
      Materialize.toast($toastContent, 4000, '', function() {
        window.open("../UI/login.html", "_self")
      })
    }
    else {
      var $toastContent = $('<span>Please Reset app from Help.</span>').add($('<a onclick="$(\'.button-collapse\').sideNav(\'show\');"><button class="btn-flat toast-action">RESET</button></a>'));
      Materialize.toast($toastContent, 4000, '', function() {
        $('.button-collapse').sideNav('show');
      })
    }
  };
  hitApi(url,sendData,apisuccess,apierror);
}
var totalCategories;
function createNav(id) {
  url='/category';
  sendData = {'catid': id}
  apisuccess = function (data, st, xhr) {
        setTitle(data.title)
        // listing = da.contains;
        listing = data.contains;
        searchInput.oninput = searchCategories;
        var updateBookCount = function(numCategories) {
          bookCountBadge.innerText = numCategories + ' items';
        };
        updateBookCount(listing.length);
        totalCategories = listing.length;
        if (totalCategories>paginateSplit) {
          $('#pagination').show();
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
  hitApi(url,sendData,apisuccess,function () {});
}


function navClick(id) {
  url = window.location.href.split('#')[0]+"#"+id;
  window.location.href = url;
}



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
  window.scrollTo(0, 100000);
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
  window.scrollTo(0, 100000);
}

function getFileType(item) {
  fileType = item.id.split(".")[1];
  if (fileType) {
      fileType = fileType.toUpperCase();
  }
  return fileType
}

function getIcon(fileType) {
  if (fileType=="MP3") {
    return "audiotrack"
  }
  else if (fileType=="PDF") {
    return "picture_as_pdf"
  }
  else if (fileType=="MP4") {
    return "video_library"
  }
  else {
    return ""
  }
}

function itemStringtoAppend(item) {
  fileType = getFileType(item);
  strBegin = " <li class=\"collection-item deep-purple-text\" id=\""+item.id+"\" onclick=\"navClick(this.id)\"><div>"+item.title+"<div class=\"secondary-content\"><i class=\"material-icons\">"
  icon = getIcon(fileType);
  strEnd = "</i></div></li>"
  p = strBegin+icon+strEnd
  return p
}

function setTitle(stri) {
  $('#crumbtitle').html(stri);
  $('#crumbtitle2').html(stri);
}

function createListingElements(initiation,condition,Categories) {
  for (var i = initiation; i < condition; i++) {
    item = Categories[i];
    p = itemStringtoAppend(item);
    $('#navi').append(p);
  }
}
