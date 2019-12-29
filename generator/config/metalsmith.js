const paths = require('./paths');
const path = require('path');
module.exports = {
    "metadata":{
      "creator":{
  		  "name": "Simon Daron",
	  	  "url": "http://simon.surlaterre.org/",
	  	  "email": "simon@surlaterre.org"
      }
	  },
    "clean": false,
    "plugins": {
        "metalsmith-drafts": true,
        "metalsmith-data": {
          "site": paths.config+"/site.json",
          "nextcloud": {
             src: paths.nextcloud+"/nextcloud.json",
             options: {
               ignoreMissingFile: true, //do not throw an error if the file is missing. Defaults to "false"
             }          
          }
        },
        "metalsmith-paths":{
          "property": "paths"
        },
        "metalsmith-xmp-reader":{
          pattern: '**/*.+(jpeg|jpg|png)'
        },
        "metalsmith-default-values":[
          {
            pattern : '**/*.*',
            defaults: {
              title: function (file) {
                let title =  (file.paths.name == 'index')?file.paths.dir.split(path.sep).pop():file.paths.name;
                return title.match(/(^[\s\d\-\_]+)?(.*)$/)[2].replace(/_/g, ' '); //delete leading -, numbers and space
              }
            }
          }
        ],
        "metalsmith-slug": {},
        "metalsmith-i18n":{
            "default":   "fr",
            "locales":   ["fr", "en"],
            "directory": paths.locales
        },
        "metalsmith-collections": {
			"$": "**/*",
			"files": "**/*.{pdf,docx,ods,odt}",
			"images": "**/*.{png,gif,jpg,jpeg}",
			"sounds": "**/*.{mp3,ogg,wav}",
			"home": {
				"pattern": "index.md"
			},
			"secteurs": {
				"pattern": "*/index.md",
				"sortBy": "order"
			},
			"pages": {
				"pattern": "**/*.md",
				"sortBy": "path",
				"reverse": true
			}
        },
        "metalsmith-collection-metadata":{
        },
        "metalsmith-register-helpers": {
            "directory": paths.helpers
        },
        "metalsmith-discover-partials": {
          "directory": paths.partials
        },
        "metalsmith-in-place": {
            "suppressNoFilesError":true,
            "engineOptions": {
                "dialect":"",
                "html": true,
                "linkify": true,
                "typographer": true
              }
        },
        "metalsmith-untemplatize": {
          "key": "body"
        },
        "metalsmith-layouts": {
            "pattern":"**/*.html",
            "default":"default.hbs",
            "suppressNoFilesError":true,
            "engine": "handlebars",
            "directory": paths.layouts
        },
        "metalsmith-html-minifier": {
            "pattern": "**/*.html",
            "minifierOptions":{
              "minifyJS":true,
              "minifyCSS":{inline: ['all']},
              "removeComments":true
            }
        }
    }
}
