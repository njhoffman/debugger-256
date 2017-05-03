const { maxBy, isObject, isUndefined } = require('lodash');
const { getOptions, getSubsystems } = require('./settings');

const parseMessage = (messages, subsystem, render) => {
  const ssLength = getSubsystems().length > 0 ? maxBy(getSubsystems(), (ss) => ss.length).length + 1 : subsystem.length;
  let out = '';
  for (let i = 0; i < messages.length; i++) {
    let message = messages[i];
    if (isObject(message)) {
      out += '\n' + render(message, ssLength + 7);
    } else {
      let nextMsg = messages[i + 1];
      if (/%.*%/.test(message) && nextMsg['color']) {
        i++;
        // check for special color directive
        message.match(/(%.*?%)/g).forEach(customMessage => {
          let renderObj = {};
          let colorTag = nextMsg && nextMsg['color'];
          if (colorTag && isUndefined(getOptions().customColors[colorTag])) {
            console.warn(`\n -- Debugger Warning: Color Directive "${colorTag}" was not found in the settings. --\n`);
          } else if (colorTag) {
            renderObj[colorTag] = customMessage.replace(/%/g, '');
            message = message.replace(customMessage, render(renderObj));
          }
          nextMsg = messages[i + 1];
          i++;
        });
        out += Array(ssLength - subsystem.length).join(' ') + '   ' + message;
      } else if (i === 0) {
        out += Array(ssLength - subsystem.length).join(' ') + '   ' + render(message);
      } else {
        out += '\n' + Array(ssLength + 7).join(' ') + render(message);
      }
    }
  }
  return out;
};

module.exports = parseMessage;
