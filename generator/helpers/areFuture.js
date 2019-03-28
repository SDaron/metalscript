/**
 * Test if date is future
 *
 * @api public
 */

var moment = require('moment');
var debug = require('debug');

module.exports = function(collection, property) {


  if (!collection) {
      debug('helper "select": Collection is missing');
  }

  if (!property) {
      debug('helper "select": Pattern is missing');
  }

  function areFuture(obj) {
    // Si c'est un nombre
    let date = obj[property];
	  var isFuture = (date && (moment().diff(date, 'days') < 0))?true:false;
	  if(isFuture) {
		  return true;
	  }
	  return false;
  }

  return collection.filter(areFuture);
};

