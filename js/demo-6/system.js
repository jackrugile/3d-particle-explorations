const SystemBase = require('../system-base');
const Particle = require('./particle');

class System extends SystemBase {

	constructor(loader) {
		super(loader);

		this.count = 60;
		this.outer = 12;
		this.duration = 3500;

		for(let i = 0; i < this.count; i++) {
			let x = 0;
			let y = 0;
			let z = 0;
			let size = this.calc.map(i, 0, this.count - 1, 0.01, 0.175);
			let radius = this.calc.map(i, 0, this.count - 1, 1, this.outer) - ((this.outer / this.count) * (i % 3));
			let opacity = this.calc.map(i, 0, this.count - 1, 0.1, 1)

			this.particles.push(new Particle({
				group: this.particleGroup,
				prog: i / (this.count - 1),
				alt: i % 2 === 0,
				index: i,
				x: x,
				y: y,
				z: z,
				size: size,
				radius: radius,
				color: 0xffffff,
				opacity: opacity
			}, this, this.loader));
		}
	}

	update() {
		super.update();

		if(this.exiting && !this.loader.isOrbit) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProg, 0, 1, 1) * this.loader.cameraBaseZ;
		}
	}

}

module.exports = System;
