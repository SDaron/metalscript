/**
 * Test if date is future
 *
 * @api public
 */

var moment = require('moment');
module.exports = function (date) {
	var isFuture = (date && (moment().diff(date, 'days') < 0))?true:false;
	if(isFuture) {
		return true;
	}
	return false;
};

