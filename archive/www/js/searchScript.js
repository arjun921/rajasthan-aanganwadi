// source https://github.com/bvaughn/js-search
var search, results, listing = [];

var rebuildAndRerunSearch = function() {
  rebuildSearchIndex();
  searchCategories();
};

var rebuildSearchIndex = function() {
  search = new JsSearch.Search('isbn');
  search.tokenizer = new JsSearch.StemmingTokenizer(stemmer, search.tokenizer);
  search.indexStrategy =  eval('new ' + "JsSearch.AllSubstringsIndexStrategy" + '()');
  search.sanitizer =  eval('new ' + "JsSearch.LowerCaseSanitizer" + '()');;
  search.searchIndex = new JsSearch.TfIdfSearchIndex('isbn');
  search.addIndex('title');
  search.addDocuments(listing);
};
var searchInput = document.getElementById('searchInput');
var bookCountBadge = document.getElementById('bookCountBadge');

var updateBookCountAndTable = function() {
  updateBookCount(results.length);

  if (results.length > 0) {
    updateCategoriesTable(results,Cookies.get('CurrPage'));
  } else if (!!searchInput.value) {
    updateCategoriesTable([],Cookies.get('CurrPage'));
  } else {
    updateBookCount(listing.length);
    updateCategoriesTable(listing,Cookies.get('CurrPage'));
  }
};

var searchCategories = function() {
  results = search.search(searchInput.value);
  updateBookCountAndTable();
};

searchInput.oninput = searchCategories;

var updateBookCount = function(numCategories) {
  bookCountBadge.innerText = numCategories + ' items';
};
var hideElement  = function(element) {
  element.className += ' hidden';
};
var showElement = function(element) {
  element.className = element.className.replace(/\s*hidden/, '');
};
var bo = true;
var updateCategoriesTable = function(Categories,parID) {
  var tokens = search.tokenizer.tokenize(searchInput.value);
  var pages =  Math.floor(totalCategories/paginateSplit);
  var remainder = (totalCategories/paginateSplit)-pages;
  if (remainder==0) {
    totalPages = pages;
  }
  else {
    totalPages = pages+1;
  }
  document.getElementById('navi').innerHTML = '';
  document.getElementById('pagination').innerHTML = '';
  if (parID!="_ROOT_") {
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
      document.getElementById('pagination').innerHTML = '';
      p = "<li class=\"waves-effect\" onclick=\"loadPreviousList50()\"><a><i class=\"material-icons\">chevron_left</i></a></li>";
      $('#pagination').append(p);
      if (first) {
        p="<li class=\"center\"><a id=\"pageNo\">Page: "+c+"/"+totalPages+"</a></li>"
        $('#pagination').append(p);
        first = false;
      }
    }
    createListingElements(start,end,Categories);
    if (Categories.length>end) {
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
      p = "<li class=\"disabled\" ><a><i class=\"material-icons\">chevron_right</i></a></li>";
      $('#pagination').append(p);
    }
  }

};
