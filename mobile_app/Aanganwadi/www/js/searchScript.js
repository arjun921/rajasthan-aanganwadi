
var search, listing = [];

function updateBookCount(num) {
  document.getElementById('bookCountBadge').innerText = num + " results"
}

var newSearch = function () {
  substring = document.getElementById('newSearchInput').value;
  substring = substring.toLowerCase()
  res = []
  for (x of listing) {
    elem = x.title.toLowerCase();
    if (elem.includes(substring)) {
        res.push(x)
    }
  }
  results = res;
    if (results.length > 0) {
      updateBookCount(results.length);
      categoryListing(results,Cookies.get('CurrPage'));
    } else if (!!searchInput.value) {
      categoryListing([],Cookies.get('CurrPage'));
    } else {
      updateBookCount(listing.length);
      categoryListing(listing,Cookies.get('CurrPage'));
    }
}


var searchInput = document.getElementById('newSearchInput');
searchInput.oninput = newSearch;//on input run search. 
