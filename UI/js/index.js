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
    console.log(data.url);
    $('#content').show();
    $('#content').html('');
    setTitle(contentID);
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

function createNavSuccess(listing, id) {
  searchInput.oninput = searchCategories;
  var updateBookCount = function(numCategories) {
    bookCountBadge.innerText = numCategories + ' items';
  };
  updateBookCount(listing.length);
  totalCategories = listing.length;
  if (totalCategories > paginateSplit) {
    $('#pagination').show();
    start = 0;
    end = paginateSplit;
  } else {
    start = 0;
    end = totalCategories;
  }
  showElement(indexedCategoriesTable);
  rebuildSearchIndex();
  updateCategoriesTable(listing, id);
}

function createNav(id) {
  sendData = {
    'catid': id
  }
  apisuccess = function(data, st, xhr) {
    console.log("create Nav success being called");
    setTitle(data.title)
    listing = data.contains;
    console.log(data.id);
    // Cookies.set(id, listing);
    sessionStorage.setItem(id, JSON.stringify(listing));
    // console.log(id);
    // console.log(listing);
    Cookies.set('CurrPage', data.id);
    createNavSuccess(listing, data.id)
  }
  if (sessionStorage.getItem(id)) {
    console.log("If Called");
    listing = (JSON.parse(sessionStorage.getItem(id)));
    createNavSuccess(listing, id)
    }
    else {
      console.log("Else called");
      hitApi('/category', sendData, apisuccess, function() {});
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
          document.getElementById('docIframe').onload = function() {
            $('#preloader').hide();
          }
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
    flink = 'https://docs.google.com/viewer?url=' + link + data.url + "&pid=explorer&efh=false&a=v&chrome=false&embedded=true"
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
    updateCategoriesTable(listing);
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
    updateCategoriesTable(listing);
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
    } else if (fileType == "UP") {
      console.log("history");
      return "history"
    } else {
      return ""
    }
  }

  function setTitle(stri) {
    $('#crumbtitle').html(stri);
    $('#crumbtitle2').html(stri);
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

  function contentNoLogin() {
    out_changes();
    msg = 'Please Login to view.'
    href = '../UI/login.html'
    action = function() {
      window.open("../UI/login.html", "_self")
    }
    toastWithAction(msg, href, action)
  }

  function contentUnkError() {
    msg = 'Please Reset app from Help.'
    href = 'javascript:$(\'.button-collapse\').sideNav(\'show\');'
    action = function() {
      $('.button-collapse').sideNav('show');
    }
    toastWithAction(msg, href, action)
  }
