/**
 * Parse and format a date value using Moment.js.
 *
 * @api public
 */
//var moment = require('moment');
module.exports = function (date, format,locale) {
    try {
      var moment = require('moment');

      if(typeof locale === 'string') moment.locale(locale); else moment.locale('fr');

      //if(typeof format === 'string') moment.locale(locale); else moment.locale('fr');
      //console.log(typeof date,date, format,typeof locale === 'string',moment.locale());
      //return moment(date?date:false).format(format);

      if(date) return moment(date).format(format); else return moment().format(format);
    }
    catch(error) {
      console.error(error);
      return false;
    }
}
//module.exports = require('helper-date');
