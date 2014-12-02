/**
 * Module dependencies.
 */

var fs = require('fs');

/**
 * Expose `files`.
 */

module.exports = files;

/**
 * Module files.
 *
 * @param {String} path
 * @param {Function} fn
 * @api public
 */

function files(path, fn) {
  var js = [], css = [], dir = {js: [], css: []};

  if (/\.json$/.test(path)) {
    return fs.readFile(path, {encoding: 'utf8'}, function(err, res) {
      if (err) fn(err);
      res = JSON.parse(res);
      path = path.replace(/\/[^\/]*$/, '');
      fn(null, {js: json(res.js, path), css: json(res.css, path)});
    });
  }

  fs.readdir(path, function(err, list) {
    if (err) return fn(err);

    var i = 0;
    next();

    function next() {
      if (i === list.length) return fn(null, {js: js.concat(dir.js), css: css.concat(dir.css)});
      var file = path + '/' + list[i++];
      fs.stat(file, function(err, stats) {
        if (stats.isDirectory()) {
          return files(file, function(err, res) {
            dir.js = dir.js.concat(res.js);
            dir.css = dir.css.concat(res.css);
            next();
          });
        }

        if (/\.json$/.test(file)) {
          return fs.readFile(file, {encoding: 'utf8'}, function(err, res) {
            if (err) fn(err);
            res = JSON.parse(res);
            js = js.concat(json(res.js, path));
            css = css.concat(json(res.css, path));
            next();
          });
        }

        next();
      });
    }
  });
}

/**
 * Absolute paths.
 *
 * @param {Array} [arr]
 * @param {String} path
 * @returns {Array}
 * @api private
 */

function json(arr, path) {
  if (!arr) return [];
  for (var i = 0, res = []; i < arr.length; i++)
    res.push(path + '/' + arr[i]);
  return res;
}
