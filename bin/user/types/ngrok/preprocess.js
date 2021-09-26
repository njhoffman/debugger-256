const _ = require('lodash');

const parseLevel = (lvl, hasError) => {
  if (lvl === 'dbug' && !hasError) {
    return 'debug';
  } else if (lvl === 'eror') {
    return 'error';
  } else if (lvl === 'crit') {
    return 'fatal';
  } else if (hasError) {
    return 'warn';
  }
  return 'info';
};

const parseBeautifiers = (message) => {
  const { msg, comp, latency_ms: latency, err, ...parsed } = message;
  if (msg === 'waiting for update') {
    return false;
  } else if (msg === 'heartbeat received') {
    _.merge(parsed, { _heartbeat: latency });
  } else if (comp) {
    _.merge(parsed, { _comp: comp });
  } else if (err) {
    _.merge(parsed, { _err: err });
  }
  return { msg, ...parsed };
};

const parse = (message) => {
  const { lvl, msg, obj, t, err, name, ...extra } = message;

  const hasError = err && err !== '<nil>';
  const level = parseLevel(lvl, hasError);

  const parsed = {
    level,
    msg,
    name: 'ngrok',
    subsystem: name || obj || 'ngrok',
    time: t,
    ...extra
  };

  if (hasError) {
    _.merge(parsed, { err });
  }

  return parseBeautifiers(parsed);
};

module.exports = parse;
