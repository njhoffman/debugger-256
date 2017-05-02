'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var pjson = require('prettyjson-256');

var _require = require('lodash'),
    has = _require.has,
    get = _require.get,
    keys = _require.keys,
    each = _require.each;

var _require2 = require('./console'),
    log = _require2.log;

var parseMessages = require('./parser');

var _require3 = require('./settings'),
    options = _require3.options,
    subsystems = _require3.subsystems,
    getConf = _require3.getConf,
    initSettings = _require3.initSettings;

var render = pjson.init(options);

// TODO: on load check configuration file for errors

var findLevel = function findLevel(subsystem, conf, depth, level) {
  var curr = subsystem.slice(0, depth);
  var next = subsystem.length > depth ? subsystem.slice(0, depth + 1) : null;
  if (has(conf, curr)) {
    if (typeof get(conf, curr) === 'number') {
      return get(conf, curr);
    } else if (subsystem.length + 1 > depth && has(conf, next)) {
      level = findLevel(subsystem, conf, ++depth, level);
    } else if (typeof get(conf, curr.concat('*')) === 'number') {
      return get(conf, curr.concat('*'));
    }
  }
  return level;
};

var debug = function debug(level, subsystem) {
  for (var _len = arguments.length, messages = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    messages[_key - 2] = arguments[_key];
  }

  /* TODO: make this overwritten by DEBUG=* environment variable
    nested subsystems delineated by :'s (app:routes:admin)
    set as single number for log level, two numbers comma separated to indicate object logging depth */
  if (getConf()) {
    var confLevel = findLevel(subsystem.split(':'), getConf(), 1, 6);
    if (level > confLevel) {
      return;
    }
  }
  var subObj = level === 0 ? { fatal: subsystem } : level === 1 ? { error: subsystem } : level === 2 ? { warn: subsystem } : level === 4 ? { info: subsystem } : level === 5 ? { debug: subsystem } : level === 6 ? { trace: subsystem } : { log: subsystem };

  log('  ' + render(subObj) + parseMessages(messages, subsystem, render));
};

var showColors = exports.showColors = function showColors() {
  each(keys(options.customColors), function (key) {
    log(parseMessages(['%Custom Color: ' + key + '%', { color: key }], '', render));
  });
};

var init = exports.init = function init(customSettings) {
  pjson.init(initSettings(customSettings));
};

var createDebug = exports.createDebug = function createDebug() {
  var subsystem = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  subsystem && subsystem.length > 0 && subsystems.push(subsystem);
  return {
    fatal: debug.bind(undefined, 0, subsystem),
    error: debug.bind(undefined, 1, subsystem),
    warn: debug.bind(undefined, 2, subsystem),
    log: debug.bind(undefined, 3, subsystem),
    info: debug.bind(undefined, 4, subsystem),
    debug: debug.bind(undefined, 5, subsystem),
    trace: debug.bind(undefined, 6, subsystem),
    showColors: showColors,
    init: init
  };
};

module.exports = createDebug;
//# sourceMappingURL=debugger.js.map