'use strict';

var _require = require('lodash'),
    maxBy = _require.maxBy,
    isObject = _require.isObject,
    isUndefined = _require.isUndefined;

var _require2 = require('./settings'),
    getOptions = _require2.getOptions,
    getSubsystems = _require2.getSubsystems;

var indent = function indent(num) {
  return Array(num > 0 ? num : 1).join(' ');
};

var parseMessage = function parseMessage(messages, subsystem, render) {
  var ssLength = getSubsystems().length > 0 ? maxBy(getSubsystems(), function (ss) {
    return ss.length;
  }).length + 1 : subsystem.length;
  var out = '';

  var _loop = function _loop(_i) {
    var message = messages[_i];
    if (isObject(message)) {
      out += '\n' + render(message, ssLength + 7);
    } else {
      var nextMsg = messages[_i + 1];
      if (/%.*%/.test(message) && nextMsg['color']) {
        _i++;
        // check for special color directive
        message.match(/(%.*?%)/g).forEach(function (customMessage) {
          var renderObj = {};
          var colorTag = nextMsg && nextMsg['color'];
          if (colorTag && isUndefined(getOptions().customColors[colorTag])) {
            console.warn('\n -- Debugger Warning: Color Directive "' + colorTag + '" was not found in the settings. --\n');
          } else if (colorTag) {
            renderObj[colorTag] = customMessage.replace(/%/g, '');
            message = message.replace(customMessage, render(renderObj));
          }
          nextMsg = messages[_i + 1];
          _i++;
        });
        out += indent(ssLength - subsystem.length) + '   ' + message;
      } else if (_i === 0) {
        out += indent(ssLength - subsystem.length) + '   ' + render(message);
      } else {
        out += '\n' + Array(ssLength + 7).join(' ') + render(message);
      }
    }
    i = _i;
  };

  for (var i = 0; i < messages.length; i++) {
    _loop(i);
  }
  return out;
};

module.exports = parseMessage;
//# sourceMappingURL=parser.js.map