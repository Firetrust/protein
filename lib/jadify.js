/**
 * Module dependencies.
 */

var jade = require('jade');
var pkg = require('../../package');

/**
 * Expose `jade`.
 */

module.exports = jadify;

/**
 * Inline jade template.
 *
 * @param {String} file
 * @param {String} data
 * @returns {String}
 */

function jadify(data, absolutePath) {
  return data.replace(/jade\(['"]([^"']+)["']\)/g,
    function(match, relativePath) {
      return '\'' + jade.renderFile(absolutePath.replace(/\/[^\/]*$/, '') + '/' + relativePath, {version: pkg.version}) + '\'';
    });
}
