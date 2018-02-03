//getHTML* functions are used to seperate HTML code from app logic.
//getHTML* functions are declared in returnHtml.js

//global variables
var start, end, totalCategories;
var paginateSplit = 20; // split after n listing
var count = 0;

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
}

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
  } else {
    hitApi('/category', sendData, apisuccess, apierror);
  }
}

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

function reINT() { //re-run functions to be run on document ready/page shown
  count = 0;
  showSearch();
  enableHamburgerMenu();
  $('#preloader').hide();
  $('#searchForm').hide();
  $('#pagination').hide();
  if (window.location.href.split('#').length == 1) { //hash not present, load root category
    createNav('_ROOT_');
  } else { // hash is present
    if (window.location.href.split('#')[1] == "help") { //do nothing for loading help modal
      //pass
    } else if (location.hash.split(".").length < 2) { //if hash value present, split and create nav for hash
      createNav(window.location.href.split('#')[1]);
    } else {
      if (Cookies.get('currenttoken')) { //if logged in, open content
        load_content(window.location.href.split('#')[1]);
      } else { //not logged in, show login page
        window.location.href = "login.html";
      }
    }
  }
}

function loadmp4(data) {
  fileDownLink = server+data.url
  Cookies.set('fileDownLink',fileDownLink);
  p = getHTMLVideoPlayer(data);
  $('#preloader').hide();
  $('#content').append(p);
}

function loadmp3(data) {
  fileDownLink = server+data.url
  Cookies.set('fileDownLink',fileDownLink);
  p = getHTMLAudioPlayer(data)
  $('#preloader').hide();
  $('#content').append(p);
}

function loadpdf(data) {
  flink = 'https://docs.google.com/viewer?url=' + server + data.url + "&pid=explorer&efh=false&a=v&chrome=false&embedded=true"
  fileDownLink = server + data.url
  p = getHTMLPDFViewer(flink,fileDownLink);
  Cookies.set('fileDownLink',fileDownLink);
  // $("#MenuDownload").attr("href", fileDownLink);
  $('#content').append(p);
}

function downloadFile(){
  window.open(Cookies.get('fileDownLink'), '_system', 'location=yes');
  // window.open('https://www.google.com/', '_system', 'location=yes');
}

function pdfLoaded() {
  $('#closeIcon').addClass('black-text');
  $('#MenuDownload').addClass('black-text');
  $('#closeTabletIcon').addClass('black-text');
  $('#TabletIconDownload').addClass('black-text');
  $('#CloseTablet').removeClass('tabletClose');
  $('#CloseTablet').addClass('tabletClosePdf');
  $('#TabletDownload').removeClass('tabletDownload');
  $('#TabletDownload').addClass('tabletDownloadPdf');
  $('#preloader').hide();
}

function loadImage(data){
  p = getHTMLimageView(data);
  $('#content').append(p);
}

function navClick(id) {
  url = window.location.href.split('#')[0] + "#" + id;
  window.location.href = url;
  window.scrollTo(0, 0);
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

function createListingElements(initiation, condition, Categories) {//listing categories and files
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
  } else if (['jpg','png'].indexOf(ftype)!=-1 ){
    loadImage(data)
  }
}

function hideSearch() {
  $('#searchFab').hide();
}

function showSearch() {
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
  }
  toastWithAction(msg, href, action)
}


function categoryListing(Categories, parID) { //this function is called in searchScript.js
  var pages = Math.floor(totalCategories / paginateSplit);
  var remainder = (totalCategories / paginateSplit) - pages;
  if (remainder == 0) {
    totalPages = pages;
  } else {
    totalPages = pages + 1;
  }
  document.getElementById('navi').innerHTML = '';
  $('#pagination').removeClass('card-panel');
  document.getElementById('pagination').innerHTML = '';
  if (parID != "_ROOT_" && !$('#searchForm').is(':visible') && location.hash != "") {
    s = getHTMLCategoryUp();
    $('#navi').append(s);
  }
  if (Categories.length < paginateSplit) {
    createListingElements(0, Categories.length, Categories);
  } else {
    var c = count + 1;
    first = true;
    if (totalCategories > paginateSplit && start >= paginateSplit) {
      $('#pagination').removeClass('card-panel');
      document.getElementById('pagination').innerHTML = '';
      $('#pagination').addClass('card-panel');
      p = "<li class=\"waves-effect\" onclick=\"loadPreviousList50()\"><a><i class=\"material-icons\">chevron_left</i></a></li>";
      $('#pagination').append(p);
      $('#pagination').addClass('card-panel');
      if (first) {
        p = "<li class=\"center\"><a id=\"pageNo\">Page: " + c + "/" + totalPages + "</a></li>"
        $('#pagination').append(p);
        $('#pagination').addClass('card-panel');
        first = false;
      }
    }
    createListingElements(start, end, Categories);
    if (Categories.length > end) {
      $('#pagination').addClass('card-panel');
      if (first) {//conditionally show next button
        p = "<li class=\"disabled\"><a><i class=\"material-icons\">chevron_left</i></a></li>";
        $('#pagination').append(p);
        p = "<li class=\"center\"><a id=\"pageNo\">Page: " + c + "/" + totalPages + "</a></li>"
        $('#pagination').append(p);
        first = false;
      }
      p = "<li class=\"waves-effect\" onclick=\"loadNextList50()\"><a><i class=\"material-icons\">chevron_right</i></a></li>";
      $('#pagination').append(p);
    } else if (Categories.length == end) {
      $('#pagination').addClass('card-panel');
      p = "<li class=\"disabled\" ><a><i class=\"material-icons\">chevron_right</i></a></li>";
      $('#pagination').append(p);
    }
  }
}

function createNavSuccess(data, id) {
  setTitle(data.title)
  listing = data.contains;
  totalCategories = listing.length;
  if (totalCategories > paginateSplit) {//list longer than paginateSplit
    $('#pagination').show();
    start = 0;
    end = paginateSplit;
  } else {//list shorter than paginateSplit
    start = 0;
    end = totalCategories;
  }
  categoryListing(listing, id);
}
