const { clr } = require('./config');

const logger = (target, msg) => {
  const type = msg[0];
  if (type === 'send') {
    target.pushLine(` ${clr.orange('SEND')} ${clr.gray(msg.slice(1))}`);
  } else {
    target.pushLine(clr.gray(msg));
  }
};

module.exports = {
  logger
};
