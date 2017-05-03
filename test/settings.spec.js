
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
      const loadConfStub = sinon.stub(settings, 'loadConfFile').returns({ '_debugger-256' : { colorTag: 'test_val2' } });
      settings.initSettings();
      expect(loadConfStub).to.be.called.once;
      expect(settings.getOptions()).to.contain.key('colorTag');
      expect(settings.getOptions().colorTag).to.equal('test_val2');
    });
  });
});
