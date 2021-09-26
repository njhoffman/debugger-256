const _ = require('lodash');
const { identifyLog } = require('./types');
const utils = require('./utils');

const settings = {
  depth :  -1,
  showColorsOnLoad : false,
  showSettingsOnLoad : false,
  colors : {
    keys  :  { fg : [0, 1, 1] },
    string : { fg : 15 }
  },
  customColors: {
    bold                     : { fg: 23 },
    gray                     : { fg: 8 },

    dbPrefix                 : { fg: [1, 2, 2] },
    dbOpQuery                : { fg: [0, 3, 4] },
    dbOpDelete               : { fg: [4, 1, 0] },
    dbOpInsert               : { fg: [0, 4, 2] },
    dbOpSeed                 : { fg: [0, 4, 3] },
    dbOpUpdate               : { fg: [0, 4, 2] },
    dbOpTable                : { fg: [3, 4, 4] },
    dbOpName                 : { fg: [2, 3, 3] },
    dbOpResults              : { fg: [4, 4, 4] },

    logTimer                 : { fg: [3, 0, 5] },
    sqlServer                : { fg: [1, 4, 3] },
    sqlPort                  : { fg: [1, 2, 4] },
    sqlDatabase              : { fg: [4, 2, 1] },
    responseGet              : { fg: [2, 3, 3] },
    responsePost             : { fg: [1, 2, 4] },
    responseDelete           : { fg: [4, 1, 4] },
    requestGet               : { fg: [0, 3, 2] },
    requestDelete            : { fg: [4, 1, 1] },
    requestPost              : { fg: [3, 2, 3] },
    requestOther             : { fg: [1, 3, 3] },
    requestUrl               : { fg: 21 },
    requestParams            : { fg: 16 },
    responseError            : { fg: [4, 0, 0] },
    responseWarn             : { fg: [4, 2, 1] },
    responseRedirect         : { fg: [0, 2, 4] },
    responseOk               : { fg: [0, 4, 1] },
    responseTime             : { fg: [4, 3, 2] },
    webpackMemoryLabel       : { fg: [1, 2, 4] },
    webpackMemoryValue       : { fg: [5, 5, 5] },
    webpackMemoryLabelWarn   : { fg: [3, 2, 4] },
    webpackMemoryValueWarn   : { fg: [3, 2, 0] },
    webpackMemoryLabelDanger : { fg: [5, 2, 4] },
    webpackMemoryValueDanger : { fg: [5, 0, 0] },
    webpackDetailMemoryValue : { fg: [5, 5, 5] }
  }
};

const preprocess = (message) => {
  const { name, preprocess: preFunc } = identifyLog(message);

  let parsedMessage = message;
  if (_.isFunction(preFunc)) {
    parsedMessage = preFunc(message);
  }
  return parsedMessage ? { ...parsedMessage, _log_variant: name } : null;
};

const postprocess = (message, render) => {
  const { postprocess: postFunc } = identifyLog(message[1]);

  if (_.isFunction(postFunc)) {
    return postFunc(message, render);
  }
  return message;
};

const beautifiers = (message) => {
  const { beautifiers: initBeautifiers } = identifyLog(message[1]);
  return _.isFunction(initBeautifiers) ? initBeautifiers(settings, utils) : [];
};

module.exports = {
  settings,
  preprocess,
  postprocess,
  beautifiers
};
