/* eslint-env node */

const xmpReader = require('xmp-reader');

const minimatch = require('minimatch');
const DEFAULT_PATTERN = '**/*.+(gif|jpg|mp4|png)';

module.exports = function plugin(options) {
  return function(files, metalsmith, done){

    var matcher = minimatch.Minimatch(options.pattern || DEFAULT_PATTERN );

    setImmediate(done);
    Object.keys(files).forEach(function(file){

      if (!matcher.match(file)) {
        return;
      }
      var data = files[file];
      if (data.draft) delete files[file];

      try {
        xmpReader.fromBuffer(data.contents, (err, data) => {
          if (err) console.log(err);
          else files[file].xmp = data;
        });
      } catch(err) {
	      // got invalid data, handle error
      }
    });
  };
}
