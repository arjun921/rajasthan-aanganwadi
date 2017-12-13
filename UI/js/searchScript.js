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
    updateCategoriesTable(results);
  } else if (!!searchInput.value) {
    updateCategoriesTable([]);
  } else {
    updateBookCount(listing.length);
    updateCategoriesTable(listing);
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

var updateCategoriesTable = function(Categories) {

  var tokens = search.tokenizer.tokenize(searchInput.value);
  document.getElementById('navi').innerHTML = '';
  document.getElementById('pagination').innerHTML = '';
  var c = count+1;

  if (totalCategories>paginateSplit && start>=paginateSplit) {
    // p = "<p class=\"center\">Page: "+c+"</p>"
    // $('#navi').append(p);
    document.getElementById('pagination').innerHTML = '';
    p = "<li class=\"waves-effect\" onclick=\"loadPreviousList50()\"><a><i class=\"material-icons\">chevron_left</i></a></li>";
    $('#pagination').append(p);
  }
  for (var i = start, length = end; i < length; i++) {
    item = Categories[i];
    console.log(item);
    p = "<a class=\"collection-item\" onclick=\"navClick(this.id)\" id=\""+item.id+"\">"+item.title+"</a>";
    $('#navi').append(p);
  }

  if (Categories.length>end) {
    //conditionally show next button
    p="<li class=\"center\"><a id=\"pageNo\">Page: "+c+"</a></li>"
    $('#pagination').append(p);
    p = "<li class=\"waves-effect\" onclick=\"loadNextList50()\"><a><i class=\"material-icons\">chevron_right</i></a></li>";
    $('#pagination').append(p);

  }

};
