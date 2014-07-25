var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    header  = require('gulp-header'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    package = require('./package.json');



//// SETTINGS
var ASSET_PATH = "app/assets"
var express_port      = 1987;
var express_root      = __dirname + '/app/';
var livereload_port   = 35729;
var destinations = {
  html:       "",
  js:         "",
  css:        ""
}
var source_files = {
  coffee:     "coffee/**/*.coffee",
  sass:       "css/**/*.sass"
  overwatch:  "app/**/*.{js,html,css}"
}
//// SETTINGS



var header = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

gulp.task('serve', function(event) {
  var app = express();
  app.use(livereload());
  app.use(express["static"](express_root));
  app.listen(express_port);

  var lr = tinylr();
  lr.listen(livereload_port);
});

gulp.task("sass", function() {
  gulp.src(source_files.sass)
    .pipe(sass({ style: "compressed" }))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest(destinations.css))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest(destinations.css))
});

gulp.task('coffee', function() {
  gulp.src(source_files.coffee)
    .pipe(coffee())
    .pipe(gulp.dest(destinations.js)
    .pipe(uglify())
    .pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(destinations.js)
});

gulp.task("watch", function() {
  gulp.watch(source_files.sass, ["sass"]);
  gulp.watch(source_files.coffee, ["coffee"]);
  gulp.watch(source_files.overwatch, refresh);
});

gulp.task('default', ['clean', 'serve', 'fonts', 'sprite', 'css', 'js', 'static', 'watch']);

refresh = function(event) {
  var fileName = require('path').relative(express_root, event.path);

  gutil.log.apply(gutil, [gutil.colors.magenta(fileName), gutil.colors.cyan('changed')]);

  return lr.changed({
    body: {
      files: [fileName]
    }
  });
};

