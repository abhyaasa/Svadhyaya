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
var jshint = require('gulp-jshint');
var taskListing = require('gulp-task-listing');
var argv = require('minimist')(process.argv.slice(2));

var ionicBrowser = '/Applications/Google Chrome Canary.app';

var paths = {
    sass: ['./scss/**/*.scss'],
    scripts: [ // for index task
        '*.js',
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

var helpPreamble =
    ('\n"gulp build -a" for android, default ios' +
     '\n"gulp is [-a|-i]" for ionic serve for android, ios, or (default) both');

gulp.task('help', function () {
    console.log(helpPreamble);
    taskListing();
});

gulp.task('default', ['sass', 'index']);

// BUILD finish this: see https://github.com/leob/ionic-quickstarter
gulp.task('build', ['pre-build'], function () {
    sh.exec('ionic build ' + (argv.a ? 'android' : 'ios')); // TODO add pre-build
});

gulp.task('pre-build', ['default']);

gulp.task('jshint', function () {
    gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('is', function() {
    var platform = argv.a ? '-t android' : argv.i ? '-t ios' : '-l';
    var command = 'ionic serve -c ' + platform + ' --browser "' + ionicBrowser + '"';
    console.log(command); // xx
    sh.exec(command);
});

gulp.task('utest', function () {
    sh.exec('karma start');
});

gulp.task('itest', function () {
    sh.exec('ionic start', {async: true});
    sh.exec('webdriver-manager start', {async: true});
    // sh.exec('protractor protractor.conf.js'); // TODO ibook p227 itest
    // TODO fails, see notes/gulp-itest.txt
});

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
            gulp.src(paths.scripts, {
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
        paths.scripts,
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
