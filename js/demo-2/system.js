const SystemBase = require('../system-base');
const Particle = require('./particle');
const Osc = require('../utils/osc');

class System extends SystemBase {

	constructor(loader) {
		super(loader);

		this.duration = 7700;
		this.simplex = new FastSimplexNoise();
		this.count = 300;
		this.size = 30;

		for(let i = 0; i < this.count; i++) {
			let x = this.calc.map(i, 0, this.count , -this.size / 2, this.size / 2) + (this.size / this.count / 2);
			let y = 0;
			let z = 0;

			this.particles.push(new Particle({
				group: this.particleGroup,
				x: x,
				y: y,
				z: z,
				size: this.calc.map(Math.abs(x), 0, this.size / 2, 0.2, 0.01),
				color: i % 2 === 0 ? 0xffffff : 0x56311e,
				opacity: 1,
				alternate: i % 2 === 0
			}, this, this.loader));
		}

		this.osc1 = new Osc(0.2, 0.015);
		this.osc2 = new Osc(0, 0.015, true, false);

		this.reset();
	}

	reset() {
		this.osc1.reset();
		this.osc1Eased = 0;
		this.osc2.reset();
		this.rotationZTarget = 0;
		this.lastRotationZTarget = this.rotationZTarget;
		this.rotationZProgress = 0;
	}

	replay() {
		super.replay();
		this.reset();
	}

	update() {
		super.update();

		this.osc1.update(this.loader.deltaTimeNormal);
		this.osc1Eased = this.osc1.val(this.ease.inOutExpo);
		this.osc2.update(this.loader.deltaTimeNormal);

		if(this.osc2.triggerBot) {
			this.lastRotationZTarget = this.rotationZTarget;
			this.rotationZTarget += Math.PI / -2;
			this.rotationZProgress = this.rotationZProgress - 1;
		}

		if(this.rotationZProgress < 1) {
			this.rotationZProgress += 0.025 * this.loader.deltaTimeNormal;
		}
		this.rotationZProgress = this.calc.clamp(this.rotationZProgress, 0, 1);

		this.particleGroup.rotation.z = this.calc.map(this.ease.inOutExpo(this.rotationZProgress, 0, 1, 1), 0, 1, this.lastRotationZTarget, this.rotationZTarget);

		if(this.exiting && !this.loader.isOrbit && !this.loader.isGrid) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProgress, 0, 1, 1) * this.loader.cameraBaseZ;
		}
	}

}

module.exports = System;
