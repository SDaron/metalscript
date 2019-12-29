//https://www.evocode.com/blog/mastering-metalsmith-best-practices-for-static-sites/
// Common
const path = require('path');
const merge = require('deepmerge');
const argv = require('minimist')(process.argv.slice(2));
const gulp = require('gulp');
const gulprename = require("gulp-rename");
const gulpclean = require('gulp-clean');
const changed = require('gulp-changed');
const sass = require('gulp-sass');
const cache = require('gulp-cached');
const responsive = require('gulp-responsive');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const Metalsmith = require('metalsmith');
const moment = require('moment');

// Configuration
// Configuration
var config = {
  metalsmith: require('./config/metalsmith.js'),
  images: require('./config/images'),
  nextcloud: {},
  paths: require('./config/paths')
}

const args = {
  build: !!argv.build,
  production: !!argv.production
};

// GULP
const sync = gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: config.paths.destination
    },
  })
});
const reload = (callback) => {
  browserSync.reload();
  callback(); 
}

//******************
//Get NEXTCLOUD DATA
//******************
const nextcloud = gulp.task('nextcloud', function(callback){
  // doc https://github.com/mahnunchik/gulp-responsive
  try {
    const fs = require('fs')
    const nextcloud = require('js-nextcloud-io')

    let local_config = require('../config/nextcloud.js');
    console.log('local config found:','../config/nextcloud.js');
    config.nextcloud = merge(config.nextcloud,local_config);        
    
    let resultPath = config.paths.nextcloud+'/nextcloud.json';
    try {
      if (!fs.existsSync(config.paths.nextcloud)){
          fs.mkdirSync(config.paths.nextcloud);
      }
      if (!fs.existsSync(resultPath)) {
        console.log("Nextcloud result file does not exist!");
        fs.writeFileSync(resultPath, '{}', { flag: 'wx' }, function (err) {
            if (err) throw err;
        }); 
        console.log("Nextcloud file has been created.");
      }
    } catch(err) {
      console.error(err)
    }
    
    if (config.nextcloud.server, config.nextcloud.username, config.nextcloud.password) {
    
      nextcloud.getData(config.nextcloud).then((data) => {
          if (data){
            results = JSON.stringify(data, null, 1);
            console.log('Writing nextcloud data to file...');
            fs.writeFileSync(config.paths.nextcloud+'/nextcloud.json', results);
          }else{
            console.log('Getting data but it is empty!',data);
          }
          callback();
        }, (raison) => {
          console.log('Unable to get nextcloud data.');
          console.log(raison);
          callback();
          // Rejet de la promesse
      });
      
    }else{
          console.log('The nextcloud task is not yet configured properly.');
          callback();
    }
    
  } catch (err) {
      console.log('Unable to get nextcloud data.');
      console.log(err);
      callback();
  }
});

//******************
//CLEANING
//******************
const cleanDist = gulp.task('clean:dist', function () {
    // Return the promise that del produces.
    return gulp.src(path.join(__dirname, config.paths.destination),{allowEmpty:true})
        .pipe(gulpclean({force: true,allowEmpty:true}))
});
const cleanTemp = gulp.task('clean:temp', function () {
    // Return the promise that del produces.
    return gulp.src(path.join(__dirname, config.paths.temp),{allowEmpty:true})
        .pipe(gulpclean({force: true,allowEmpty:true}))
});
const clean = gulp.task('clean', gulp.series('clean:temp','clean:dist'));

