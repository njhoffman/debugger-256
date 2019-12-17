const { inspect } = require('util');

/* eslint-disable prefer-spread, no-console, prefer-rest-params */

module.exports = {
  inspect,
  log() {
    console.log.apply(console, Array.prototype.slice.call(arguments));
  },
  info() {
    console.info.apply(console, Array.prototype.slice.call(arguments));
  },
  warn() {
    console.warn.apply(console, Array.prototype.slice.call(arguments));
  },
  error() {
    console.error.apply(console, Array.prototype.slice.call(arguments));
  },
  internalLog() {
    const out = Array.prototype.slice.call(arguments);
    out[0] = `\n -- ${out[0] ? out[0] : ''}\n`;
    if (process.env.NODE_ENV !== 'test') {
      console.log.apply(console, out);
    }
  },
};

/* eslint-enable prefer-spread, no-console, prefer-rest-params */
