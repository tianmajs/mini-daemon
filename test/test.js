var daemon = require('mini-daemon');


daemon.restart(function (err) {
    console.log('a', err);
});


/*
daemon.start('app.js', function (err) {
    console.log('a', err);
});
*/

/*
daemon.stop(function (err) {
    console.log(err);
});
*/