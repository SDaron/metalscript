/**
 * typeof.js
 */
var extend = require('extend-shallow');
module.exports = function (path, options) {
    var opts = {};
    extend(opts, options.hash);
    var result = [];
    var crumbs = path.split("/");
    for (var i = 0; i < crumbs.length; i++) {
        result.push((result[i-1]?result[i-1]+"/":"")+crumbs[i]);
    }
    if(opts.suffix || opts.prefix){
      for (var i = 0; i < result.length; i++) {
          result[i] = (opts.prefix?opts.prefix:'')+result[i]+(opts.suffix?opts.suffix:'');
      }
    }
    return result;
}
