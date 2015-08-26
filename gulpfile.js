'use strict';

var gulp = require('gulp-help')(require('gulp'));
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

var ionicBrowser = 'chrome'; // '/Applications/Google Chrome Canary.app';

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

<<<<<<< HEAD
gulp.task('default', ['sass', 'index', 'config']); // was just ['sass']

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

gulp.task('git-check', function (done) { // run by ionic
    if (!sh.which('git')) {
        console.log(message);
        process.exit(1);
    }
    done();
});

// The above is mostly from the standard ionic gulpfile.
// -----------------------------------------------------
// The following is specific to this project.

var configMsg = ('Transfer some config data from config.xml to ' +
                 'www/data/config.json.');

// Adapted from https://github.com/Leonidas-from-XIV/node-xml2js.
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
=======
var helpPreamble =
    ('\n"gulp build -a" for android, default ios' +
     '\n"gulp is [-a|-i]" for ionic serve for android, ios, or (default) both');

gulp.task('help', function () {
    console.log(helpPreamble);
    taskListing();
});

gulp.task('default', ['sass', 'index', 'config']);
>>>>>>> origin/awesome-syntax

// BUILD finish this: see https://github.com/leob/ionic-quickstarter
gulp.task('build', '-a for Android, default iOS', ['pre-build'], function () {
    sh.exec('ionic build ' + (argv.a ? 'android' : 'ios'));
});

gulp.task('pre-build', ['default'], function () {
    // TODO fill out pre-build
});

gulp.task('jshint', 'Run jshint on all (non-lib) script files', function () {
    gulp.src(paths.scripts + ['./www/js/app.js', './www/**/*spec.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

<<<<<<< HEAD
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

var ionicBrowser = 'chrome'; // '/Applications/Google Chrome Canary.app';

gulp.task('is', '[-a|-i] for ionic serve for android, ios, or (default) both',
  function () {
=======
gulp.task('is', function() {
>>>>>>> origin/awesome-syntax
    var platform = argv.a ? '-t android' : argv.i ? '-t ios' : '-l';
    var command = 'ionic serve -c ' + platform + ' --browser "' + ionicBrowser + '"';
    console.log(command); // xx
    sh.exec(command);
});

gulp.task('utest', 'Unit tests', function () {
    sh.exec('karma start');
});

<<<<<<< HEAD
gulp.task('itest', 'Integration (e-e) tests', function () {
    // TODO itest not working
=======
gulp.task('kill', function () {
    sh.exec('killall gulp');
    sh.exec('osascript -e \'quit app "Terminal"\'');
    // instead use the following if itest processs not rn in Terminal
    // sh.exec('kill -9 $(pgrep bash)'); // 'killall bash' does not work
});

gulp.task('itest', function () {
>>>>>>> origin/awesome-syntax
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

<<<<<<< HEAD
gulp.task('kill', 'Kill all gulp and Terminal processes', function () {
    sh.exec('killall gulp');
    sh.exec('osascript -e \'quit app "Terminal"\'');
    // Instead use the following if itest processs not in Terminal:
    // sh.exec('kill -9 $(pgrep bash)'); // 'killall bash' does not work
=======
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
>>>>>>> origin/awesome-syntax
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
