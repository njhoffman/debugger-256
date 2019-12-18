const fs = require('fs');
const path = require('path');

const showOutput = false;

const options = {
  /* prettyjson-256 options */
  alphabetizeKeys: false,
  defaultIndentation: 2,
  depth: -1,
  emptyArrayMsg: '(empty array)',
  emptyObjectMsg: '{}',
  emptyStringMsg: '""',
  noColor: false,
  numberArrays: false,
  showEmpty: true,
  colors: {
    boolFalse: { fg: [5, 4, 4] },
    boolTrue: { fg: [4, 4, 5] },
    dash: { fg: [2, 5, 4] },
    date: { fg: [0, 5, 2] },
    depth: { fg: [9] },
    empty: { fg: [13] },
    functionHeader: { fg: [13] },
    functionTag: { fg: [4, 4, 5] },
    keys: { fg: [0, 2, 1] },
    number: { grayscale: 11 },
    string: null,
  },
  customColors: {
    bold: { fg: [23] },
    blue: { fg: [0, 0, 4] },
    lightBlue: { fg: [0, 1, 5] },
    darkBlue: { fg: [0, 0, 3] },
    red: { fg: [3, 0, 0] },
    lightRed: { fg: [5, 0, 0] },
    darkRed: { fg: [1, 0, 0] },
    green: { fg: [0, 3, 0] },
    lightGreen: { fg: [0, 5, 0] },
    darkGreen: { fg: [0, 1, 0] },
    purple: { fg: [1, 0, 3] },
    lightPurple: { fg: [2, 0, 5] },
    darkPurple: { fg: [1, 0, 1] },
    cyan: { fg: [2, 3, 4] },
    lightCyan: { fg: [2, 5, 5] },
    darkCyan: { fg: [1, 2, 3] },
    yellow: { fg: [4, 5, 0] },
    orange: { fg: [5, 2, 0] },
    white: { fg: [0, 3, 0] },
    gray: { fg: [12] },

    fatal: { fg: [5, 0, 0] },
    error: { fg: [4, 0, 0] },
    warn: { fg: [4, 2, 2] },
    log: { fg: [0, 2, 4] },
    info: { fg: [2, 2, 4] },
    debug: { fg: [3, 3, 4] },
    trace: { fg: [3, 4, 4] },
  },
  /* debugger-256 options */
  colorTag: 'color',
};

const testSubs = ['app', 'app:config', 'app:config:services', 'db', 'tasks', 'tasks:output:images:thumbnails'];

const loremIpsum = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
];

