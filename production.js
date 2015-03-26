/**
 * Module dependencies.
 */

var fs = require('fs');
var jade = require('jade');

var files = require('./lib/files');
var jadify = require('./lib/jadify');

files(__dirname + '/../app', function(err, files) {
  var rstreamJs = '';
  var rstreamCss = '';

  // stream javascript
  for (var i = 0; i < files.js.length; i++) {
    rstreamJs += jadify(
      fs.readFileSync(files.js[i], {encoding: 'utf8'}),
      files.js[i]
    );
  }

  // stream css
  for (var i = 0; i < files.css.length; i++) {
    rstreamCss += fs.readFileSync(files.css[i]);
  }

  // javascript file
  fs.writeFileSync('build/main.js', rstreamJs);
  fs.writeFileSync('build/main.min.js', require("uglify-js").minify('build/main.js').code);

  // css file
  fs.writeFileSync('build/main.css', rstreamCss);
  fs.writeFileSync('build/main.min.css', require('uglifycss').processFiles(['build/main.css']));

  // index.html
  fs.createWriteStream('build/index.html').write(jade.renderFile('app/index.jade'));
});

files(__dirname + '/../config', function(err, files) {
  // production javascript file
  var wstreamJs = fs.createWriteStream('build/libs.min.js');

  // stream javascript
  for (var i = 0; i < files.js.length; i++) {
    wstreamJs.write(fs.readFileSync(files.js[i]));
  }

  wstreamJs.end();
});
