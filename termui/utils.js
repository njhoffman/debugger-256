const { clr } = require('./config');
const { processLine } = require('../lib/debugger');

const logger = (target, msg) => {
  const type = msg[0];
  if (type === 'send') {
    target.pushLine(` ${clr.orange('SEND')} ${clr.gray(msg.slice(1))}`);
  } else if (type === 'json') {
    const fmtLine = processLine(msg);
    console.log("***", fmtLine, "\n\n", msg);
    target.pushLine(fmtLine);
    // target.pushLine(processLine(msg));
  } else {
    target.pushLine(clr.gray(msg));
  }
};

module.exports = {
  logger
};
