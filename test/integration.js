const createDebug = require('../lib/debugger');

const subsystems = [
  'app',
  'app:config',
  'app:config:services',
  'db',
  'tasks',
  'tasks:output:images:thumbnails'
];

const loremIpsum = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
];

describe('Integration tests', () => {
  subsystems.forEach(ss => {
    createDebug(ss);
  });
  subsystems.forEach(ss => {
    // const li = loremIpsum[Math.ceil(Math.random() * 4) - 1];
    // createDebug(ss).fatal(li);
    // createDebug(ss).error(li);
    // createDebug(ss).warn(li);
    // createDebug(ss).info(li);
    // createDebug(ss).log(li);
    // createDebug(ss).debug(li);
    // createDebug(ss).trace(li);
  });
});


const stripAnsi = (data) => {
  const ansiRE = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
  return data.replace(ansiRE, '');
};


