//https://www.evocode.com/blog/mastering-metalsmith-best-practices-for-static-sites/
// CONFIG
const config = {
  metalsmith: require('./config/metalsmith'),
  paths: require('./config/paths')
}

// Common
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
const Metalsmith = require('metalsmith');

// Configuration
const args = {
  build: !!argv.build,
  production: !!argv.production
};

const sync = gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: config.paths.destination
    },
  })
});

const clean = gulp.task('clean', function () {
    // Return the promise that del produces.
    return del([config.paths.destination]);
});
const contents = gulp.task('contents', function(callback) {
  let ms = new Metalsmith(process.cwd());
  let plugins = config.metalsmith.plugins || {};

  ms.source(config.paths.source);
  ms.destination(config.paths.destination);
  ms.metadata(config.metalsmith.metadata);

  Object.keys(plugins).forEach(function(key) {
    var plugin = require(key);
    var options = plugins[key];
      ms.use(plugin(options));
  });

  ms.build(function(err) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    callback();
  });
});

const styles = gulp.task('styles', function() {
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

const statics = gulp.task('statics', function() {
    return gulp.src(path.join(__dirname,config.paths.statics,'/*.*'))
        .pipe(gulp.dest(path.join(__dirname, config.paths.destination, 'statics')));
});

const compile = gulp.task('compile', gulp.series('contents',gulp.parallel(['styles', 'statics'])));

const watch = gulp.task('watch', function() {
  gulp.watch(['gulpfile.js', 'config/metalsmith.js', 'config/paths.js'], gulp.series('compile'));
  gulp.watch([config.paths.styles+'/**/*'], gulp.series('styles'));
  gulp.watch([config.paths.statics+'/**/*'], gulp.series('statics'));
  gulp.watch([
    config.paths.contents+'/**/*',
    config.paths.layouts+'/**/*',
    config.paths.partials+'/**/*',
    config.paths.locales+'/**/*'
  ], gulp.series('contents'));
});

const serve = gulp.task('serve', gulp.series('compile', function(callback) {
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
}));

gulp.task('start', gulp.series('compile', gulp.parallel(['watch','serve','browserSync'])));


