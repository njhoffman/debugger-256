'use strict';

module.exports = {
  log: function log() {
    console.log.apply(console, Array.prototype.slice.call(arguments));
  },
  info: function info() {
    console.info.apply(console, Array.prototype.slice.call(arguments));
  },
  warn: function warn() {
    console.warn.apply(console, Array.prototype.slice.call(arguments));
  },
  error: function error() {
    console.error.apply(console, Array.prototype.slice.call(arguments));
  },
  internalLog: function internalLog() {
    var out = Array.prototype.slice.call(arguments);
    out[0] = '\n -- ' + (out[0] ? out[0] : '') + '\n';
    console.log.apply(console, out);
  }
};
//# sourceMappingURL=console.js.map