const paths = require('./paths');
module.exports = {
    "metadata":{
		  "author": "Simon P. Daron",
		  "email": "simon@surlaterre.org"
	  },
    "clean": false,
    "plugins": {
        "metalsmith-drafts": true,
        "metalsmith-data": {
            "metadata": paths.source+"/metadata.json"
        },
        "metalsmith-paths":{
          "property": "paths"
        },
        "metalsmith-default-values":[
        {
          pattern : '*.md',
          defaults: {
            title: function (file) {
              return file.paths.dir;
            }
          }
        }],
        "metalsmith-slug": {},
        "metalsmith-i18n":{
            "default":   "fr",
            "locales":   ["fr", "en"],
            "directory": paths.templates+"/locales"
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
			      "pattern": "*/*index.md",
		        "sortBy": "priority"
		      },
		      "public": {
			      "pattern": "@(articles)/*/**/index.md",
			      "sortBy": "pubdate",
            "reverse": true
		      },
		      "pages": {
			      "pattern": "**/index.md",
			      "sortBy": "pubdate",
            "reverse": true
		      }
        },
        "metalsmith-collection-metadata":{
	        "collections.home": {}
        },
        "metalsmith-register-helpers": {
            "directory": "helpers/"
        },
        "metalsmith-discover-partials": {
          "directory": paths.templates+"/partials/"
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
            "directory": paths.templates+"/layouts/"
        },
        "metalsmith-html-minifier": {
            "minifierOptions":{
              "minifyJS":true
            }
        }
    }
}
