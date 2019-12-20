module.exports = () => {
  describe('Debugger', () => {
    let sandbox;
    describe('Output', () => {
      let output;
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
        ({ output } = proxyquire('../lib/debugger', {
          './settings': {
            addSubsystem: addSubsystemStub,
            getConf: () => conf,
          },
          './parser': () => '',
          './console': { log: logStub },
        }));
      });

      afterEach(() => {
        sandbox.restore();
      });

      it('Should add argument to subsystems array if message logged', () => {
        output(3, 'testing_subsystem', 'testing');
        expect(addSubsystemStub).to.have.been.called;
      });

      it('Should return nothing if loggging function invoked has level above configuration level', () => {
        conf.subsystems.app = 2;
        output(3, 'app', 'this should not be output');
        output(4, 'app', 'this should not be output');
        output(5, 'app', 'this should not be output');
        expect(logStub).to.not.have.been.called;
      });

      it('Should log to console if logging function invoked has level below configuration level', () => {
        conf.subsystems.app = 4;
        output(3, 'app', 'this should be output');
        output(2, 'app', 'this should be output');
        output(1, 'app', 'this should be output');
        output(0, 'app', 'this should be output');
        expect(logStub).to.have.callCount(4);
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
        }).init;
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
};
