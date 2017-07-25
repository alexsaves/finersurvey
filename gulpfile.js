const gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    colors = require('colors');

// Root folder for everything
const src = "./staticsrc",
    dist = "./dist";

// Are we in debug mode?
var isDebug = false;

/**
 * CSS
 */
gulp.task('sass', function () {
    return gulp
        .src(src + '/css/survey.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(gulp.dest(dist + '/css'));
});

/**
 * JS
 */
gulp.task('js', function () {
    return gulp
        .src(src + '/js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulpif(!isDebug, sourcemaps.init()))
        .pipe(uglify())
        .pipe(gulpif(!isDebug, sourcemaps.write('./maps')))
        .pipe(gulp.dest(dist + '/js'));
});

/**
 * Assets
 */
gulp.task('assets', function () {
    return gulp
        .src(src + '/assets/**/*')
        .pipe(gulp.dest(dist + '/assets'));
});

/**
 * Libs
 */
gulp.task('libs', function () {
    return gulp
        .src(src + '/libs/**/*')
        .pipe(gulp.dest(dist + '/libs'));
});

/**
 * Main entry point
 */
gulp.task('default', ['sass', 'js', 'assets', 'libs']);

/**
 * Watch task
 */
gulp.task('watch', ['default'], function () {
    isDebug = true;
    console.log("Running in DEBUG MODE!".yellow);
    gulp.watch([
        src + '/js/*.js',
        src + '/css/**/*.scss',
        src + '/assets/**/*'
    ], ['default']);
});