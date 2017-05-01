const _ = require('lodash');
const { getOptions, subsystems } = require('./settings');

module.exports = (messages, subsystem, render) => {
  const subsystemsLength = _.maxBy(subsystems, (ss) => ss.length).length + 1;
  let out = '';
  for (var i = 0; i < messages.length; i++) {
    let message = messages[i];
    if (_.isObject(message)) {
      out += '\n' + render(message, subsystemsLength + 7);
    } else {
      let nextMsg = messages[i + 1];
      if (/%.*%/.test(message) && nextMsg['color']) {
        i++;
        // check for special color directive
        message.match(/(%.*?%)/g).forEach(customMessage => {
          let renderObj = {};
          let colorTag = nextMsg && nextMsg['color'];
          if (colorTag && _.isUndefined(getOptions().customColors[colorTag])) {
            console.warn(`\n -- Debugger Warning: Color Directive "${colorTag}" was not found in the settings. --\n`);
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
  }
  return out;
};