//******************
//PREPARE
//******************
const rename = gulp.task('prepare:rename', function () {
    // rename via function
    let slugify = function(str){
      return str.replace(/[,\/#!$%\^&\*;:{}=\`~()]/g,"").replace(/\s{2,}/g," ").replace(/\s+/g, '_').toLowerCase()
    };
    return gulp.src( path.join(__dirname, config.paths.contents, '**/*.*'))
      .pipe(changed(path.join(__dirname, config.paths.temp)))
      .pipe(gulprename(function (filepath) {
        var basename = filepath.dirname.split(path.sep).map(dir => slugify(dir)).join(path.sep);
        filepath.dirname = filepath.dirname.split(path.sep).map(dir => slugify(dir)).join(path.sep)
        filepath.basename = slugify(filepath.basename);
        filepath.prefix = '';
        filepath.suffix = '';
        filepath.extname = filepath.extname.toLowerCase();
      }))
      .pipe(gulp.dest(path.join(__dirname, config.paths.temp))); // ./dist/main/text/ciao/hello-goodbye.md
});
const prepare = gulp.task('prepare', gulp.series('clean:temp','prepare:rename'));

//******************
//BUILD
//******************



const contents = gulp.task('build:contents', function(callback) {
  try {
    let local_config = require('../config/metalsmith.js');
    console.log('local config found:','../config/metalsmith.js');
    config.metalsmith = merge(config.metalsmith,local_config)
  } catch (ex) {
      //handleErr(ex);
  }

  let ms = new Metalsmith(__dirname);
  let plugins = config.metalsmith.plugins || {};

  ms.source(config.paths.temp);
  ms.destination(config.paths.destination);
  ms.metadata(config.metalsmith.metadata);
  ms.clean(config.metalsmith.clean);

  Object.keys(plugins).forEach(function(key) {
    var plugin = require(key);
    var options = plugins[key];
      ms.use(plugin(options));
  });
  var ignore = require('metalsmith-ignore');
  ms.use(ignore(['**/*.+(jpeg|jpg|gif|png|tiff|webp)']));

  ms.build(function(err) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    callback();
  });
});

const images = gulp.task('build:images', function(){
  // doc https://github.com/mahnunchik/gulp-responsive
  try {
    let local_config = require('../config/images.js');
    console.log('local config found:','../config/images.js');
    config.images = merge(config.images,local_config)
  } catch (ex) {
      //handleErr(ex);
  }
  return gulp.src( path.join(__dirname, config.paths.temp, '/**/*.+(jpeg|jpg|gif|png|tiff|webp)'))
    .pipe(cache('build:images'))
    .pipe(changed(path.join(__dirname, config.paths.destination)))
    .pipe(responsive(config.images.config,config.images.options))
    .pipe(gulp.dest(path.join(__dirname, config.paths.destination)));
});

const styles = gulp.task('build:styles', function() {
  return gulp.src(path.join(__dirname, config.paths.styles, '**/*.scss'))
    .pipe(sass({
      sourceComments: args.production ? false : true,
      outputStyle: args.production ? 'compressed' : 'expanded',
      errLogToConsole: true,
      onError: console.log
    }))
    .pipe(autoprefixer({}))
    .pipe(gulp.dest(path.join(__dirname, config.paths.destination, 'assets')))
    .pipe(browserSync.reload({
      stream: true
    }))
});

const statics = gulp.task('build:statics', function() {
  return gulp.src(path.join(__dirname,config.paths.statics,'/**/*.*'))
    .pipe(gulp.dest(path.join(__dirname, config.paths.destination, 'statics')))
    .pipe(browserSync.reload({
      stream: true
    }));
});
const compile = gulp.task('build', gulp.series('nextcloud', 'prepare','build:contents',gulp.parallel(['build:styles', 'build:statics']),'build:images'));


//******************
//WATCH & SERVE
//******************
const watch = gulp.task('watch', function() {
  gulp.watch([
    'gulpfile.js', 
    './config/paths.js', 
  ], gulp.series('build',reload));
  //Styles
  gulp.watch([config.paths.styles+'/**/*'], gulp.series('build:styles'));
  //Statics
  gulp.watch([config.paths.statics+'/**/*'], gulp.series('build:statics'));
  //Images
  gulp.watch([
    './config/images.js', 
    '../config/images.js',
    config.paths.contents+'/**/*.+(jpeg|jpg|gif|png|tiff|webp)'
  ], gulp.series('prepare','build:contents','build:images',reload));
  //Autres contenus
  gulp.watch([config.paths.contents+'/**/*.!(jpeg|jpg|gif|png|tiff|webp)'], gulp.series('prepare','build:contents',reload));
  //Templates
  gulp.watch([
    './config/**/*', 
    '../config/**/*',
    config.paths.layouts+'/**/*',
    config.paths.partials+'/**/*',
    config.paths.locales+'/**/*'
  ], gulp.series('build:contents',reload));  
});

const serve = gulp.task('serve', function(callback) {
  var http = require('http');
  var serveStatic = require('serve-static');
  var finalhandler = require('finalhandler');

  var serve = serveStatic(config.paths.destination, {
    "index": ['index.html', 'index.htm']
  });

  var server = http.createServer(function(req, res){
    var done = finalhandler(req, res);
    serve(req, res, done);
  })

  var serverPort = 8080;
  if (argv.port) {
    serverPort = parseInt(argv.port);
  }

  server.listen(serverPort, function() {
    console.log("Server: http://localhost:%s", serverPort);
    callback();
  });
});

gulp.task('start', gulp.series('build', gulp.parallel(['watch','serve','browserSync'])));


