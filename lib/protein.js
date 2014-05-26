/**
 * Module dependencies.
 */

var fs = require('fs');

var render = require('co-render');

var koa = require('koa');
var send = require('koa-send');
var livereload = require('koa-livereload');

var files = require('./files');
var jadify = require('./jadify');

var app = module.exports = koa();

function modules(path) {
  return function(fn) {
    files(path, fn);
  };
}

function read(file) {
  return function(fn) {
    fs.readFile(file, {encoding: 'utf8'}, fn);
  };
}

/**
 * Middleware.
 */

app.use(livereload());

app.use(function *main() {
  if (this.path === '/') {
    this.body = yield render(__dirname + '/../../app/index.jade', {
      libs: yield modules(__dirname + '/../../config/libs.json'),
      files: yield modules(__dirname + '/../../app')
    });
    return;
  }

  if (/\.js$/.test(this.path)) {
    this.type = 'application/javascript';
    this.body = jadify(yield read(this.path), this.path);
    return;
  }

  // static files
  yield send(this, this.path);
});
