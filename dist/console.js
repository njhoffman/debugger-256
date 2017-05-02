"use strict";

module.exports = {
  log: function log() {
    console.log.apply(console, Array.prototype.slice.call(arguments));
  },
  error: function error() {
    console.error.apply(console, Array.prototype.slice.call(arguments));
  }
};
//# sourceMappingURL=console.js.map