const _ = require('lodash');

const indent = (num) => {
  return Array(!isNaN(num) && num > 0 ? num : 1).join(' ');
};

const parseMessage = (messages, subsystem, render) => {
  // TODO: investigate why this does not dynamically loads settings correctly at top in test environment
  const { getOptions, getSubsystems } = require('./settings');
  const ssLength = getSubsystems().length > 0
    ? _.maxBy(getSubsystems(), (ss) => ss.length).length + 1
    : subsystem.length;
  let out = '';
  for (let i = 0; i < messages.length; i++) {
    let message = messages[i];
    if (_.isObject(message)) {
      const renderedMessage = render(message, ssLength + 7);
      if (renderedMessage.trim().length > 0) {
        out += '\n' + render(message, ssLength + 7);
      }
    } else {
      let nextMsg = messages[i + 1];
      if (/%.*%/.test(message) && nextMsg && nextMsg['color']) {
        i++;
        // check for special color directive
        const colorTags = [].concat(nextMsg['color']);
        let parsedTags = [];
        message.match(/(%.*?%)/g).forEach(colorMsg => {
          _.difference(colorTags, parsedTags).some(colorTag => {
            let renderObj = {};
            if (!_.isUndefined(getOptions().customColors[colorTag])) {
              renderObj[colorTag] = colorMsg.replace(/%/g, '');
              message = message.replace(colorMsg, render(renderObj));
              parsedTags.push(colorTag);
              return true;
            }
          });
          nextMsg = messages[i + 1];
          i++;
        });
        _.difference(parsedTags, colorTags).forEach(diffTag => {
          console.warn(`\n -- Debugger Warning: Color Directive "${diffTag}" was not found in the settings. --\n`)
        });
        out += indent(ssLength - subsystem.length) + '   ' + message;
      } else if (i === 0) {
        out += indent(ssLength - subsystem.length) + '   ' + render({message});
      } else {
        out += '\n' + Array(ssLength + 7).join(' ') + render({message});
      }
    }
  }
  return out;
};

module.exports = parseMessage;
