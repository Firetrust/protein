/**
 * Module dependencies.
 */

var fs = require('fs');

var livereload = require('./lib/livereload');
var protein = require('./lib/protein');

var watched = [];

watcher(__dirname + '/../app', function() {
  setInterval(function() {
    if (watched.length) {
      console.log('Changed', watched);
      livereload.broadcast(watched);
      watched = [];
    }
  }, 100);

  livereload.listen(35729);
  protein.listen(9000);
});

function watcher(dir, fn) {
  fs.readdir(dir, function(err, list) {
    if (err) return fn(err);

    var i = 0;
    next();

    function next() {
      if (i === list.length) return fn(null);
      var file = dir + '/' + list[i++];
      fs.stat(file, function(err, stats) {
        if (stats.isDirectory()) {
          return watcher(file, function(err) {
            if (err) return fn(err);
            next();
          });
        }

        fs.watchFile(file, {interval: 200}, function() {
          watched.push(file);
        });

        next();
      });
    }
  });
}
