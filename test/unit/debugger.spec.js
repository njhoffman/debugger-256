describe('Debugger', () => {
  let sandbox;
  describe('createDebug', () => {
    let createDebug;
    let logStub;
    let addSubsystemStub;
    const conf = {
      subsystems: {
        app: 6,
      },
    };
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      logStub = sandbox.stub();
      addSubsystemStub = sandbox.stub();
      createDebug = proxyquire('../lib/debugger', {
        './settings': {
          addSubsystem: addSubsystemStub,
          getConf: () => conf,
        },
        './parser': () => '',
        './console': { log: logStub },
      });
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should add argument to subsystems array if message logged', () => {
      createDebug('testing_subsystem').log('testing');
      expect(addSubsystemStub).to.have.been.called;
    });

    it('Should return an object with 8 logging methods, init, reset and showColors', () => {
      const ret = createDebug();
      ret.should.have.all.keys(
        '_dbg',
        'fatal',
        'error',
        'warn',
        'log',
        'info',
        'debug',
        'trace',
        'init',
        'reset',
        'showColors',
      );
    });

    it('Should return nothing if loggging function invoked has level above configuration level', () => {
      conf.subsystems.app = 2;
      createDebug('app').log('this should not be output');
      createDebug('app').info('this should not be output');
      createDebug('app').debug('this should not be output');
      createDebug('app').trace('this should not be output');
      expect(logStub).to.not.have.been.called;
    });

    it('Should log to console if logging function invoked has level below configuration level', () => {
      conf.subsystems.app = 4;
      createDebug('app').log('this should be output');
      createDebug('app').info('this should be output');
      createDebug('app').debug('this should not be output');
      createDebug('app').trace('this should not be output');
      expect(logStub).to.have.callCount(2);
    });
  });

  describe('init', () => {
    let settingsInitStub;
    let pjsonInitStub;
    let init;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      settingsInitStub = sandbox.stub().returns('settings initialized');
      pjsonInitStub = sandbox.stub();
      init = proxyquire('../lib/debugger', {
        './settings': { initSettings: settingsInitStub },
        'prettyjson-256': { init: pjsonInitStub },
      })().init;
    });
    afterEach(() => {
      sandbox.restore();
    });

    it('Should initialize settings module with customSettings', () => {
      init({ testSetting: 'test_setting' });
      expect(settingsInitStub).to.have.been.calledOnce;
      expect(settingsInitStub).to.have.been.calledWith({ testSetting: 'test_setting' });
    });

    it('Should initialize prettyjson-256 module with result from initializing settings', () => {
      init({ testSetting: 'test_setting' });
      expect(pjsonInitStub).to.have.been.calledOnce;
      expect(pjsonInitStub).to.have.been.calledWith('settings initialized');
    });
  });
});
