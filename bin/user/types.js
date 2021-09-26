const _ = require('lodash');
const path = require('path');
const logTypes = require('require-all')({
  dirname: path.join(__dirname, 'types'),
  recursive: false
});

const identifyLog = (message) => {
  const logName = message._log_variant || _.findKey(logTypes, logType => {
    const { identifier } = logType;
    const commonKeys = _.intersection(_.keys(message), identifier);
    if (_.isFunction(identifier) && identifier(message)) {
      return true;
    } else if (commonKeys.length === _.keys(identifier).length) {
      return true;
    }
    return false;
  });
  return { name: logName, ...logTypes[logName] };
};

module.exports = { identifyLog };
