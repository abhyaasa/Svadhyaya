## Global installs

    $ npm list -g --depth=0
    /Users/home/.nvm/versions/node/v0.12.7/lib
    ├── coffeelint@1.10.1
    ├── cordova@5.1.1
    ├── ionic@1.6.4
    ├── ios-deploy@1.7.0
    ├── ios-sim@4.1.1
    ├── karma-cli@0.1.0
    ├── node-inspector@0.12.2
    ├── npm@2.13.1
    ├── protractor@2.1.0
    └── xml2js@0.4.10

## Flavors

You test and build with the current **flavor** of your choice. The flavor is changed with `gulp flavor --name NAME`. The distribution comes with support for the `test` flavor, but that may not be the current flavor of distribution branches.

There must be a subdirectory of `www/data/` for every flavor in use, with structure similar to the test flavor.

`./resources` link points to `./data/<current flavor>/resources/` of the current flavor for to keep the `ionic resources` command happy.
