// const _ = require('lodash');

module.exports = (settings, utils) => {
  // const { padLeft, padRight, numCommas, humanSize } = utils;

  const heartbeat = (latency, render, confLevel) => {
    const msg = ` ❤  ${latency} ms `;
    // if (confLevel < 6) {
    //   return '';
    // }
    return msg;
  };

  const beautifierMap = {
    _heartbeat: heartbeat
  };

  return beautifierMap;
};
