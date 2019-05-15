const paths = require('./paths');
const path = require('path');
module.exports = {
    "metadata":{
      "creator":{
  		  "name": "Simon P. Daron",
	  	  "url": "https://www.linkedin.com/in/simon-daron-5b1bab8b/",
	  	  "email": "simon@surlaterre.org"
      }
	  },
    "clean": false,
    "plugins": {
        "metalsmith-drafts": true,
        "metalsmith-data": {
          "site": paths.contents+"/site.json"
        },
        "metalsmith-paths":{
          "property": "paths"
        },
        "metalsmith-xmp-reader":{
        },
        "metalsmith-default-values":[
          {
            pattern : '**/*.md',
            defaults: {
              title: function (file) {
                let title =  (file.paths.name == 'index')?file.paths.dir.split(path.sep).pop():file.paths.name;
                return title.match(/(^[\s\d\-\_]+)?(.*)$/)[2]; //delete leading -, numbers and space
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
