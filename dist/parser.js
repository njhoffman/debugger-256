'use strict';

var _ = require('lodash');

var _require = require('./settings'),
    options = _require.options,
    subsystems = _require.subsystems;

module.exports = function (messages, subsystem, render) {
  var subsystemsLength = _.maxBy(subsystems, function (ss) {
    return ss.length;
  }).length + 1;
  var out = '';

  var _loop = function _loop() {
    var message = messages[i];
    if (_.isObject(message)) {
      out += '\n' + render(message, subsystemsLength + 7);
    } else {
      var nextMsg = messages[i + 1];
      if (/%.*%/.test(message) && nextMsg['color']) {
        i++;
        // check for special color directive
        message.match(/(%.*?%)/g).forEach(function (customMessage) {
          var renderObj = {};
          var colorTag = nextMsg && nextMsg['color'];
          if (colorTag && _.isUndefined(options.customColors[colorTag])) {
            console.warn('\n -- Debugger Warning: Color Directive "' + colorTag + '" was not found in the settings. --\n');
          } else if (colorTag) {
            renderObj[colorTag] = customMessage.replace(/%/g, '');
            message = message.replace(customMessage, render(renderObj));
          }
          nextMsg = messages[i + 1];
          i++;
        });
        out += Array(subsystemsLength - subsystem.length).join(' ') + '   ' + message;
      } else if (i === 0) {
        out += Array(subsystemsLength - subsystem.length).join(' ') + '   ' + render(message);
      } else {
        out += '\n' + Array(subsystemsLength + 7).join(' ') + render(message);
      }
    }
  };

  for (var i = 0; i < messages.length; i++) {
    _loop();
  }
  return out;
};
//# sourceMappingURL=parser.js.map