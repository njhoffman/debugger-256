describe('debugger module', () => {
  let sandbox, createDebug, subsystems = ['test_ss_1'];
  describe('createDebug', () => {
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      createDebug = proxyquire('../lib/debugger', {
        './settings': {
          subsystems: subsystems
        }
      });
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should add argument to subsystems array', () => {
      createDebug('testing_subsystem');
      expect(subsystems).to.deep.equal(['test_ss_1', 'testing_subsystem']);
    })

    it('Should return an object with 7 logging methods, init and showColors', () => {
      const ret = createDebug();
      ret.should.have.all.keys('fatal', 'error', 'warn', 'log', 'info', 'debug', 'trace', 'init', 'showColors');
    });

    it('Should return nothing if loggging function is invoked with level above configuration level', () => {
    });

  });
});
