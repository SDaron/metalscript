/**
 * Concatenate all parameters into string
 *
 * @api public
 */

module.exports = function () {
      var outStr = '';
      for(var arg in arguments){
          if(typeof arguments[arg]!='object'){
              outStr += arguments[arg];
          }
      }
      return outStr;

};

