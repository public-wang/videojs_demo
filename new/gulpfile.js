var gulp = require("gulp"),
  rename = require('concur-gulp-rename'),
  webpack = require('webpack-stream'),
  fs = require('fs'),
  path = require('path'),
  gzip = require('gulp-gzip'),
  browserify = require('gulp-browserify'),
  sass = require('gulp-sass'),
  less = require('gulp-less');

process.env.NODE_ENV = process.env.NODE_ENV || "development";

function getFolders(dir) {
  return fs.readdirSync(dir)
  .filter(function (file) {
    return fs.statSync(path.join(dir, file)).isDirectory();
  });
}

var watchMode = false;
gulp.task('webpack', function () {
  return gulp.src("webpack.config.js")
  .pipe(webpack(require('./webpack.config.js'), require('webpack')))
  .pipe(gulp.dest('public'))
  ;
});
gulp.task('copy', function () {
  return gulp.src("./app/assets/images/**/*")
  .pipe(gulp.dest('public/images'))
  ;
});

gulp.task('admin', function () {
  gulp.src("./node_modules/bootstrap-sass/assets/fonts/**").pipe(gulp.dest('public/assets/bootstrap/fonts/bootstrap'));
  gulp.src("./node_modules/bootstrap-sass/assets/javascripts/**").pipe(gulp.dest('public/assets/bootstrap/js'));
  gulp.src("./resources/assets/plugins/**").pipe(gulp.dest('public/assets/plugins'));
  gulp.src("./resources/assets/img/admin/**").pipe(gulp.dest('public/assets/admin/images'));

  gulp.src('./resources/assets/js/app.js').pipe(browserify({insertGlobals: true})).pipe(gulp.dest('public/assets/admin/js'));

  gulp.src('./resources/assets/sass/bootstrap.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('public/assets/bootstrap/css'));
  //gulp.src('./resources/assets/sass/bootstrap.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('public/assets/bootstrap/css'));
  gulp.src('./resources/assets/less/AdminLTE.less').pipe(less({paths: [ path.join(__dirname, 'less', 'includes') ]})).pipe(gulp.dest('public/assets/admin/css'));
  gulp.src('./resources/assets/less/skins/_all-skins.less').pipe(less({paths: [ path.join(__dirname, 'less', 'includes') ]})).pipe(gulp.dest('public/assets/admin/css'));

  //
  //mix.sass('bootstrap.scss', 'public/assets/bootstrap/css');
  //mix.less('AdminLTE.less', 'public/assets/admin/css/global.css');
  //mix.less('skins/_all-skins.less', 'public/assets/admin/css/all-skins.css');
  //mix.browserify('global.js', 'public/assets/admin/js/global.js');
  //mix.sass('app.scss', 'public/assets/admin/css');
});


gulp.task('build', ['copy', 'webpack', 'admin']);
gulp.task('clean', function (cb) {
  require('del')(['./public'], cb);
});
gulp.task('cleangz', function (cb) {
  require('del')(['./public/**/*.gz'], cb);
});
gulp.task('default', ['build']);
gulp.task('buildgz', ['build'], function () {
  return gulp.src('public/**/!(*.gz|*.png|*.jpg|*.jpeg|*.svg)') // png and jpg already very well compressed, might even make it larger
  .pipe(require('gulp-size')({
    showFiles: true
  }))
  .pipe(gzip({
    gzipOptions: {
      level: 9
    }
  }))
  .pipe(rename({
    extname: ".gz"
  }))
  .pipe(require('gulp-size')({
    showFiles: true
  }))
  .pipe(gulp.dest('public'))
  ;
});

gulp.task('httpServer', function () {
  process.env.RUNNING = "local";
  var App = require('./index.js');
  var HTTPServer = new App();
  HTTPServer.start(function () {
    console.log('info', 'server listening');
  });
});
gulp.task('server', ['httpServer', 'build'], function () {
  return gulp.watch(['app/assets/**', 'app/view/**', 'resources/assets/**'], ["cleangz", "build"]);
});
