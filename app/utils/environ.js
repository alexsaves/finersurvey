/**
* Remaps config variables to be environment variables (if they exist)
* @type {exports}
*/
var pjson = require('../../package.json'),
  colors = require('colors');

/**
* Recursively crawl a node of the config
* @param obj
* @param root
*/
function crawlRewrite(obj, root) {
  root = root || '';
  if (root.length > 0) {
    root = root + '_';
  }
  for (var elm in obj) {
    if (elm != 'scripts' && elm != 'name' && elm != 'dependencies' && elm != 'devDependencies' && elm != 'version' && elm != 'main' && elm != 'author' && elm != 'license' && elm != 'description') {
      if (typeof(obj[elm]) == 'object') {
        crawlRewrite(obj[elm], root + elm);
      } else {
        var key = pjson.name + '_' + root + elm;
        console.log("Reading environment variable ".yellow + key.magenta + "...", (typeof(process.env[key]) != 'undefined') ? "Found.".green : "Not found.".red);
        obj[elm] = typeof(process.env[key]) != 'undefined' ? process.env[key] : obj[elm];
      }
    }
  }
}

// Begin the recursive crawling.
crawlRewrite(pjson);

// Expose the result
module.exports = pjson;