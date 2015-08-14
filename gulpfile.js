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
    javascript: [ // for index task
        './www/**/*.js',
        '!./www/js/app.js',
        '!./www/**/*spec.js', // no test files
        '!./www/lib/**'
    ],
    css: [ // for index task
        './www/**/*.css',
        '!./www/css/ionic.app*.css',
        '!./www/lib/**'
    ]
};

gulp.task('default', ['sass', 'index']); // run by ionic

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
    gulp.watch([ // for index task
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

gulp.task('git-checkxx', function (done) { // run by ionic
    if (!sh.which('git')) {
        console.log(message);
        process.exit(1);
    }
    done();
});

// Transfer some config data from config.xml to www/data/config.json.
// Adapted from https://github.com/Leonidas-from-XIV/node-xml2js.
gulp.task('config', function () {
    var fs = require('fs'),
        xml2js = require('xml2js'),
        util = require('util'),
        parser = new xml2js.Parser(),
        xmlstr = fs.readFileSync(__dirname + '/config.xml').toString(),
        jsonFileName =__dirname + '/www/data/config.json',
        jsonstr = fs.readFileSync(jsonFileName).toString();
    parser.parseString(xmlstr, function (err, xconfig) {
        var widget = xconfig.widget,
            config = JSON.parse(jsonstr);
        config.version = widget.$.version;
        config.name = widget.name[0];
        config.email = widget.author[0].$.email;
        config.href = widget.author[0].$.href;
        fs.writeFileSync(jsonFileName, JSON.stringify(config, null, 2));
    });
});
