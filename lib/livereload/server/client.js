/**
 * Module dependencies.
 */

var events = require('events');

var Ws = require('faye-websocket');

/**
 * Expose `Client`.
 */

module.exports = Client;

var id = 0;

function Client(req, sock, head) {
  this.id = ++id;
  this.url = null;

  this.ws = new Ws(req, sock, head);
  this.ws.on('open', this.open.bind(this));
  this.ws.on('close', this.close.bind(this));
  this.ws.on('message', this.message.bind(this));
}

Client.prototype = Object.create(events.EventEmitter.prototype);
Client.prototype.constructor = Client;

Client.prototype.open = function open() {
  this.emit('connect', this, this.id);
};

Client.prototype.close = function close() {
  if (this.ws) {
    this.ws.close();
    this.ws = null;
  }

  this.emit('end', this, this.id);
};

Client.prototype.message = function message(e) {
  var data = JSON.parse(e.data);
  if (this[data.command]) this[data.command](data);
};

Client.prototype.send = function send(data) {
  this.ws.send(JSON.stringify(data));
};

Client.prototype.reload = function reload(files) {
  files.forEach(function(file) {
    this.send({
      command: 'reload',
      path: file
    });
  }, this);
};

Client.prototype.hello = function hello() {
  this.send({
    serverName: 'protein-livereload',
    command: 'hello',
    protocols: [
      'http://livereload.com/protocols/official-7'
    ]
  });
};

Client.prototype.info = function info(data) {
  this.url = data.url;
};
