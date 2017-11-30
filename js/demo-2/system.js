const SystemBase = require('../system-base');
const Particle = require('./particle');
const Osc = require('../utils/osc');

class System extends SystemBase {

	constructor(loader) {
		super(loader);

		this.duration = 6000;

		this.simplex = new FastSimplexNoise();

		this.lines = [];

		this.count = 330;
		this.visW = 30;

		this.osc = new Osc(0.2, 0.0125);
		this.oscEased = 0;

		for(let i = 0; i < this.count; i++) {
			let x = this.calc.map(i, 0, this.count , -this.visW / 2, this.visW / 2) + (this.visW / this.count / 2);
			let y = 0;
			let z = 0;

			this.particles.push(new Particle({
				group: this.particleGroup,
				x: x,
				y: y,
				z: z,
				size: this.calc.map(Math.abs(x), 0, this.visW / 2, 0.2, 0.01),
				color: i % 2 === 0 ? 0xffffff : 0x56311e,
				opacity: 1,
				alt: i % 2 === 0
			}, this, this.loader));
		}
	}

	update() {
		super.update();

		this.osc.update();
		this.oscEased = this.osc.val(this.ease.inOutExpo);

		if(this.exiting && !this.loader.isOrbit && !this.loader.isGrid) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProg, 0, 1, 1) * this.loader.cameraBaseZ;
		}
	}

}

module.exports = System;
