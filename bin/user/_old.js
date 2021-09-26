const subsystems =  {
  "campaignScheduler": { "*" : [6, -1] },
  "messageRetry":      { "*" : [6, -1] },
  "mmsSend":           { "*" : [6, -1] },
  "smsSend":           { "*" : [6, -1] },
  "smsReceipts":       { "*" : [6, -1] },
  "smsReceive":        { "*" : [6, -1] },
  "mobileServer":      { "*" : [6, -1] },
  "UMIServer":         { "*" : [6, -1] },
  "tracker":           { "*" : [6, -1] },
  "_env": {
    "test" : {
      "api" : {
        "*" : 1
      }
    },
    "combined" : {
      "TapOnIt":           { "*" : [4, -1] },
      "monitor":           { "*" : [4, -1] },
      "campaignScheduler": { "*" : [4, -1] },
      "mmsSend":           { "*" : [4, -1] },
      "smsSend":           { "*" : [4, -1] },
      "receipts":          { "*" : [4, -1] },
      "smsReceive":        { "*" : [4, -1] },
      "mobileServer":      { "*" : [4, -1] },
      "UMIServer":         { "*" : [4, -1] },
      "tracker":           { "*" : [4, -1] }
    }
  }
};
const settings = {
  "depth" :  -1,
  "colors" : {
    "keys"  :  { "fg" : [0, 1, 1] },
    "string" : { "fg" : 15 }
  },
  "customColors"               : {
    "bold"                     : { "fg": 23 },
    "gray"                     : { "fg": 8 },
    "sqlServer"                : { "fg": [1, 4, 3] },
    "sqlPort"                  : { "fg": [1, 2, 4] },
    "sqlDatabase"              : { "fg": [4, 2, 1] },
    "responseGet"              : { "fg": [1, 4, 3] },
    "responsePost"             : { "fg": [1, 2, 4] },
    "responseDelete"           : { "fg": [4, 1, 4] },
    "requestGet"               : { "fg": [0, 3, 2] },
    "requestDelete"            : { "fg": [4, 1, 1] },
    "requestPost"              : { "fg": [3, 2, 3] },
    "requestOther"             : { "fg": [1, 3, 3] },
    "requestUrl"               : { "fg": 21 },
    "requestParams"            : { "fg": 16 },
    "responseError"            : { "fg": [4, 0, 0] },
    "responseWarn"             : { "fg": [4, 2, 1] },
    "responseRedirect"         : { "fg": [0, 2, 4] },
    "responseOk"               : { "fg": [0, 3, 0] },
    "responseTime"             : { "fg": [4, 3, 2] },
    "webpackMemoryLabel"       : { "fg": [1, 2, 4] },
    "webpackMemoryValue"       : { "fg": [4, 2, 1] },
    "webpackDetailMemoryValue" : { "fg": [5, 5, 5] },
    'receiptTo'                : { 'fg': 20 },
    'receiptProvider'          : { 'fg': 16 },
    'receiptStatus'            : { 'fg': [5, 5, 5] },
    'receiptSent'              : { 'fg': [0, 5, 5] },
    'receiptDelivered'         : { 'fg': [0, 5, 3] },
    'receiptUndelivered'       : { 'fg': [5, 1, 0] },
    'receiptID'                : { 'fg': [2, 2, 2] },
    'incomingSMSLabel'         : { 'fg': [3, 1, 5] },
    'incomingSMSFrom'          : { 'fg': 23 },
    'incomingSMSProvider'      : { 'fg': 18 },
    'incomingSMSText'          : { 'fg': [4, 5, 5] },
    'outgoingSMSLabel'         : { 'fg': [1, 2, 4] },
    'outgoingSMSTo'            : { 'fg': 23 },
    'outgoingSMSProvider'      : { 'fg': 18 },
    'outgoingSMSText'          : { 'fg': [4, 5, 5] },
    'outgoingMMSLabel'         : { 'fg': [1, 2, 4] },
    'outgoingMMSTo'            : { 'fg': 23 },
    'outgoingMMSProvider'      : { 'fg': 18 },
    'outgoingMMSText'          : { 'fg': [4, 5, 5] },
  }
};

