var start, end, totalCategories;
var paginateSplit = 20;
var count = 0;
// ############### API CALLs Begin #########################---------------------------->
function load_content(contentID) {
  onContentLoad();
  sendData = {
    "token": Cookies.get('currenttoken'),
    'fname': contentID
  }
  apisuccess = function(data, st, xhr) {
    $('#content').show();
    $('#content').html('');
    setTitle(data.meta.title);
    loadFileByType(data);
  };
  apierror = function(returnval) {
    if (returnval.status == 404) {
      contentNotFound()
    } else if (returnval.status == 403) {
      contentNoLogin()
    } else {
      contentUnkError()
    }
  };
  hitApi('/content', sendData, apisuccess, apierror);
} //load_content ends -------->

function createNav(id) {
  sendData = {
    'catid': id
  }
  apisuccess = function(data, st, xhr) {
    sessionStorage.setItem(id, JSON.stringify(data));
    Cookies.set('CurrPage', data.id);
    createNavSuccess(data, data.id)
  }
  apierror = function(returnval) {
    if (returnval.status == 404) {
      serverDown()
    } else if (returnval.status == 403) {
      contentNoLogin()
    } else {
      contentUnkError()
    }
  };
  if (sessionStorage.getItem(id)) {
    data = (JSON.parse(sessionStorage.getItem(id)));
    createNavSuccess(data, id)
    }
    else {
      hitApi('/category', sendData, apisuccess, apierror);
    }
  } //create Nav ends --------------------------------------------------->


  window.onhashchange = change;

  window.onpageshow = function(event) {
    reINT();
    setTitle("Activity");
  };

  function change() {
    $('#content').html('');
    $('#content').hide();
    reINT();
  }

  function reINT() {
    //run functions to be run on document ready
    count = 0;
    showSearch();
    enableHamburgerMenu();
    $('#preloader').hide();
    $('#searchForm').hide();
    $('#pagination').hide();
    if (window.location.href.split('#').length == 1) {
      createNav('_ROOT_');
    } else {
      if (window.location.href.split('#')[1] == "help") {
        //do nothing for loading help modal
      } else if (location.hash.split(".").length < 2) {
        //if hash value present, split and create nav for hash
        createNav(window.location.href.split('#')[1]);
      } else {
        if (Cookies.get('currenttoken')) {
          load_content(window.location.href.split('#')[1]);
          // document.getElementById('docIframe').onload = function() {
          //   $('#preloader').hide();
          // }
        } else {
          window.location.href = "login.html";
        }

      }
    }
  }

  function loadmp4(data) {
    p = getHTMLVideoPlayer(data);
    $('#preloader').hide();
    $('#content').append(p);
  }

  function loadmp3(data) {
    p = getHTMLAudioPlayer(data)
    $('#preloader').hide();
    $('#content').append(p);
  }


  function loadpdf(data) {
    flink = 'https://docs.google.com/viewer?url=' + server + data.url + "&pid=explorer&efh=false&a=v&chrome=false&embedded=true"
    p = getHTMLPDFViewer(flink);
    $('#content').append(p);
  }



  function navClick(id) {
    url = window.location.href.split('#')[0] + "#" + id;
    window.location.href = url;
  }

  function loadNextList50() {
    count += 1
    var numTimesPaginate = Math.floor(totalCategories / paginateSplit);
    if (count < numTimesPaginate) {
      start += paginateSplit
      end = start + paginateSplit
    } else {
      start += paginateSplit
      end = start + (totalCategories - start);
    }
    categoryListing(listing);
    window.scrollTo(0, 100000);
  }

  function loadPreviousList50() {
    count -= 1
    var numTimesPaginate = Math.floor(totalCategories / paginateSplit);
    if (count < numTimesPaginate) {
      start -= paginateSplit
      end = start + paginateSplit
    } else {
      start -= paginateSplit
      end = start + (totalCategories - start);
    }
    categoryListing(listing);
    window.scrollTo(0, 100000);
  }

  function getFileType(item) {
    fileType = item.id.split(".")[1];
    if (fileType) {
      return fileType.toUpperCase();
    }
  }

  function getIcon(fileType) {
    if (fileType == "MP3") {
      return ["audiotrack", ]
    } else if (fileType == "PDF") {
      return "picture_as_pdf"
    } else if (fileType == "MP4") {
      return "video_library"
    } else {
      return ""
    }
  }


  function createListingElements(initiation, condition, Categories) {
    for (var i = initiation; i < condition; i++) {
      item = Categories[i];
      p = getHTMLCategoryFileListElement(item);
      $('#navi').append(p);
    }
  }

  function loadFileByType(data) {
    ftype = (data.url.split('.').pop());
    if (ftype == "mp4") {
      loadmp4(data)
    } else if (ftype == "mp3") {
      loadmp3(data)
    } else if (ftype == "pdf") {
      loadpdf(data)
    }
  }

  function hideSearch() {
    // $('#backFab').show();
    $('#searchFab').hide();
  }

  function showSearch() {
    // $('#backFab').hide();
    $('#searchFab').show();
  }

  function onContentLoad() {
    $('#preloader').show();
    $('#navi').html('');
    setTitle("Loading file");
    hideSearch();
    disableHamburgerMenu();
  }

  function contentNotFound() {
    msg = 'File Not Found'
    href = 'javascript:history.back()'
    action = function() {
      window.history.back();
    }
    toastWithAction(msg, href, action)
  }

  function serverDown() {
    msg = 'Category unavailable'
    href = 'javascript:history.back();clearInterval(spinid);$("#spinner").hide();'
    action = function() {
      window.history.back();
      clearInterval(spinid);
      $("#spinner").hide();
    }
    toastWithAction(msg, href, action)
  }

  function contentNoLogin() {
    out_changes();
    msg = 'Please Login to view.'
    href = 'login.html'
    action = function() {
      window.open("login.html", "_self")
    }
    toastWithAction(msg, href, action)
  }

  function contentUnkError() {
    msg = 'Unknown error'
    href = 'javascript:$(\'.button-collapse\').sideNav(\'show\');'
    action = function() {
      clearInterval(spinid);
      $("#spinner").hide();
      // $('.button-collapse').sideNav('show');
    }
    toastWithAction(msg, href, action)
  }


