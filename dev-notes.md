Notes for Developers
--------------------

## Collaboration

To open discussion of collaboration possibilities, please email <svadhyaya.app@gmail.com>.

## Development tasks

This app is early in development, with plenty to do. See

- `todo.md` file
- tags listed in `.todo` througout source files
- GitHub [Issues](https://github.com/vasudeva-chaynes/Svadhyaya/issues) list

## Global installs

```
$ npm list -g --depth=0
/Users/home/.nvm/versions/node/v0.12.7/lib
├── coffee-script@1.9.3
├── coffeelint@1.10.1
├── cordova@5.1.1
├── ionic@1.6.4
├── ios-deploy@1.7.0
├── ios-sim@4.1.1
├── karma-cli@0.1.0
├── node-inspector@0.12.2
├── npm@2.13.1
├── protractor@2.1.0
└── xml2js@0.4.10$ npm list -g --depth=0
```

## Config

`gulp config` transfers name, email, href, and version attributes from `config.xml` to `www/data/config.json`.

The `config.json` file also contains the flavor attribute, which is set by `gulp flavor`.

Early in app initialization, the config object denoted by this file is stored in `$rootScope`.

## Flavors

You test and build with the current **flavor** of your choice. Change the flavor    with `gulp flavor --name NAME`. The distribution comes with support for the `test` flavor, but that may not be the current flavor of distribution branches.

There must be a subdirectory of `www/data/flavors` for every flavor in use, with structure similar to the test flavor.

`./resources` link points to `./data/flavors/<current flavor>/resources/` of the current flavor for to keep the `ionic resources` command happy.

## Tools

Run `gulp help` for annotated list of gulp project management tasks.

`gulp index` generates `./www/index.html` from `./index.html`, so edit only the latter. This avoids superfluous version control changes, as script injection order is unpredictable.

Python and bash scripts are in the `tools` directory.

### Bash scripts

- Run `psclean.sh` to remove stray processes that may be created by ionic development. If the message "An uncaught exception occurred and has been reported to Ionic" is seen, try running this script and confirm with the `ps` output that there are no stray processes. Kill them manually if need be.
- Run `resources.sh` after icon or splash screen images in resources directory are changed.
- `term.sh` is used by `gulp itest`.

### Python scripts

Python 2.6+ (maybe earlier) is needed to run `.py` scripts. Use `-h` argument for usage information. `cdeck.py --format_help` provides documentation on deck and compact deck file formats.

### jsdoc generated documentation

`gulp dengi` generates jsdoc documentation in the `doc/build/` directory.
