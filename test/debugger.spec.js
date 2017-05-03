describe('debugger module', () => {
  let sandbox;
  describe('createDebug', () => {
    let createDebug, logStub, addSubsystemStub;
    let subsystems = ['test_ss_1'];
    let conf = {
      'app' : 6
    };
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      logStub = sandbox.stub();
      addSubsystemStub = sandbox.stub();
      createDebug = proxyquire('../lib/debugger', {
        './settings': {
          addSubsystem: addSubsystemStub,
          getConf: () => conf
        },
        './parser' : () => '',
        './console': { log: logStub }
      });
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should add argument to subsystems array', () => {
      createDebug('testing_subsystem');
      expect(addSubsystemStub).to.have.been.called;
    });

    it('Should return an object with 7 logging methods, init, reset and showColors', () => {
      const ret = createDebug();
      ret.should.have.all.keys('fatal', 'error', 'warn', 'log', 'info', 'debug', 'trace', 'init', 'reset', 'showColors');
    });

    it('Should return nothing if loggging function invoked has level above configuration level', () => {
      conf.app = 2;
      createDebug('app').log('this should not be output');
      createDebug('app').info('this should not be output');
      createDebug('app').debug('this should not be output');
      createDebug('app').trace('this should not be output');
      expect(logStub).to.not.have.been.called;
    });

    it('Should log to console if logging function invoked has level below configuration level', () => {
      conf.app = 4;
      createDebug('app').log('this should be output');
      createDebug('app').info('this should be output');
      createDebug('app').debug('this should not be output');
      createDebug('app').trace('this should not be output');
      expect(logStub).to.have.callCount(2);
    });
  });

  describe('init', () => {
    let settingsInitStub, pjsonInitStub, init;

    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      settingsInitStub = sandbox.stub().returns('settings initialized');
      pjsonInitStub = sandbox.stub();
      init = proxyquire('../lib/debugger', {
        './settings': { initSettings: settingsInitStub },
        'prettyjson-256': { init: pjsonInitStub }
      })().init;
    });
    afterEach(() => {
      sandbox.restore();
    });

    it('Should initialize settings module with customSettings', () => {
      init({ testSetting: 'test_setting' });
      expect(settingsInitStub).to.have.been.called.once;
      expect(settingsInitStub).to.have.been.calledWith({ testSetting: 'test_setting' });
    });

    it('Should initialize prettyjson-256 module with result from initializing settings', () => {
      init({ testSetting: 'test_setting' });
      expect(pjsonInitStub).to.have.been.called.once;
      expect(pjsonInitStub).to.have.been.calledWith('settings initialized');
    });
  });

  describe('showColors', () => {
    let parseStub, logStub, showColors;
    const options = {
      customColors: {
        customColor1: 'colorVal1',
        customColor2: 'colorVal2',
        customColor3: 'colorVal3'
      }
    };
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      parseStub = sandbox.stub();
      logStub = sandbox.stub();
      showColors = proxyquire('../lib/debugger', {
        './settings': {
          options
        },
        './parser' : parseStub,
        './console': { log: logStub }
      })().showColors;
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should call parseMessage for each customColor', () => {
      showColors();
      expect(parseStub).to.have.been.called.thrice;
    });

    it('Should output each customColor to console', () => {
      showColors();
      expect(logStub).to.have.been.called.thrice;
    });
  });
});
