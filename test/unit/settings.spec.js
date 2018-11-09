
describe('Settings', () => {
  let settings, sandbox;
  let readFileStub;

  describe('Initialization', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      readFileStub = sandbox.stub().returns({ settings: {} });
      existsSyncStub = sandbox.stub().returns(true);
      statSyncStub = sandbox.stub().returns({ isFile: () => true });
      settings = proxyquire('../lib/settings', {
        './utils': {
          readFile: readFileStub
        },
        'fs': {
          existsSync: existsSyncStub,
          statSync: statSyncStub
        },
      });
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should attempt to read file settings on load', () => {
      expect(readFileStub).to.be.calledOnce;
    });

    it('Should override specific settings by merging customOptions parameter with existing options', () => {
      settings.initSettings({ colorTag: 'test_val1' });
      expect(settings.getOptions()).to.contain.key('colorTag');
      expect(settings.getOptions().colorTag).to.equal('test_val1');
    });

    it('Should override specific settings by merging options from a configuration file with existing options', () => {
      readFileStub.returns({ settings : { colorTag: 'test_val2' } });
      settings.initSettings();
      expect(settings.getOptions()).to.contain.key('colorTag');
      expect(settings.getOptions().colorTag).to.equal('test_val2');
    });

    // it('Should initialize settings on load', () => {
    // });
  });

  describe('Configuration File', () => {
    // TODO: initSettings is invoked on load, is this best practice?
    //    -- ensures data is always initialized when imported
    //    -- muddies test results, could be switched off with environment variable
    //    -- should probably conditionally initialize if other settings aren't initialized to prevent too many fs calls
    let readFileSyncStub, existsSyncStub, watchFileStub, unwatchFileStub, internalLogStub;
    const confFileName = '.debugger-256';
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      readFileStub = sandbox.stub();
      existsSyncStub = sandbox.stub().returns(false);
      statSyncStub = sandbox.stub().returns({ isFile: () => true });
      watchFileStub = sandbox.stub();
      unwatchFileStub = sandbox.stub();
      internalLogStub = sandbox.stub();
      settings = proxyquire('../lib/settings', {
        'fs': {
          existsSync: existsSyncStub,
          watchFile: watchFileStub,
          unwatchFile: unwatchFileStub,
          statSync: statSyncStub
        },
        './console' : {
          internalLog: internalLogStub,
        },
        './utils': {
          readFile: readFileStub
        }
      });
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should try to load the config file from the current directory, then recurse through parent directories', () => {
      //
      expect(existsSyncStub.args[0][0].split('/').slice(-3).join('/')).to.equal(`debugger-256/lib/${confFileName}`);
      expect(existsSyncStub.args[2][0].split('/').slice(-2).join('/')).to.equal(`debugger-256/${confFileName}`);
    });

    it('Should try to load files with or without the "js" extension', () => {
      //
      expect(existsSyncStub.args[1][0].split('/').slice(-3).join('/')).to.equal(`debugger-256/lib/${confFileName}.js`);
      expect(existsSyncStub.args[3][0].split('/').slice(-2).join('/')).to.equal(`debugger-256/${confFileName}.js`);
    });

    it('Should output an internal message if file found and first time loading configuration', () => {
      existsSyncStub.returns(true);
      settings.loadConfFile();
      expect(internalLogStub).to.have.callCount(1);
    });

    it('Should unwatch previously watched file and watch new location', () => {
      existsSyncStub.returns(true);
      settings.loadConfFile();
      expect(unwatchFileStub).to.have.callCount(1);
    });

    it('Should attempt to load successfully found file as JSON', () => {
      readFileStub.reset();
      existsSyncStub.returns(true);
      settings.loadConfFile();
      expect(readFileStub).have.callCount(1);
    });

    it('Should output an internal error message if file could not be parsed as JSON', () => {
      existsSyncStub.returns(true);
      readFileStub.returns('invalid json');
      settings.loadConfFile();
      expect(unwatchFileStub).to.be.calledOnce;
    });

    it('Should assign JSON to settings configuration if parsed correctly', () => {
      const validJson = { key1: "val1" };
      existsSyncStub.returns(true);
      readFileStub.returns(validJson);
      settings.loadConfFile();
      expect(settings.getConf()).to.deep.equal(validJson);
    });
  });
});
