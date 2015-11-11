#! /usr/bin/env node

var daemon = require('../');
var version = require('../package.json').version;

function parse(argv) {
    var options = {
        filename: '',
        flags: [],
        args: []
    };
    var part;
    var tmp = options.flags;

    while (part = argv.shift()) {
        if (part[0] === '-' || options.filename) {
            tmp.push(part);
        } else {
            options.filename = part;
            tmp = options.args;
        }
    }

    return options;
}

function main(argv) {
    var command = argv.shift();
    var options = parse(argv);

    switch (command) {
    case 'start':
        daemon.start(options, function (err) {
            if (err) {
                console.error('ERROR: %s', err.message);
            } else {
                console.log('Service started.');
            }
        });
        break;
    case 'stop':
        daemon.stop(function (err) {
            if (err) {
                console.error('ERROR: %s', err.message);
            } else {
                console.log('Service stopped.');
            }
        });
        break;
    case 'restart':
        daemon.restart(function (err) {
            if (err) {
                console.error('ERROR: %s', err.message);
            } else {
                console.log('Service restarted.');
            }
        });
        break;
    case '-h':
    case '--help':
        console.log([
            '',
            '  Usage: daemon [options] <command> [flags] <file> [args]',
            '',
            '  Commands:',
            '',
            '    start [flags] <file> [args]',
            '    Start a background service',
            '',
            '    stop',
            '    Stop current background service',
            '',
            '    restart',
            '    Restart current background service',
            '',
            '  Options:',
            '    -h, --help     output usage information',
            '    -v, --version  output the version number',
            ''
        ].join('\n'));
        break;
    case '-v':
    case '--version':
        console.log(version);
        break;
    }
}

main(process.argv.slice(2));
