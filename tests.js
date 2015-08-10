// the var "gui" is established in main.js
var assert = chai.assert;
mocha.setup('bdd');

describe('dat.gui interface', () => {
  
  describe('opacity slider', () => {
    it('should change the play speed of its assigned layer', () => {
        for (var n=0; n <= 2; n++) {
            // .__controllers[1] is opacity
            gui.__folders["gif " + (n+1)].__controllers[1].setValue(1);
            assert.equal(1, frames[n].style.opacity)
        }
    });
  });
  
  describe('blend mode switch', () => {
    it('should change the blend mode of its assigned layer', () => {
	    for (var n=0; n <= 2; n++) {
            // .__controllers[2] is blendMode
            gui.__folders["gif " + (n+1)].__controllers[2].setValue("screen");
            assert.equal("screen", frames[n].style["mix-blend-mode"])
        }
    });
  });
  
  describe('play speed slider', () => {
    it('should change the play speed of its assigned layer', () => {
        for (var n=0; n <= 2; n++) {
            // .__controllers[3] is playSpeed
            gui.__folders["gif " + (n+1)].__controllers[3].setValue(2);
            assert.strictEqual(2, frames[n].speed)
        }
    });
  });
  
  describe('ping-pong switch', () => {
    it('should change the playback mode of the layer to ping-pong when true', () => {
		for (var n=0; n <= 2; n++) {
			// .__controllers[4] is ping-pong
			gui.__folders["gif " + (n+1)].__controllers[4].setValue(true);
			assert.equal("true", frames[n].getAttribute("ping-pong"))
		}
    });	
	it('should change the playback mode of the layer to forward when false', () => {
		for (var n=0; n <= 2; n++) {
			gui.__folders["gif " + (n+1)].__controllers[4].setValue(false);
			assert.equal(null, frames[n].getAttribute("ping-pong"))
		}
    });
  });
  
  describe("filters", () => {
	
    describe('saturation slider', () => {
        it('should change the saturation of its assigned layer', () => {
            for (var n=0; n <= 2; n++) {
                // .__controllers[0] is saturation
                gui.__folders["gif " + (n+1)].__folders.filters.__controllers[0].setValue(4)
                assert.strictEqual("4", frames[n].style.webkitFilter.match("saturate\\(([0-9])\\)")[1])
            }
		});
    });  
	
    describe('contrast slider', () => {
        it('should change the contrast of its assigned layer', () => {
            for (var n=0; n <= 2; n++) {
                // .__controllers[1] is contrast
                gui.__folders["gif " + (n+1)].__folders.filters.__controllers[1].setValue(2)
                assert.strictEqual("2", frames[n].style.webkitFilter.match("contrast\\(([0-9])\\)")[1])
            }
		});
    });
	
     describe('brightness slider', () => {
        it('should change the brightness of its assigned layer', () => {
            for (var n=0; n <= 2; n++) {
                // .__controllers[2] is brightness
                gui.__folders["gif " + (n+1)].__folders.filters.__controllers[2].setValue(0.5)
                assert.strictEqual("0.5", frames[n].style.webkitFilter.match("brightness\\(([0-9]\\.[0-9])")[1])
            }
        });
    });
	
    describe('hue slider', () => {
        it('should change the hue rotation of its assigned layer', () => {
            for (var n=0; n <= 2; n++) 
                // .__controllers[3] is hueRotate
                gui.__folders["gif " + (n+1)].__folders.filters.__controllers[3].setValue(90)
                assert.strictEqual("90", frames[n].style.webkitFilter.match("hue-rotate\\(([0-9]{2})")[1])
            }
        });
    });
	
  });
    
});
