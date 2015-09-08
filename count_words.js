// http://www.smashingmagazine.com/2015/04/web-scraping-with-nodejs/
// https://gist.github.com/elliotbonneville/1bf694b8c83f358e0404

var request = require("request");
var cheerio = require("cheerio");
var url = "https://www.google.com/search?q=data+mining";
  
var corpus = {};
var totalResults = 0;
var resultsDownloaded = 0;

function callback () {
  resultsDownloaded++;
  
  if (resultsDownloaded !== totalResults) {
    return;
  }
  
  var words = [];
  
  // stick all words in an array
  for (prop in corpus) {
    words.push({
      word: prop,
      count: corpus[prop]
    });
  }
  
  // sort array based on how often they occur
  words.sort(function (a, b) {
    return b.count - a.count;
  });
  
  // finally, log the first fifty most popular words
  console.log(words.slice(0, 20));
}

request(url, function (error, response, body) {
  if (error) {
    console.log("Couldn't get page because of error: " + error);
    return;
  }
 
  //test
  //debugger;
 
  // load the body of the page into Cheerio so we can traverse the DOM
  // Body is the entire search result html page.
  var $ = cheerio.load(body),
    links = $(".r a"); // result link.
   
  // It ignores all the ads on top 
  links.each(function (i, link) {
    //test
    //debugger;

    // get the href attribute of each link
    var url = $(link).attr("href");
    
    // strip out unnecessary junk
    // Sample data: '/url?q=https://en.wikipedia.org/wiki/Data_mining&sa=U&ved=0CCoQFjAAahUKEwiR4pS0-... (length: 137)'
    // url == 'https://en.wikipedia.org/wiki/Data_mining'
    url = url.replace("/url?q=", "").split("&")[0];
    
    if (url.charAt(0) === "/") {
      return;
    }
    
    // this link counts as a result, so increment results
    totalResults++;
    
    // download that page
    // It is very interesting, links.each runs a couple time, then
    // this request runs. it is asynchronous 
    request(url, function (error, response, body) {
      //test
      //debugger;

      if (error) {
        console.log("Couldn't get page because of error: " + error);
        return;
      }
     
      // load the page into cheerio
      // The body is html body
      var $page = cheerio.load(body),
        text = $page("body").text();
        
      // throw away extra whitespace and non-alphanumeric characters
      // all lower and alphan and num
      text = text.replace(/\s+/g, " ")
             .replace(/[^a-zA-Z ]/g, "")
             .toLowerCase();
           
 
      // split on spaces for a list of all the words on that page and 
      // loop through that list
      text.split(" ").forEach(function (word) {

        //test
        //debugger;

        // we don't want to include very short or long words, as they're 
        // probably bad data
        // 4 ------------- 20 length word
        if (word.length < 4 || word.length > 20) {
          return;
        }
        
        if (corpus[word]) {
          // if this word is already in our "corpus", our collection
          // of terms, increase the count by one
      
          // so the same words get counted.
          corpus[word]++;
        } else {
          // otherwise, say that we've found one of that word so far
          corpus[word] = 1;
        }
      });
      
      // and when our request is completed, call the callback to wrap up!
      callback();
    });
  });
});
