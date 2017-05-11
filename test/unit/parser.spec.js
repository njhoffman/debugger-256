describe('Parser', () => {
  let sandbox;
  describe('Standard Messages', () => {
    let parser, renderStub;
    let subsystems = [''];
    let options = {};
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      renderStub = sandbox.stub().returns('');
      parser = proxyquire('../lib/parser', {
        './settings': {
          getSubsystems : () => subsystems,
          getOptions : () => options
        }
      });
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should render each message', () => {
      const messages = [
        'message test 1',
        'message test 2',
        'message test 3'
      ];
      parser(messages, '', renderStub);
      expect(renderStub).to.have.been.called.thrice;
    });

    // TODO: make 3 spaces from key a customizeable option
    it('Should render single line message with spacing of 3 if no subsystems', () => {
      const messages = [
        'message test 1'
      ];
      const out = parser(messages, '', renderStub);
      expect(out.length).to.equal(3);
    });

    it('Should render single line message correct spacing with additional existing subystems', () => {
      const ss = 'currSubsystem';
      subsystems = [ 'testingSub1', 'test2', 'testingSubsystems3' ];
      const messages = [
        'message test 1'
      ];
      const out = parser(messages, ss, renderStub);
      expect(out.length).to.equal(8);
    });

    // it('Should render messages with correct spacing with additional existing subsystems', () => {
    //   const messages = [
    //     'message test 1',
    //     'message test 2',
    //     'message test 3'
    //   ];
    //   parser(messages, '', renderStub);
    //   expect(renderStub).to.have.been.called.thrice;
    // });
  });
  describe('Color Messages', () => {

  });
});