function categoryListing(Categories,parID) {//this function is called in searchScript.js
  var pages =  Math.floor(totalCategories/paginateSplit);
  var remainder = (totalCategories/paginateSplit)-pages;
  if (remainder==0) {
    totalPages = pages;
  }
  else {
    totalPages = pages+1;
  }
  document.getElementById('navi').innerHTML = '';
  $('#pagination').removeClass('card-panel');
  document.getElementById('pagination').innerHTML = '';
  if (parID!="_ROOT_" && !$('#searchForm').is(':visible') && location.hash!="") {
    s = getHTMLCategoryUp();
    $('#navi').append(s);
  }
  if (Categories.length<paginateSplit) {
    createListingElements(0,Categories.length,Categories);
  }
  else {
    var c = count+1;
    first = true;
    if (totalCategories>paginateSplit && start>=paginateSplit) {
      $('#pagination').removeClass('card-panel');
      document.getElementById('pagination').innerHTML = '';
      $('#pagination').addClass('card-panel');
      p = "<li class=\"waves-effect\" onclick=\"loadPreviousList50()\"><a><i class=\"material-icons\">chevron_left</i></a></li>";
      $('#pagination').append(p);
      $('#pagination').addClass('card-panel');
      if (first) {
        p="<li class=\"center\"><a id=\"pageNo\">Page: "+c+"/"+totalPages+"</a></li>"
        $('#pagination').append(p);
        $('#pagination').addClass('card-panel');
        first = false;
      }
    }
    createListingElements(start,end,Categories);
    if (Categories.length>end) {
      $('#pagination').addClass('card-panel');
      //conditionally show next button
      if (first) {
        p = "<li class=\"disabled\"><a><i class=\"material-icons\">chevron_left</i></a></li>";
        $('#pagination').append(p);
        p="<li class=\"center\"><a id=\"pageNo\">Page: "+c+"/"+totalPages+"</a></li>"
        $('#pagination').append(p);
        first = false;
      }
      p = "<li class=\"waves-effect\" onclick=\"loadNextList50()\"><a><i class=\"material-icons\">chevron_right</i></a></li>";
      $('#pagination').append(p);

    }
    else if (Categories.length==end) {
      $('#pagination').addClass('card-panel');
      p = "<li class=\"disabled\" ><a><i class=\"material-icons\">chevron_right</i></a></li>";
      $('#pagination').append(p);
    }
  }

}
function createNavSuccess(data, id) {
  setTitle(data.title)
  listing = data.contains;
  // searchInput.oninput = searchCategories;
  // var updateBookCount = function(numCategories) {
  //   bookCountBadge.innerText = numCategories + ' items';
  // };
  // updateBookCount(listing.length);
  totalCategories = listing.length;
  if (totalCategories > paginateSplit) {
    $('#pagination').show();
    start = 0;
    end = paginateSplit;
  } else {
    start = 0;
    end = totalCategories;
  }
  // updateCategoriesTable(listing, id);
  categoryListing(listing, id);
}
