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
  
});