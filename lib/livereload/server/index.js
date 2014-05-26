/**
 * Module dependencies.
 */

var http = require('http');
var url = require('url');
var fs = require('fs');

var Client = require('./client');

/**
 * Expose `Server`.
 */

module.exports = Server;

function Server() {
  this.clients = {};
}

Server.prototype.listen = function listen() {
  var s = http.createServer(this.handler.bind(this));
  s.on('upgrade', this.upgrade.bind(this));
  s.listen.apply(s, arguments);
};

Server.prototype.handler = function handler(req, res) {
  var parsed = url.parse(req.url);

  if (parsed.pathname !== '/livereload.js') {
    res.writeHead(404);
    res.end();
    return;
  }

  fs.createReadStream(__dirname + '/livereload.js').pipe(res);
};

Server.prototype.upgrade = function upgrade(req, sock, head) {
  var c = new Client(req, sock, head);
  c.on('connect', this.connect.bind(this));
  c.on('end', this.destroy.bind(this));
};

Server.prototype.connect = function connect(client, id) {
  this.clients[id] = client;
};

Server.prototype.destroy = function destroy(client, id) {
  delete this.clients[id];
};

Server.prototype.broadcast = function broadcast(files) {
  Object.keys(this.clients).map(function(id) {
    this.clients[id].reload(files);
  }, this);
};
