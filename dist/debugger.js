'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var pjson = require('prettyjson-256');
var _ = require('lodash');

var parseMessages = require('./parser');

var _require = require('./settings'),
    options = _require.options,
    subsystems = _require.subsystems;

var render = pjson.init(options);

var findLevel = function findLevel(subsystem, conf, depth, level) {
  var curr = subsystem.slice(0, depth);
  var next = subsystem.length > depth ? subsystem.slice(0, depth + 1) : null;
  if (_.has(conf, curr)) {
    if (typeof _.get(conf, curr) === 'number') {
      return _.get(conf, curr);
    } else if (subsystem.length + 1 > depth && _.has(conf, next)) {
      level = findLevel(subsystem, conf, ++depth, level);
    } else if (typeof _.get(conf, curr.concat('*')) === 'number') {
      return _.get(conf, curr.concat('*'));
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
  var conf = require('./config.json');

  var confLevel = findLevel(subsystem.split(':'), conf, 1, 6);
  if (level > confLevel) {
    return;
  }
  var subObj = level === 0 ? { fatal: subsystem } : level === 1 ? { error: subsystem } : level === 2 ? { warn: subsystem } : level === 4 ? { info: subsystem } : level === 5 ? { debug: subsystem } : level === 6 ? { trace: subsystem } : { log: subsystem };

  console.log('  ' + render(subObj) + parseMessages(messages, subsystem, render));
};

var showColors = exports.showColors = function showColors() {
  _.each(_.keys(options.customColors), function (key) {
    console.log(parseMessages(['%Custom Color: ' + key + '%', { color: key }], '', render));
  });
};

var init = exports.init = function init(customOptions) {
  options = _.defaultsDeep(options, customOptions);
};

var createDebug = exports.createDebug = function createDebug() {
  var subsystem = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  subsystems.push(subsystem);
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