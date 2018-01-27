// // // source https://github.com/bvaughn/js-search
var search, listing = [];
// var results = [];
// // var rebuildAndRerunSearch = function() {
// //   // rebuildSearchIndex();
// //   searchCategories();
// // };
// // // var bookCountBadge = document.getElementById('bookCountBadge');
// //
// var updateBookCountAndTable = function() {
//   // updateBookCount(results.length);
//   if (results.length > 0) {
//     updateCategoriesTable(results,Cookies.get('CurrPage'));
//   } else if (!!searchInput.value) {
//     // updateCategoriesTable([],Cookies.get('CurrPage'));
//   } else {
//     updateBookCount(listing.length);
//     updateCategoriesTable(listing,Cookies.get('CurrPage'));
//   }
// };
// //
// var searchCategories = function() {
//   // results = search.search(searchInput.value);
//   updateBookCountAndTable();
// };
// //
// //
// //
// // var updateBookCount = function(numCategories) {
// //   bookCountBadge.innerText = numCategories + ' items';
// // };
// //
// var showElement = function(element) {
//   element.className = element.className.replace(/\s*hidden/, '');
// };
// // var bo = true;
// var updateCategoriesTable = function(Categories,parID) {
//   categoryListing(Categories,parID);
// };

var newSearch = function () {
  substring = document.getElementById('newSearchInput').value;
  // console.log(substring);
  substring = substring.toLowerCase()
  res = []
  for (x of listing) {
    elem = x.title.toLowerCase();
    if (elem.includes(substring)) {
        res.push(x)
    }
  }
  results = res;
  console.log(res);
    if (results.length > 0) {
      categoryListing(results,Cookies.get('CurrPage'));
    } else if (!!searchInput.value) {
      // updateCategoriesTable([],Cookies.get('CurrPage'));
      categoryListing([],Cookies.get('CurrPage'));
    } else {
      updateBookCount(listing.length);
      // updateCategoriesTable(listing,Cookies.get('CurrPage'));
      categoryListing(listing,Cookies.get('CurrPage'));
    }
  // categoryListing(results,Cookies.get('CurrPage'))
}


var searchInput = document.getElementById('newSearchInput');
searchInput.oninput = newSearch;
