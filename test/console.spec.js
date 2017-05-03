describe('console output module', () => {
  // TODO: should output really be tested by stubbing console functions? risky, must ensure restored on error

  let consoleMod = require('../lib/console');

  it('Should provide a proxy to console.error', () => {
    expect(consoleMod).to.have.property('error');
    expect(consoleMod.error).to.be.a.function;
    consoleMod.error();
  });

  it('Should provide a proxy to console.warn', () => {
    expect(consoleMod).to.have.property('warn');
    expect(consoleMod.warn).to.be.a.function;
    consoleMod.warn();
  });

  it('Should provide a proxy to console.log', () => {
    expect(consoleMod).to.have.property('log');
    expect(consoleMod.log).to.be.a.function;
    consoleMod.log();
  });

  it('Should provide a proxy to console.info', () => {
    expect(consoleMod).to.have.property('info');
    expect(consoleMod.info).to.be.a.function;
    consoleMod.info();
  });

  it('Should expose a function for internal logging', () => {
    expect(consoleMod).to.have.property('internalLog');
    expect(consoleMod.internalLog).to.be.a.function;
    consoleMod.internalLog();
  });
});
