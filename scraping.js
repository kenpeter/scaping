// List of tools
// http://www.garethjames.net/a-guide-to-web-scrapping-tools/

// http://www.smashingmagazine.com/2015/04/web-scraping-with-nodejs/

var request = require("request");
var cheerio = require("cheerio");
var parse_url = require("parse_url");
var fs = require('fs');

var main_url = "http://ssps.unimelb.edu.au/research/employment-services-research-projects"; 

var main_domain_name = parse_url(main_url).domain;


request(main_url, function (error, response, body) {
  if (!error) {
    var $ = cheerio.load(body);
    var main_content = $("#main-content").html();
    var title = $("#main-content h2").html();    

    var images = $("img");
    /* 
    console.log('-start-');
    console.log(title);
    console.log('===================');
    console.log(main_content);
    console.log('-end-');
    */

    // http://stackoverflow.com/questions/7440001/iterate-over-object-keys-in-node-js 
    Object.keys(images).forEach(function(key) {
      var val = images[key];
      if(val.name == 'img') {
        var img_url = val.attribs.src;
        if(_is_internal_url(img_url, main_domain_name)) {
          //console.log('-internal-');
          //console.log(img_url);
        }
        else {
          //console.log('-ex-');
          //console.log(img_url);
        }

      }  
     
    });
   
  } else {
    console.log("We've encountered an error: " + error);
  }
});


// Define your func
function _is_internal_url(url, domain_name) {
/*
  Sample data:

/sites/ssps.unimelb.edu.au/files/images/employment-services-logos_2.png
http://ssps.unimelb.edu.au/sites/ssps.unimelb.edu.au/files/styles/medium/public/images/Mark_Siobhan.jpg?itok=_32U0Z8f
//ssps.unimelb.edu.au/sites/ssps.unimelb.edu.au/files/styles/medium/public/Jenny%2C%20Mark%2C%20Damon%20and%20Siobhan-6.jpg?itok=D0xCvOZ0
http://ssps.unimelb.edu.au/sites/ssps.unimelb.edu.au/files/styles/medium/public/images/wilma-gallet.jpg?itok=6ILBeUf9
http://ssps.unimelb.edu.au/sites/ssps.unimelb.edu.au/files/styles/medium/public/images/sue-olney.jpg?itok=PZJp-kzu
*/
  
  // Assume image url contains domain name is internal
  if( url.indexOf(domain_name) > -1 ) {
    return true;
  }
  else {
    return false;
  }
}