const checksum = (s) => {
  let chk = 0x12345678;
  const len = s.length;
  for (let i = 0; i < len; i++) {
    chk += s.charCodeAt(i) * (i + 1);
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

const stripAnsi = (data) => {
  const ansiRE = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
  return data.replace(ansiRE, '');
};

module.exports = () => {
  describe('Integration', () => {
    let sandbox;
    let logStub;
    let warnStub;

    describe('General Output', () => {
      let createDebug;
      beforeEach(() => {
        sandbox = sinon.createSandbox();
        logStub = sandbox.stub();
        warnStub = sandbox.stub();
        createDebug = proxyquireNoCache('../lib/debugger', {
          './console': { log: logStub, warn: warnStub },
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

      it('Should output correct colors from initial options determined by log level fatal', () => {
        const ss = testSubs[1];
        const li = loremIpsum[3];
        const logs = logStub.args;

        createDebug(ss).fatal(li);
        testOutput(logs[0][0], '1245389b');
      });

      it('Should output correct colors from initial options determined by log level error', () => {
        const ss = testSubs[1];
        const li = loremIpsum[3];
        const logs = logStub.args;

        createDebug(ss).error(li);
        testOutput(logs[0][0], '12453832');
      });

      it('Should output correct colors from initial options determined by log level warn', () => {
        const ss = testSubs[1];
        const li = loremIpsum[3];
        const logs = logStub.args;

        createDebug(ss).warn(li);
        testOutput(logs[0][0], '1245386d');
      });

      it('Should output correct colors from initial options determined by log level log', () => {
        const ss = testSubs[1];
        const li = loremIpsum[3];
        const logs = logStub.args;

        createDebug(ss).log(li);
        testOutput(logs[0][0], '12450374');
      });

      it('Should output correct colors from initial options determined by log level info', () => {
        const ss = testSubs[1];
        const li = loremIpsum[3];
        const logs = logStub.args;

        createDebug(ss).info(li);
        testOutput(logs[0][0], '12453820', {});
      });

      it('Should output correct colors from initial options determined by log level debug', () => {
        const ss = testSubs[1];
        const li = loremIpsum[3];
        const logs = logStub.args;

        createDebug(ss).debug(li);
        testOutput(logs[0][0], '12453864', {});
      });

      it('Should output correct colors from initial options determined by log level trace', () => {
        const ss = testSubs[1];
        const li = loremIpsum[3];
        const logs = logStub.args;

        createDebug(ss).trace(li);
        testOutput(logs[0][0], '1245383f');
      });

      /* custom options */

      it('Should output correct colors with customOptions determined by log level fatal', () => {
        const ss = testSubs[5];
        const li = loremIpsum[2];
        const logs = logStub.args;
        createDebug().init({
          customColors: {
            fatal: { fg: [0, 0, 5] },
          },
        });

        createDebug(ss).fatal(li);
        testOutput(logs[0][0], '124805c9');
      });

      it('Should output correct colors with customOptions determined by log level error', () => {
        const ss = testSubs[5];
        const li = loremIpsum[2];
        const logs = logStub.args;
        createDebug().init({
          customColors: {
            error: { fg: [2, 0, 4] },
          },
        });

        createDebug(ss).error(li);
        testOutput(logs[0][0], '1248061a');
      });

      it('Should output correct colors with customOptions determined by log level warn', () => {
        const ss = testSubs[5];
        const li = loremIpsum[2];
        const logs = logStub.args;
        createDebug().init({
          customColors: {
            warn: { fg: [2, 2, 4] },
          },
        });

        createDebug(ss).warn(li);
        testOutput(logs[0][0], '12484054');
      });

      it('Should output correct colors with customOptions determined by log level log', () => {
        const ss = testSubs[5];
        const li = loremIpsum[2];
        const logs = logStub.args;
        createDebug().init({
          customColors: {
            log: { fg: [4, 2, 0] },
          },
        });

        createDebug(ss).log(li);
        testOutput(logs[0][0], '12484089');
      });

      it('Should output correct colors with customOptions determined by log level info', () => {
        const ss = testSubs[5];
        const li = loremIpsum[2];
        const logs = logStub.args;
        createDebug().init({
          customColors: {
            info: { fg: [4, 2, 2] },
          },
        });

        createDebug(ss).info(li);
        testOutput(logs[0][0], '124840a1');
      });

      it('Should output correct colors with customOptions determined by log level debug', () => {
        const ss = testSubs[5];
        const li = loremIpsum[2];
        const logs = logStub.args;
        createDebug().init({
          customColors: {
            debug: { fg: [4, 3, 3] },
          },
        });

        createDebug(ss).debug(li);
        testOutput(logs[0][0], '12484088');
      });

      it('Should output correct colors with customOptions determined by log level trace', () => {
        const ss = testSubs[5];
        const li = loremIpsum[2];
        const logs = logStub.args;
        createDebug().init({
          customColors: {
            trace: { fg: [4, 4, 3] },
          },
        });

        createDebug(ss).trace(li);
        testOutput(logs[0][0], '124840d0');
      });

      it('Should output inline string coloring when initialized correctly', () => {
        const dbg = createDebug('test');
        dbg.init({ customColors: { testColor: { fg: [3, 0, 3] } } });
        dbg.log('Inline strings %can be colored% easily with the right initialization', { color: 'testColor' });
        testOutput(logStub.args[0][0], '123bf681');
      });

      it('Should produce a warning if inline string color syntax used without definition', () => {});
    });

    describe('Filtering', () => {
      let subs = [];
      let createDebug;
      let mockConf = {};
      beforeEach(() => {
        sandbox = sinon.createSandbox();
        logStub = sandbox.stub();
        warnStub = sandbox.stub();
        createDebug = proxyquireNoCache('../lib/debugger', {
          './console': { log: logStub, warn: warnStub },
          './settings': { getConf: () => mockConf, getSubsystems: () => subs },
        });
        createDebug().reset();
        createDebug().init(options);
      });

      afterEach(() => {
        sandbox.restore();
      });

      it('Should not output messages with verbosity higher than subsystem configuration level', () => {
        mockConf = { subsystems: { app: 3 } };
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
        mockConf = { subsystems: { app: { '*': 2 } } };
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
};
