var gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat');

// Root folder for everything
var src = "./staticsrc";

/**
 * CSS
 */
gulp.task('sass', function () {
  return gulp.src(src + '/css/*.scss')
    .pipe(concat('main.css'))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./static/css'));
});

/**
 * JS
 */
gulp.task('js', function () {
  return gulp.src(src + '/js/*.js')
    .pipe(concat('main.js'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./static/js'));
});

/**
 * Assets
 */
gulp.task('assets', function () {
  return gulp.src(src + '/assets/**/*')
    .pipe(gulp.dest('./static/assets'));
});

/**
 * Libs
 */
gulp.task('libs', function () {
  return gulp.src(src + '/libs/**/*')
    .pipe(gulp.dest('./static/libs'));
});

/**
 * SurveyJS
 */
gulp.task('surveyjs', function () {
  return gulp.src('./node_modules/surveyjs/packages/survey-jquery/**/*')
    .pipe(gulp.dest('./static/libs/survey-jquery'));
});

/**
 * Main entry point
 */
gulp.task('default', ['sass', 'js', 'assets', 'libs', 'surveyjs']);