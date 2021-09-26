const lineAppend = (messages, render) => {
  // append request / user information to message line
  const parsed = messages;
  let reqLog = false;
  if (messages[1] && messages[1]._requestIp) {
    const req = messages[1];
    reqLog = `${req._requestIp} ${req._requestUser || req._requestLocation || ''}`;

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
      reqLog += ` ${browser}/${os}`;
    }

    parsed[0] += render({ _requestId: ` (${reqLog}) ${req._requestId}` });
    if (parsed[1] === {} || parsed[1] === '') {
      parsed.splice(1, 1);
    }
  }
  return parsed;
};

module.exports = lineAppend;
