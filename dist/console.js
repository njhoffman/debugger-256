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
    console.log.apply(console, '\n -- ', Array.prototype.slice.call(arguments), '\n');
  }
};
//# sourceMappingURL=console.js.map