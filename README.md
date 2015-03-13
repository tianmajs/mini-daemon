# mini-daemon

![build status](https://travis-ci.org/tianmajs/tianma-mount.svg?branch=master)

NodeJS background process manager.

## Install

	$ npm install mini-daemon

## Usage

    var daemon = require('mini-daemon');
    
    daemon.start('./app.js', function (err) {
        // ...
    });
    
    daemon.stop(function (err) {
        // ...
    });
    
    daemon.restart(function (err) {
        // ...
    });

## License

[MIT](https://github.com/tianmajs/tianmajs.github.io/blob/master/LICENSE)