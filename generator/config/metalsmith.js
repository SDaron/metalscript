const paths = require('./paths');
const path = require('path');
module.exports = {
    "metadata":{
		  "author": "Simon P. Daron",
		  "email": "simon@surlaterre.org"
	  },
    "clean": false,
    "plugins": {
        "metalsmith-drafts": true,
        "metalsmith-data": {
            "metadata": paths.contents+"/metadata.json"
        },
        "metalsmith-paths":{
          "property": "paths"
        },
        "metalsmith-default-values":[
          {
            pattern : '**/*.md',
            defaults: {
              title: function (file) {
                return (file.paths.name == 'index')?file.paths.dir.split(path.sep).pop():file.paths.name;
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

        "metalsmith-sharp":[
          {
            "src": "**/*.jpg",
            "namingPattern": "{dir}{base}",
            "methods": [
              {
                "name": "resize",
                "args":{
                    "width": 800,
                    "height": 800,
                    "fit":"inside",
                    "withoutEnlargement":true
                }             
              }
            ],
            "moveFile": false
          }
        ],
        "metalsmith-collections": {
          "$": "**/*",
          "images": "**/*.{png,gif,jpg}",
          "home": {
			      "pattern": "index.md"
		      },
		      "secteurs": {
			      "pattern": "*/index.md",
		        "sortBy": "order"
		      },
		      "pages": {
			      "pattern": "**/index.md",
			      "sortBy": "path",
            "reverse": true
		      }
        },
        "metalsmith-collection-metadata":{
	        "collections.home": {}
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
            "minifierOptions":{
              "minifyJS":true
            }
        }
    }
}
