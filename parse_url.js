/*
var url = 'https://www.facebook.com/100003379429021_356001651189146';
console.log( parseURL(url) );

var url = '/sites/ssps.unimelb.edu.au/files/images/employment-services-logos_2.png';
console.log( parseURL(url) );

var url = 'http://ssps.unimelb.edu.au/sites/ssps.unimelb.edu.au/files/styles/medium/public/images/Mark_Siobhan.jpg?itok=_32U0Z8f';
console.log( parseURL(url) );

var url = '//ssps.unimelb.edu.au/sites/ssps.unimelb.edu.au/files/styles/medium/public/images/Mark_Siobhan.jpg?itok=_123';
console.log( parseURL(url) );
*/

// http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string

module.exports = function(url) {
    parsed_url = {}

    if ( url == null || url.length == 0 )
        return parsed_url;

    protocol_i = url.indexOf('://');
    parsed_url.protocol = url.substr(0,protocol_i);

    remaining_url = url.substr(protocol_i + 3, url.length);
    domain_i = remaining_url.indexOf('/');
    domain_i = domain_i == -1 ? remaining_url.length - 1 : domain_i;
    parsed_url.domain = remaining_url.substr(0, domain_i);
    parsed_url.path = domain_i == -1 || domain_i + 1 == remaining_url.length ? null : remaining_url.substr(domain_i + 1, remaining_url.length);

    domain_parts = parsed_url.domain.split('.');
    switch ( domain_parts.length ){
        case 2:
          parsed_url.subdomain = null;
          parsed_url.host = domain_parts[0];
          parsed_url.tld = domain_parts[1];
          break;
        case 3:
          parsed_url.subdomain = domain_parts[0];
          parsed_url.host = domain_parts[1];
          parsed_url.tld = domain_parts[2];
          break;
        case 4:
          parsed_url.subdomain = domain_parts[0];
          parsed_url.host = domain_parts[1];
          parsed_url.tld = domain_parts[2] + '.' + domain_parts[3];
          break;
    }

    parsed_url.parent_domain = parsed_url.host + '.' + parsed_url.tld;

    return parsed_url;
}



