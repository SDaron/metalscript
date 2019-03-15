/**
 * select.js
 * @param  {Array} `array` Collection of files.
 * @param  {String} `path` minimatch path.
 * @return {Array}
 * @api public
 */
var multimatch = require("multimatch");
var minimatch = require("minimatch");
var extend = require('extend-shallow');
var debug = require('debug');

module.exports = function(collection, pattern, options) {
  var opts = {};
  extend(opts, options.hash);

  if (!collection) {
      debug('helper "select": Collection is missing');
      return false;
  }

  if (!pattern) {
      debug('helper "select": Pattern is missing');
      return false;
  }


  if (!pattern) {
      debug('helper "select": Pattern is not a string:', pattern);
      return false;
  }
  //console.log(typeof collection,typeof pattern);
  if (typeof collection === 'object' && typeof pattern === 'string') {
    var selected = [];
    for (var i = 0; i < collection.length; i++) {
        //debug('check',collection[i].path, opts.pattern,multimatch(collection[i].path, opts.pattern)?'multimatched':'');
        if (multimatch(collection[i].path, pattern).length > 0) {
           //debug(collection[i].path,'+',pattern,'=',multimatch(collection[i].path, pattern));
           selected.push(collection[i]);
        }
    }
    debug('collection = ',collection.length, 'pattern = ',pattern,'selected = ',selected.length);

    if (opts && 'function' == typeof opts.sort) {
       selected.sort(opts.sort);
    } else if (opts && 'string' == typeof opts.sort)  {
       selected.sort(function(a, b){
        a = a[opts.sort];
        b = b[opts.sort];
        if (!a && !b) return 0;
        if (!a) return -1;
        if (!b) return 1;
        if (b > a) return -1;
        if (a > b) return 1;
        return 0;
      });
    }

    if (opts && opts.reverse)  selected.reverse();
    //return  selected;
    var result = '';

      for (var i = 0; i < selected.length; i++) {
        result += options.fn(selected[i]);
      }
    return result;
  }
};

