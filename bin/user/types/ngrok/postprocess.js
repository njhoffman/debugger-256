const _ = require('lodash');

const lineAppend = (messages, render) => {
  // append request / user information to message line
  const parsed = messages;
  let reqLog = false;
  if (messages[1] && messages[1].id) {
    const req = messages[1];

    reqLog = [
      req.id ? ` (id: ${req.id})` : '',
      req.clientid ? `(client: ${req.clientid})` : '',
      req.typ || req.type ? `(${req.typ || req.type})` : '',
    ].filter(Boolean).join(' ');

    parsed[0] += render({ _requestId: `${reqLog}` });
    if (parsed[1] === {} || parsed[1] === '') {
      parsed.splice(1, 1);
    }
  }

  parsed[1] = _.omit(parsed[1], 'id', 'clientid', 'typ', 'type');
  return parsed;
};

module.exports = lineAppend;
