// List of tools
// http://www.garethjames.net/a-guide-to-web-scrapping-tools/

// http://www.smashingmagazine.com/2015/04/web-scraping-with-nodejs/

var request = require("request");
var http = require('http');
var cheerio = require("cheerio");
var parse_url = require("parse_url");

var math = require('mathjs');
var fs = require('fs');

var LineByLineReader = require('line-by-line');
var lr = new LineByLineReader('input/urls.txt');
var replaceStream = require('replacestream');
var path = require('path');

var buffer = [];
var main_url = '';
var main_domain_name = '';
var new_domain_name = "ssps_scraping.local";

var site_home_dir = "../ssps_scaping";

// Sample path: /sites/ssps_scraping.local/files/images/employment-services-logos_2.png
var saved_img_file_path = site_home_dir + "/sites/" + new_domain_name + "/files/images";


// http://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js
var save_image_callback = function(url) {
  // http://stackoverflow.com/questions/4758103/last-segment-of-url
  var file_name = url.substr(url.lastIndexOf('/') + 1);
  if(file_name.lastIndexOf('?') > -1 ) {
    file_name = file_name.substr(0, file_name.lastIndexOf('?'));
  }
  else {

  }

  var file_name = saved_img_file_path + "/" + file_name;
  var file = fs.createWriteStream(file_name);
  var request = http.get(url, function(response) {
    response.pipe(file);
  });
}


lr.on('error', function (err) {
  
});

lr.on('line', function (line) {
  console.log('Processing: ' + line);

  main_url = line;
  main_domain_name = parse_url(main_url).domain;

  request(main_url, function (error, response, body) {
    if (!error) {
      var $ = cheerio.load(body);
      var main_content = $("#main-content").html();
      var title = $("#main-content h2").html();    

      /* 
      console.log('-start-');
      console.log(title);
      console.log('===================');
      console.log(main_content);
      console.log('-end-');
      */
      
      var file_name = _get_end_url_name(line);
      _write_html_file(main_content, file_name);

     
      // Processing images
      var images = $("img");      
      // http://stackoverflow.com/questions/7440001/iterate-over-object-keys-in-node-js 
      Object.keys(images).forEach(function(key) {
        var val = images[key];
        if(val.name == 'img') {
          var img_url = val.attribs.src;
          if(_is_internal_url(img_url, main_domain_name)) {
            img_url = _complete_url(img_url, main_domain_name, save_image_callback);
          }
          else {
            
          }

        }
      });
     
    } else {
      console.log("We've encountered an error: " + error);
    }
  });
  
});

lr.on('end', function () {
  // Do a find and replace for the domain name
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


function _complete_url(url, domain_name, callback) {
  var complete_url = url;
  var protocol = 'http';
  if(url.charAt(0) == '/' && url.charAt(1) != '/') {
    // /sites/ssps.unimelb.edu.au/files/images/employment-services-logos_2.png
    complete_url = protocol + '://' + domain_name + url;
  }
  else if(url.charAt(0) == '/' && url.charAt(1) == '/') {
    //ssps.unimelb.edu.au/sites/ssps.unimelb.edu.au/files/styles/medium/public/Jenny%2C%20Mark%2C%20Damon%20and%20Siobhan-6.jpg?itok=D0xCvOZ0
    complete_url = protocol + ':' + url;
  }
  else {
    // No need to complete.

  }

  //console.log(complete_url);
  callback(complete_url);

  return complete_url;
}


function _get_end_url_name(url) {
  var file_name = url.substr(url.lastIndexOf('/') + 1);
  return file_name;
}


function _write_html_file(main_content, file_name) {
  var full_file_name = site_home_dir + "/" + file_name + '.html';

  // Output
  console.log('write html: ' + full_file_name);

  main_content = main_content.replace(main_domain_name, new_domain_name);

  // http://stackoverflow.com/questions/2496710/writing-files-in-node-js
  fs.writeFile(full_file_name, main_content, function(err) {
    if(err) {
        return console.log(err);
    }
  });
}
    
  
 








