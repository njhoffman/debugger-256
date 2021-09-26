const _ = require('lodash');

module.exports = (settings, utils) => {
  const { padLeft, padRight, numCommas, humanSize } = utils;

  const response =  (res, render) => {
    // express response object
    const { code, time, url, contentLength } = res;
    let pretty = '';

    const resStatus = code < 300 ? 'Ok'
      : code < 400 ? 'Redirect'
        : code < 500 ? 'Warn'
          : 'Error';

    const resKey = _.get(settings, `customColors.response${resStatus}`)
      ? `response${resStatus}`
      : 'bold';
    const resObj = {};
    resObj[resKey] = code;
    pretty += `${render(resObj)}  ${url} ${render({ responseTime: time })} (${contentLength} bytes)`;
    return pretty;
  };

  const request =  (req, render) => {
    // express request object
    const pretty = [''];
    const method = _.lowerCase(req.method);
    const mKey = _.get(settings, `customColors.request${_.upperFirst(method)}`)
      ? `request${_.upperFirst(method)}`
      : 'requestGet';
    const methObj = {};
    methObj[mKey] = _.upperCase(method);
    const url = req.url.split('?');
    pretty[0] += `${render(methObj)}${method === 'get' ? ' ' : ''} ${render({ requestUrl: url[0] })}`;
    if (url[1]) {
      const params = JSON.parse(
        `{"${url[1].replace(/&/g, '","').replace(/=/g, '":"')}"}`,
        (key, val) => (key === '' ? val : decodeURIComponent(val))
      );
      params._log_level = 5;
      pretty[1] = params;
    }
    return pretty;
  };

  const dbOp = (dbObj, render, confLevel) => {
    const {
      name = '',
      table,
      changes = {},
      operation,
      resultCount = '?'
    } = dbObj;
    if (!operation) {
      console.error('No Operation', dbObj);
    }
    const op = operation.toLowerCase();

    let opObj = { dbOpQuery: 'QUERY ' };
    if (op === 'seed') {
      opObj = { dbOpSeed: 'SEED  ' };
    } else if (op === 'delete') {
      opObj = { dbOpDelete: 'DELETE' };
    } else if (op === 'update') {
      opObj = { dbOpUpdate: 'UPDATE' };
    } else if (op === 'insert') {
      opObj = { dbOpInsert: 'INSERT' };
    }

    let fieldMessage = '';
    if (changes.delta && changes.delta.length > 0) {
      const delta = {
        new:           _.filter(changes.delta, { kind: 'N' }),
        deleted:       _.filter(changes.delta, { kind: 'D' }),
        edited:        _.filter(changes.delta, { kind: 'E' }),
        arrayMod:      _.filter(changes.delta, { kind: 'A' })
      };
      fieldMessage = [
        (delta.new.length > 0 ? `${delta.new.length} new` : ''),
        (delta.deleted.length > 0 ? `${delta.deleted.length} del` : ''),
        (delta.edited.length > 0 ? `${delta.edited.length} mod` : ''),
        (delta.arrayMod.length > 0 ? `${delta.arrayMod.length} arr` : '')
      ].filter(Boolean).join(', ');
    }

    const baseMessage = [
      `${render({ dbPrefix: '>>>' })} ${render(opObj)} `,
      `${render({ dbOpTable: padRight(table, 11) })} `,
      `${render({ dbOpResults: padLeft(resultCount, 3) })} result${resultCount !== 1 ? 's' : ' '}`,
      `${name.length > 0 ? ' :' : ''} ${render({ dbOpName: name })}`,
      `${fieldMessage.length > 0 ? ` [${fieldMessage}]` : ''}`
    ].join('');

    if (confLevel < 6) {
      return baseMessage;
    }
    // return [baseMessage, param&dataDetails]
    return baseMessage;
  };

  const webpackAsset = (asset, render) => {
    let sizeColor = 'white';
    if (asset.size > 1000000) {
      sizeColor = 'orange';
    } else if (asset.overLimit) {
      sizeColor = 'yellow';
    }

    const assetObj = { name: {}, size: {} };
    assetObj.name.bold = `     ${padRight(asset.name, 60)}`;
    assetObj.size[sizeColor] = humanSize(asset.size);
    return `${render(assetObj.name)} ${render(assetObj.size)}`;
  };

  const webpackFinished = (wpInfo, render) => {
    const wpObj = {
      mods:   { cyan: numCommas(wpInfo.modules) },
      chunks: { bold: wpInfo.chunks },
      size:   { bold: humanSize(wpInfo.size) },
      time:   { cyan: wpInfo.time }
    };

    return `  Built ${render(wpObj.mods)} modules into `
        + `${render(wpObj.chunks)} chunks totaling `
        + `${render(wpObj.size)} in ${render(wpObj.time)}`;
  };

  const loginSuccess = (userFields, render, confLevel) => {
    const msg = `Login in successful for ${render({ cyan : userFields.email })}`;
    if (confLevel < 6) {
      return msg;
    }
    return [msg, userFields];
  };

  const beautifierMap = {
    _response:     response,
    _request:      request,
    _dbOp:         dbOp,
    _wpAsset:      webpackAsset,
    _wpDone:       webpackFinished,
    _loginSuccess: loginSuccess
  };

  return beautifierMap;
};
