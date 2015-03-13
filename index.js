'use strict';

var cp = require('child_process');
var fs = require('fs');
var path = require('path');
var	util = require('util');

var PATH_NODE = process.argv[0];

/**
 * Check whether a node process is running.
 * @param callback {Function}
 */
function isRunning(callback) {
	var stats, cmd;

    if (fs.existsSync('.running')) {
        stats = JSON.parse(fs.readFileSync('.running', 'utf8'));
        
        cmd = util.format(process.platform === 'win32' ?
    		'tasklist /fi "PID eq %s" | findstr /i "%s"' :
    		'ps -f -p %s | grep "%s"', stats.pid, path.basename(PATH_NODE));
            
		cp.exec(cmd, function (err, stdout, stderr) {
			if (err || stdout.toString().trim() === '') {
				callback(null);
			} else {
				callback(stats);
			}
		});
    } else {
        callback(null);
    }
}

/**
 * Start a background service.
 * @param options {string|Object}
 * @param callback {Function}
 */
function start(options, callback) {
    isRunning(function (stats) {
		if (stats) {
			return callback(new Error('Service is running!'));
		}
        
        if (typeof options === 'string') {
            options = { filename: options };
        }
        
        var args = (options.flags || [])
            .concat(options.filename)
            .concat(options.args || []);

		var child = cp.spawn(PATH_NODE, args, {
			detached: true,
			stdio: [ 'ignore', 'ignore', 'ignore' ]
		});
		
        var handle = setTimeout(function () {
            options.pid = child.pid;
            fs.writeFileSync('.running', JSON.stringify(options));
			child.unref();
			callback(null);
        }, 3000);
        
		child.on('exit', function (code) {
			clearTimeout(handle);
			if (code !== 0) {
                callback(new Error('Server failed to start!'));
			}
		});
	});
}

/**
 * Stop current background service.
 * @param [callback] {Function}
 */
function stop(callback) {
    isRunning(function (stats) {
		if (stats) {
			try {
				process.kill(stats.pid);
				fs.unlinkSync('.running');
				callback(null, stats);
			} catch (err) {
				callback(err);
			}
		} else {
			callback(new Error('No running service!'));
		}
	});
}

/**
 * Restart current background service.
 * @param [callback] {Function}
 */
function restart(callback) {
	stop(function (err, options) {
        if (err) {
            callback(err);
        } else {
    		setTimeout(function () {
    			start(options, callback);
    		}, 1000);
        }
	});
}

exports.start = start;
exports.stop = stop;
exports.restart = restart;