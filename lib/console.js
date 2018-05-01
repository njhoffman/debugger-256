const { inspect } = require('util');

module.exports = {
  inspect,
  log: function () { console.log.apply(console, Array.prototype.slice.call(arguments)); },
  info: function () { console.info.apply(console, Array.prototype.slice.call(arguments)); },
  warn: function () { console.warn.apply(console, Array.prototype.slice.call(arguments)); },
  error: function () { console.error.apply(console, Array.prototype.slice.call(arguments)); },
  internalLog: function () {
    const out = Array.prototype.slice.call(arguments);
    out[0] = '\n -- ' + (out[0] ? out[0] : '') + '\n';
    console.log.apply(console, out);
  }
};
