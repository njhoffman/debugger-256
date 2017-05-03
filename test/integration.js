// const obj1 = require('./objects/1');
// const obj2 = require('./objects/2');
// const obj3 = require('./objects/3');

const showOutput = false;

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

describe('Integration tests', () => {

  let sandbox, createDebug, logStub, warnStub;

  let subs = [];
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    logStub = sandbox.stub();
    warnStub = sandbox.stub();
    createDebug = proxyquireNoCache('../lib/debugger', {
      './console' : { log: logStub, warn: warnStub },
    });
    createDebug().reset();
    createDebug().init(options);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('General output', () => {

    it('Should output correct indentation depending on initialized subsystems 1', () => {
      const expected = '1245ddc8';
      createDebug(testSubs[5]);
      createDebug(testSubs[1]);
      createDebug(testSubs[0]).log(loremIpsum[0]);
      const output = stripAnsi(logStub.args[0][0]);
      showOutput && console.log(output);
      expect(checksum(output)).to.equal(expected);
    });

    it('Should output correct indentation depending on initialized subsystems 2', () => {
      const expected = '12420f90';
      createDebug(testSubs[3]);
      createDebug(testSubs[1]);
      createDebug(testSubs[0]).log(loremIpsum[0]);
      const output = stripAnsi(logStub.args[0][0]);
      showOutput && console.log(output);
      expect(checksum(output)).to.equal(expected);
    });

    it('Should output correct colors from initial options determined by log level', () => {
      const ss = testSubs[1];
      const li = loremIpsum[3];
      createDebug(ss).fatal(li);
      showOutput && console.log(logStub.args[0][0]);
      expect(checksum(logStub.args[0][0])).to.equal('124407d3');
      createDebug(ss).error(li);
      showOutput && console.log(logStub.args[1][0]);
      expect(checksum(logStub.args[1][0])).to.equal('12440746');
      createDebug(ss).warn(li);
      showOutput && console.log(logStub.args[2][0]);
      expect(checksum(logStub.args[2][0])).to.equal('12440795');
      createDebug(ss).info(li);
      showOutput && console.log(logStub.args[3][0]);
      expect(checksum(logStub.args[3][0])).to.equal('1244072c');
      createDebug(ss).log(li);
      showOutput && console.log(logStub.args[4][0]);
      expect(checksum(logStub.args[4][0])).to.equal('1243d452');
      createDebug(ss).debug(li);
      showOutput && console.log(logStub.args[5][0]);
      expect(checksum(logStub.args[5][0])).to.equal('12440788');
      createDebug(ss).trace(li);
      showOutput && console.log(logStub.args[6][0]);
      expect(checksum(logStub.args[6][0])).to.equal('12440757');
    });

    it('Should output correct colors with customOptions determined by log level', () => {
      const ss = testSubs[5];
      const li = loremIpsum[2];
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
      showOutput && console.log(logStub.args[0][0]);
      expect(checksum(logStub.args[0][0])).to.equal('1246d325');
      createDebug(ss).error(li);
      showOutput && console.log(logStub.args[1][0]);
      expect(checksum(logStub.args[1][0])).to.equal('1246d396');
      createDebug(ss).warn(li);
      showOutput && console.log(logStub.args[2][0]);
      expect(checksum(logStub.args[2][0])).to.equal('12470be6');
      createDebug(ss).info(li);
      showOutput && console.log(logStub.args[3][0]);
      expect(checksum(logStub.args[3][0])).to.equal('12470c4f');
      createDebug(ss).log(li);
      showOutput && console.log(logStub.args[4][0]);
      expect(checksum(logStub.args[4][0])).to.equal('12470c2f');
      createDebug(ss).debug(li);
      showOutput && console.log(logStub.args[5][0]);
      expect(checksum(logStub.args[5][0])).to.equal('12470c2e');
      createDebug(ss).trace(li);
      showOutput && console.log(logStub.args[6][0]);
      expect(checksum(logStub.args[6][0])).to.equal('12470c11');
    });

    it('Should output inline string coloring when initialized correctly', () => {
    });

    it('Should produce a warning if inline string color syntax used without definition', () => {
    });
  });
  describe('Filtering', () => {
  });

});

const stripAnsi = (data) => {
  const ansiRE = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
  return data.replace(ansiRE, '');
};


