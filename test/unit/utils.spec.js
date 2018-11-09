describe('Utils', () => {
  let sandbox;

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
      sandbox = sinon.createSandbox();
      pjsonRenderStub = sandbox.stub();
      logStub = sandbox.stub();
      showColors = proxyquire('../lib/utils', {
        'prettyjson-256': {
          init: () => pjsonRenderStub
        },
        './console': { log: logStub }
      }).showColors;
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should call render from prettyjson-256 for each customColor', () => {
      showColors(options);
      expect(pjsonRenderStub).to.have.been.calledThrice;
    });

    it('Should output each customColor to console and a blank line at the end', () => {
      showColors(options);
      expect(logStub).to.have.callCount(4);
    });
  });
});
