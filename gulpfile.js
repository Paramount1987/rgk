// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var spritesmith = require('gulp.spritesmith');
var browserify = require('gulp-browserify');

//sprites
gulp.task('sprite', function () {
  var spriteData = gulp.src('./src/img/sprites/*.png').pipe(spritesmith({
    retinaSrcFilter: './src/img/sprites/*-2x.png',
    algorithm: 'binary-tree',
    imgName: '../img/sprites/sprite.png',
    retinaImgName: '../img/sprites/sprite-2x.png',
    cssName: '_spritesmith.scss',
    cssFormat: 'scss',
    padding: 5
  }));
  spriteData
    .pipe(gulp.dest('build/img/sprites'));
  spriteData.css.pipe(gulp.dest('./src/scss/include'));
});
//browserify
gulp.task('scripts', function() {
  // Single entry point to browserify
  gulp.src(['src/js/index.js'])
    .pipe(browserify({
      debug: false,
      transform: ['jadeify'],
      extensions: ['.jade']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'))
});


gulp.task('script-jquery', function() {
  // Single entry point to browserify
  gulp.src(['src/js/jquery/jquery-1.12.js'])
    .pipe(gulp.dest('./build/js'))
});


// Static server and Watch Files For Changes
gulp.task('watch', function() {
  browserSync.init({
    server: {
      baseDir: "./build/"
    }
  });
  gulp.watch('src/**/*.js', ['scripts','scripts-lib']);
  gulp.watch(['src/**/*.scss','src/**/*.sass'], ['sass']);
  gulp.watch(['src/**/*.html'], ['html']);
});

// Compile html
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build/'));
});

// Compile img
gulp.task('img', function() {
  return gulp.src('src/img/images/**')
    .pipe(gulp.dest('build/img/images/'));
});

// Compile fonts
gulp.task('fonts', function() {
  return gulp.src('src/fonts/**')
    .pipe(gulp.dest('build/css/fonts'));
});

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src('src/scss/style.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('./build/css'));
});

// Concatenate & Minify JS
gulp.task('scripts-lib', function() {
  return gulp.src('src/js/lib/*.js')
    .pipe(concat('lib.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});


// Default Task
gulp.task('build', ['sass', 'script-jquery','scripts', 'scripts-lib',  'html', 'fonts', 'img', 'sprite']);