'use strict';

var gulp = require('gulp-help')(require('gulp'));
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
// following requires added to standard ionic starter
var fs = require('fs');
var jshint = require('gulp-jshint');
// js/css file injection per http://digitaldrummerj.me/gulp-inject/
var ginject = require('gulp-inject');
var taskListing = require('gulp-task-listing');
var argv = require('minimist')(process.argv.slice(2));

var paths = {
    sass: ['./scss/**/*.scss'],
    scripts: [ // added for index task
        './www/**/*.js',
        '!./www/js/app.js',
        '!./www/**/*spec.js', // no test files
        '!./www/lib/**'
    ],
    css: [ // added for index task
        './www/**/*.css',
        '!./www/css/ionic.app*.css',
        '!./www/lib/**'
    ]
};

gulp.task('default', ['sass', 'index', 'config']); // added index and config

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

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch([ // added for index task
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

gulp.task('git-check', function (done) { // run by ionic
    if (!sh.which('git')) {
        console.log(message);
        process.exit(1);
    }
    done();
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    // FIXME NOTE added comment:
    // gulp watch doesn't auto-inject new files into index.html
    // with next line
    //   gulp.watch([paths.scripts, paths.css], ['index']); // added line
    // because it produces the following log message
    //   1     495942   log      LiveReload protocol error (invalid command
    //   'reload', only valid commands are: hello)) after receiving data:
    //   "{"command":"reload","path":"www/css/ionic.app.min.css",
    //   "liveCss":true,"liveJs":true,"liveImg":true}"..
});

// The above is from the ionic starter execpt as indicated by 'added' comments.
// -----------------------------------------------------------------------------
// The following is specific to this project.

var configMsg = ('Transfer some config data from config.xml to ' +
                 'www/data/config.json.');

// Adapted from https://github.com/Leonidas-from-XIV/node-xml2js
gulp.task('config', configMsg, function () {
    var fs = require('fs'),
        xml2js = require('xml2js'),
        util = require('util'),
        parser = new xml2js.Parser(),
        xmlstr = fs.readFileSync(__dirname + '/config.xml').toString(),
        jsonFileName = __dirname + '/www/data/config.json',
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

gulp.task('default', ['sass', 'index', 'config']);

// BUILD finish this: see https://github.com/leob/ionic-quickstarter
gulp.task('build', '-a for Android, default iOS', ['pre-build'], function () {
    sh.exec('ionic build ' + (argv.a ? 'android' : 'ios'));
});

gulp.task('pre-build', ['default'], function () {
    // TODO fill out pre-build
});

gulp.task('jshint', 'Run jshint on all (non-lib) script files', function () {
    gulp.src(paths.scripts.concat(['./www/js/app.js', './www/**/*spec.js']))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

var configJsonFile = 'www/data/config.json';
var flavorMsg = ('--name FLAVOR argument required: inject FLAVOR into ' +
                 configJsonFile);

gulp.task('flavor', flavorMsg, function () {
    if (!argv.name) {
        console.log(gutil.colors.magenta('Usage: gulp flavor --name NAME'));
    } else {
        var configJson = JSON.parse(fs.readFileSync(configJsonFile).toString());
        configJson.flavor = argv.name;
        fs.writeFileSync(configJsonFile, JSON.stringify(configJson, null, 2));
        sh.exec('ln -s -f data/' + argv.name + '/resources .');
    }
});

gulp.task('utest', 'Unit tests', function () {
    sh.exec('karma start');
});

var ionicBrowser = 'chrome'; // '/Applications/Google Chrome Canary.app';

gulp.task('itest', 'Integration (e-e) tests', function () {
    // TODO itest not working
    var cwd = process.cwd(),
        mkCmd = function (cmd) {
                    return 'tools/term.sh "cd ' + cwd + ';' + cmd + '"';
                };
    sh.exec(mkCmd('ionic serve -c -t ios --browser ' + ionicBrowser));
    sh.exec('sleep 10');
    sh.exec(mkCmd('webdriver-manager start'));
    sh.exec('sleep 3');
    sh.exec(mkCmd('protractor protractor.conf.js'));
});

gulp.task('is', '[-a|-i] for ionic serve for android, ios, or (default) both',
  function () {
    var platform = argv.a ? '-t android' : argv.i ? '-t ios' : '-l';
    var command = 'ionic serve -c ' + platform + ' --browser "' + ionicBrowser + '"';
    console.log(command); // xx
    sh.exec(command);
});

gulp.task('kill', 'Kill all gulp and Terminal processes', function () {
    sh.exec('killall gulp');
    sh.exec('osascript -e \'quit app "Terminal"\'');
    // Instead use the following if itest processs not in Terminal:
    // sh.exec('kill -9 $(pgrep bash)'); // 'killall bash' does not work
});

// after http://digitaldrummerj.me/gulp-inject/
gulp.task('index', 'Inject script and css elements into www/index.html',
  function () {
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

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

var gitMessage =
    '  ' + gutil.colors.red('Git is not installed.') +
    '\n  Git, the version control system, is required to download Ionic.' +
    '\n  Download git here: ' +
    gutil.colors.cyan('http://git-scm.com/downloads') + '.' +
    '\n  Once git is installed, run \'' +
    gutil.colors.cyan('gulp install') + '\' again.';

gulp.task('git-check', function (done) { // run by ionic
    if (!sh.which('git')) {
        console.log(gitMessage);
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
