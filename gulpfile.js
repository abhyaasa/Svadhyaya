'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
// js/css file injection per http://digitaldrummerj.me/gulp-inject/
var ginject = require('gulp-inject');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
    sass: ['./scss/**/*.scss'],
    javascript: [
        './www/**/*.js',
        '!./www/js/app.js',
        '!./www/**/*spec.js', // no test files
        '!./www/lib/**'
    ],
    css: [
        './www/**/*.css',
        '!./www/css/ionic.app*.css',
        '!./www/lib/**'
    ]
};

gulp.task('default', ['sass', 'index']);

gulp.task('sass', function (done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

// after http://digitaldrummerj.me/gulp-inject/
gulp.task('index', function () {
    return gulp.src('./www/index.html')
        .pipe(ginject(
            gulp.src(paths.javascript, {
                read: false
            }), {
                relative: true
            }))
        .pipe(ginject(
            gulp.src(paths.css, {
                read: false
            }), {
                relative: true
            }))
        .pipe(gulp.dest('./www'));
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch([
        paths.javascript,
        paths.css
    ], ['index']);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

var message =
    '  ' + gutil.colors.red('Git is not installed.') +
    '\n  Git, the version control system, is required to download Ionic.' +
    '\n  Download git here: ' +
    gutil.colors.cyan('http://git-scm.com/downloads') + '.' +
    '\n  Once git is installed, run \'' +
    gutil.colors.cyan('gulp install') + '\' again.';

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(message);
        process.exit(1);
    }
    done();
});
