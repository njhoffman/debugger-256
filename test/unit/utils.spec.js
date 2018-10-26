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
      sandbox = sinon.sandbox.create();
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
      expect(pjsonRenderStub).to.have.been.called.thrice;
    });

    it('Should output each customColor to console', () => {
      showColors(options);
      expect(logStub).to.have.been.called.thrice;
    });
  });
});
