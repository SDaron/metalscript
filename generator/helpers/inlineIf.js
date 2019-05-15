/**
 * select.js
 * @param  {Array} `array` Collection of files.
 * @param  {String} `path` minimatch path.
 * @return {Array}
 * @api public
 */

module.exports = function(string, ifTrue, ifFalse, options) {
    return string?ifTrue:ifFalse;
};

