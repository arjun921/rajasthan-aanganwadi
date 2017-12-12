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
  document.getElementById('navi').innerHTML = '';
  var tokens = search.tokenizer.tokenize(searchInput.value);
  for (var i = 0, length = Categories.length; i < length; i++) {
    item = Categories[i];
    p = "<a class=\"collection-item\" onclick=\"navClick(this.id)\" id=\""+item.id+"\">"+item.title+"</a>";
    $('#navi').append(p);
  }
};
