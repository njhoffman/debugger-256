const fs = require('fs');
const path = require('path');

let showOutput = false;

let options = {
  /* prettyjson-256 options */
  alphabetizeKeys:    false,
  defaultIndentation: 2,
  depth:              -1,
  emptyArrayMsg:      '(empty array)',
  emptyObjectMsg:     '{}',
  emptyStringMsg:     '""',
  noColor:            false,
  numberArrays:       false,
  showEmpty:          true,
  colors:             {
    boolFalse:        { fg: [5, 4, 4] },
    boolTrue:         { fg: [4, 4, 5] },
    dash:             { fg: [2, 5, 4] },
    date:             { fg: [0, 5, 2] },
    depth:            { fg: [9] },
    empty:            { fg: [13] },
    functionHeader:   { fg: [13] },
    functionTag:      { fg: [4, 4, 5] },
    keys:             { fg: [0, 2, 1] },
    number:           { grayscale: 11 },
    string:           null
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

const testSubs = [
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

const checksum = (s) => {
  var chk = 0x12345678;
  var len = s.length;
  for (var i = 0; i < len; i++) {
    chk += (s.charCodeAt(i) * (i + 1));
  }
  // returns 32-bit integer checksum encoded as a string containin it's hex value
  return (chk & 0xffffffff).toString(16);
};

const writeSnapshot = (name, data) => {
  const fullPath = path.resolve(__dirname, `../snapshots/${name}`);
  fs.writeFile(fullPath, data, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log(`\n\n -- Snapshot "${fullPath}" Saved\n\n`);
  });
};

const loadSnapshot = (name) => {
  const fullPath = path.resolve(__dirname, `../snapshots/${name}`);
  if (fs.existsSync(fullPath)) {
    return fs.readFileSync(fullPath);
  }
  return false;
};

const testOutput = (ret, expected, customOptions = {}, showOutput = false, saveSnapshot = false) => {
  const snapshot = loadSnapshot(expected);
  const newOptions = Object.assign(Object.assign({}, options), customOptions);
  const failOut = snapshot ? `\n(expected)\n${snapshot}\n(returned)\n${ret}\n` : `\n(returned)\n${ret}\n`;
  showOutput && console.log(`\n${ret}\n`);
  // expect(checksum(ret)).to.equal(expected);
  expect(checksum(ret), failOut).to.equal(expected);
  saveSnapshot && writeSnapshot(expected, ret);
};


describe('Integration tests', () => {
  let sandbox, logStub, warnStub;

  describe('General output', () => {
    let createDebug;
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      logStub = sandbox.stub();
      warnStub = sandbox.stub();
      createDebug = proxyquireNoCache('../lib/debugger', {
        './console' : { log: logStub, warn: warnStub }
      });
      createDebug().reset();
      createDebug().init(options);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should output correct indentation depending on initialized subsystems 1', () => {
      const expected = '1245ddc8';
      createDebug(testSubs[5]).log('');
      createDebug(testSubs[1]).log('');
      createDebug(testSubs[0]).log(loremIpsum[0]);
      const output = stripAnsi(logStub.args[2][0]);
      showOutput && console.log(output);
      expect(checksum(output)).to.equal(expected);
    });

    it('Should output correct indentation depending on initialized subsystems 2', () => {
      const expected = '12420f90';
      createDebug(testSubs[3]).log('');
      createDebug(testSubs[1]).log('');
      createDebug(testSubs[0]).log(loremIpsum[0]);
      const output = stripAnsi(logStub.args[2][0]);
      showOutput && console.log(output);
      expect(checksum(output)).to.equal(expected);
    });

    it('Should output correct colors from initial options determined by log level #1', () => {
      const ss = testSubs[1];
      const li = loremIpsum[3];
      const logs = logStub.args;

      createDebug(ss).fatal(li);
      testOutput(logs[0][0], '12433a98');

      createDebug(ss).error(li);
      testOutput(logs[1][0], '12433a2f');

      createDebug(ss).warn(li);
      testOutput(logs[2][0], '12433a6a');

      createDebug(ss).log(li);
      testOutput(logs[3][0], '12430803');

      createDebug(ss).info(li);
      testOutput(logs[4][0], '12433a1d');

      createDebug(ss).debug(li);
      testOutput(logs[5][0], '12433a61');

      createDebug(ss).trace(li);
      testOutput(logs[6][0], '12433a3c');
    });

    it('Should output correct colors with customOptions determined by log level #2', () => {
      const ss = testSubs[5];
      const li = loremIpsum[2];
      const logs = logStub.args;
      createDebug().init({
        customColors: {
          fatal: { fg: [0, 0, 5] },
          error: { fg: [2, 0, 4] },
          warn:  { fg: [2, 2, 4] },
          log:   { fg: [4, 2, 0] },
          info:  { fg: [4, 2, 2] },
          debug: { fg: [4, 3, 3] }
        }
      });

      createDebug(ss).fatal(li);
      testOutput(logs[0][0], '1245efb6');

      createDebug(ss).error(li);
      testOutput(logs[1][0], '1245f007');

      createDebug(ss).warn(li);
      testOutput(logs[2][0], '124627af');

      createDebug(ss).log(li);
      testOutput(logs[3][0], '124627e4');

      createDebug(ss).info(li);
      testOutput(logs[4][0], '124627fc');

      createDebug(ss).debug(li);
      testOutput(logs[5][0], '124627e3');

      createDebug(ss).trace(li);
      testOutput(logs[6][0], '124627ce');
    });

    it('Should output inline string coloring when initialized correctly', () => {
      const dbg = createDebug('test');
      dbg.init({ customColors: { testColor: { fg: [3, 0, 3] } } });
      dbg.log('Inline strings %can be colored% easily with the right initialization', { color: 'testColor' });
      testOutput(logStub.args[0][0], '123bf681');
    });

    it('Should produce a warning if inline string color syntax used without definition', () => {
    });
  });

  describe('Filtering', () => {
    let subs = [];
    let createDebug;
    let mockConf = {};
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      logStub = sandbox.stub();
      warnStub = sandbox.stub();
      createDebug = proxyquireNoCache('../lib/debugger', {
        './console' : { log: logStub, warn: warnStub },
        './settings' : { getConf: () => mockConf, getSubsystems: () => subs }
      });
      createDebug().reset();
      createDebug().init(options);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should not output messages with verbosity higher than subsystem configuration level', () => {
      mockConf = { app: 3 };
      const li = loremIpsum[2];
      const logs = logStub.args;
      createDebug('app').fatal(li);
      createDebug('app').error(li);
      createDebug('app').warn(li);
      createDebug('app').info(li);
      createDebug('app').log(li);
      createDebug('app').debug(li);
      createDebug('app').trace(li);
      expect(logStub).to.have.callCount(4);
    });

    it('Should not output messages with verbosity higher than parent wildcard (*) configuration level', () => {
      mockConf = { app: { '*' : 2 } };
      subs = ['app:config'];
      const li = loremIpsum[0];
      const logs = logStub.args;
      createDebug('app:config').fatal(li);
      createDebug('app:config').error(li);
      createDebug('app:config').warn(li);
      createDebug('app:config').info(li);
      createDebug('app:config').log(li);
      createDebug('app:config').debug(li);
      createDebug('app:config').trace(li);
      expect(logStub).to.have.callCount(3);
    });
  });
});

const stripAnsi = (data) => {
  const ansiRE = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
  return data.replace(ansiRE, '');
};
