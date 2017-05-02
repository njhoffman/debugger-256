const createDebug = require('../lib/debugger');
// const obj1 = require('./objects/1');
// const obj2 = require('./objects/2');
// const obj3 = require('./objects/3');
let options = {
  /* prettyjson-256 options */
  colors:     {
    keys:    { fg:  [0, 2, 1] },
    number:  { grayscale: 11 }
  },
  customColors : {
    bold:                     { fg: [23] },
    blue:                     { fg: [0, 0, 4] },
    lightBlue:                { fg: [0, 1, 5] },
    darkBlue:                 { fg: [0, 0, 3] },
    red:                      { fg: [3, 0, 0] },
    lightRed:                 { fg: [5, 0, 0] },
    darkRed:                  { fg: [1, 0, 0] },
    green:                    { fg: [0, 3, 0] },
    lightGreen:               { fg: [0, 5, 0] },
    darkGreen:                { fg: [0, 1, 0] },
    purple:                   { fg: [1, 0, 3] },
    lightPurple:              { fg: [2, 0, 5] },
    darkPurple:               { fg: [1, 0, 1] },
    cyan:                     { fg: [2, 3, 4] },
    lightCyan:                { fg: [2, 5, 5] },
    darkCyan:                 { fg: [1, 2, 3] },
    yellow:                   { fg: [4, 5, 0] },
    orange:                   { fg: [5, 2, 0] },
    white:                    { fg: [0, 3, 0] },
    gray:                     { fg: [12] },

    fatal:                    { fg: [5, 0, 0] },
    error:                    { fg: [4, 0, 0] },
    warn:                     { fg: [4, 2, 2] },
    log:                      { fg: [0, 2, 4] },
    info:                     { fg: [2, 2, 4] },
    debug:                    { fg: [3, 3, 4] },
    trace:                    { fg: [3, 4, 4] }
  },
  /* debugger-256 options */
  colorTag: 'color'
};

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
    createDebug(ss).init(options);
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
    // createDebug(ss).log({ object1: 'object1' }, { object2: 'object2' }, { object3: 'object3' });
    // createDebug(ss).log(obj3);
  });

});


const stripAnsi = (data) => {
  const ansiRE = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
  return data.replace(ansiRE, '');
};


