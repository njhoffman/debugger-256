module.exports = {
  log: function () { console.log.apply(console, Array.prototype.slice.call(arguments)); },
  info: function () { console.info.apply(console, Array.prototype.slice.call(arguments)); },
  warn: function () { console.warn.apply(console, Array.prototype.slice.call(arguments)); },
  error: function () { console.error.apply(console, Array.prototype.slice.call(arguments)); },
  internalLog: function() {
    console.log.apply(console, '\n -- ', Array.prototype.slice.call(arguments), '\n');
  }
};
