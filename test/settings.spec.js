
describe('Settings', () => {
  let settings, sandbox;
  describe('Initialization', () => {
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      settings = require('../lib/settings');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should override specific settings by merging customOptions parameter with existing options', () => {
      settings.initSettings({ colorTag: 'test_val1' });
      expect(settings.getOptions()).to.contain.key('colorTag');
      expect(settings.getOptions().colorTag).to.equal('test_val1');
    });

    it('Should override specific settings by merging options from a configuration file with existing options', () => {
      const loadConfStub = sinon.stub(settings, 'loadConfFile')
        .returns({ '_debugger-256' : { colorTag: 'test_val2' } });
      settings.initSettings();
      expect(loadConfStub).to.be.called.once;
      expect(settings.getOptions()).to.contain.key('colorTag');
      expect(settings.getOptions().colorTag).to.equal('test_val2');
    });

    it('Should initialize settings on load', () => {
    });
  });

  describe('Configuration file loading', () => {
    // TODO: initSettings is invoked on load, is this best practice?
    //    -- ensures data is always initialized when imported
    //    -- muddies test results, could be switched off with environment variable
    //    -- should probably conditionally initialize if other settings aren't initialized to prevent too many fs calls
    let readFileSyncStub, existsSyncStub, watchFileStub, unwatchFileStub, internalLogStub;
    const confFileName = '.debugger-256';
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      readFileSyncStub = sandbox.stub();
      existsSyncStub = sandbox.stub().returns(false);
      watchFileStub = sandbox.stub();
      unwatchFileStub = sandbox.stub();
      internalLogStub = sandbox.stub();
      settings = proxyquire('../lib/settings', {
        'fs': {
          readFileSync: readFileSyncStub,
          existsSync: existsSyncStub,
          watchFile: watchFileStub,
          unwatchFile: unwatchFileStub
        },
        './console' : {
          internalLog: internalLogStub
        }
      });
    });

    afterEach(() => {
      sandbox.restore();
    });

    // loadConf is executed once with proxyquire import above
    it('Should try to load the config file from the current directory, then the app root directory', () => {
      //
      expect(existsSyncStub).to.have.callCount(2);
      expect(existsSyncStub.args[0][0].split('/').slice(-3).join('/')).to.equal(`debugger-256/lib/${confFileName}`);
      expect(existsSyncStub.args[1][0].split('/').slice(-2).join('/')).to.equal(`debugger-256/${confFileName}`);
    });

    it('Should output an internal message if file found and first time loading configuration', () => {
      existsSyncStub.returns(true);
      readFileSyncStub.returns('{}');
      settings.loadConfFile();
      expect(internalLogStub).to.have.callCount(1);
    });

    it('Should unwatch previously watched file and watch new location', () => {
      existsSyncStub.returns(true);
      readFileSyncStub.returns('{}');
      settings.loadConfFile();
      expect(unwatchFileStub).to.have.callCount(1);
    });

    it('Should attempt to load successfully found file as JSON', () => {
      existsSyncStub.returns(true);
      settings.loadConfFile();
      expect(readFileSyncStub).have.callCount(1);
    });

    it('Should output an internal error message if file could not be parsed as JSON', () => {
      existsSyncStub.returns(true);
      readFileSyncStub.returns('invalid json');
      settings.loadConfFile();
      expect(unwatchFileStub).to.be.called.twice;
    });

    it('Should assign JSON to settings configuration if parsed correctly', () => {
      const validJson = '{ "key1": "val1" }';
      existsSyncStub.returns(true);
      readFileSyncStub.returns(validJson);
      settings.loadConfFile();
      expect(settings.getConf()).to.deep.equal({ key1: 'val1' });
    });
  });
});