const beautifiers = {
  sqlConfig: (sqlConfig, render, _) => {
    return `connected to mssql server ${render({ sqlServer: sqlConfig.server })}:` +
      `${render({ sqlPort: sqlConfig.port })} using database ${render({ sqlDatabase: sqlConfig.database })}`
  },
  _response: ({ code, time, url }, render, _) => {
    let pretty = '';
    const resStatus = code == 200 ? 'Ok'
      : code === 300 ? 'Redirect'
      : code === 400 ? 'Warn'
      : 'Error';
    const resKey = _.get(settings, `customColors.response${resStatus}`)
      ? `response${resStatus}`
      : 'bold';
    const resObj = {};
    resObj[resKey] = code;
    pretty += `${render(resObj)} ${url} ${render({ responseTime: time })}`;
    return pretty;
  },
  _request: (req, render, _) => {
    let pretty = [''];
    const method = _.lowerCase(req.method);
    const mKey = _.get(settings, `customColors.request${_.upperFirst(method)}`)
      ? `request${_.upperFirst(method)}`
      : 'requestGet';
    const methObj = {};
    methObj[mKey] = _.upperCase(method);
    const url = req.url.split('?');
    pretty[0] += `${render(methObj)}${method === 'get' ? ' ' : ''} ${render({ requestUrl: url[0]})}`;
    if (url[1]) {
      const params = JSON.parse(
        '{"' + url[1].replace(/&/g, '","').replace(/=/g,'":"') + '"}',
        (key, val) => key === "" ? val: decodeURIComponent(val)
      );
      params._log_level = 5;
      pretty[1] = params;
    }
    return pretty;
  },
  incomingSMS: (sms, render, _) => {
    let pretty = '';
    // FromState, SmsStatus, FromCity, Body, FromCountry, To, MessageSid, AccountSid, From
    // source, destination, transactionGUID, sourceCountroCodeAbbreviation, transactionGUID, concatenatedMessage, messageText
    const provider = sms.MessageSid ? 'TWILIO' :'AELINK';
    const to = _.get(sms, 'To') || _.get(sms, 'destination');
    const from = _.get(sms, 'From') || _.get(sms, 'source');
    const text = _.get(sms, 'Body') || _.get(sms, 'messageText') || '';
    pretty += `${render({ incomingSMSLabel : 'RECV' })} ${render({ incomingSMSFrom: from })} `;
    pretty += `(${render({ incomingSMSProvider: provider })}): ${render({ incomingSMSText: text.substring(0, 100) })}`;
    return pretty;
  }
};

const postprocess = (messages, render, _) => {
  let reqLog = false;
  if (messages[1] && messages[1]._requestIP) {
    const req = messages[1];
    reqLog = req._requestIP + ' ' +
      (req._requestUser || req._requestLocation || '');
    if (req._requestUserAgent) {
      const browser = req._requestUserAgent
        .split('/')[0]
        .replace(/\.\d+\.\d+/, '')
        .trim();
      const os = req._requestUserAgent
        .split('/')[1]
        .replace(/\.\d+\.\d+/, '')
        .replace('Windows', 'Win')
        .replace('Mac OSX', 'OSX')
        .trim();
      reqLog += ' ' + browser + '/' + os;
    }
    messages[0] += render({ _requestId: ` (${reqLog})` });
    if (messages[1] === {} || messages[1] === '') {
      messages.splice(1, 1);
    }
  }
  return messages;
};

const hideKeys = [
  'name',
  'hostname',
  'level',
  'pid',
  'subsystem',
  'time',
  'v',
  'message',
  'msg',
  '_logId',
  '_request',
  '_response',
  '_requestStart',
  '_requestIp',
  '_requestId',
  '_requestID',
  '_requestIP',
  '_requestLocation',
  '_requestUser',
  '_requestUserAgent',
  '_log_level'
]

module.exports = {
  subsystems, settings, beautifiers, postprocess, hideKeys
};
