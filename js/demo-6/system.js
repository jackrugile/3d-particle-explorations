const SystemBase = require('../system-base');
const Particle = require('./particle');
const Osc = require('../utils/osc');

class System extends SystemBase {

	constructor(loader) {
		super(loader);

		this.duration = 8200;
		this.count = 60;
		this.outer = 12;

		for(let i = 0; i < this.count; i++) {
			let x = 0;
			let y = 0;
			let z = this.calc.map(i, 0, this.count - 1, -15, 0);
			let size = this.calc.map(i, 0, this.count - 1, 0.2, 0.01);
			let radius = this.calc.map(i, 0, this.count - 1, 1, this.outer) - ((this.outer / this.count) * (i % 3));
			let opacity = this.calc.map(i, 0, this.count - 1, 1, 1)

			this.particles.push(new Particle({
				group: this.particleGroup,
				order: i / (this.count - 1),
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

		this.osc = new Osc(0.1, 0.0075, true, false);

		this.reset();
	}

	reset() {
		this.osc.reset();
		this.rotationYTarget = 0;
		this.lastRotationYTarget = this.rotationYTarget;
		this.rotationYProgress = 0;
	}

	replay() {
		super.replay();
		this.reset();
	}

	update() {
		super.update();

		this.osc.update(this.loader.deltaTimeNormal);

		if(this.osc.trigger) {
			this.lastRotationYTarget = this.rotationYTarget;
			this.rotationYTarget += Math.PI * -0.5;
			this.rotationYProgress = this.rotationYProgress - 1;
		}

		if(this.rotationYProgress < 1) {
			this.rotationYProgress += 0.02 * this.loader.deltaTimeNormal;
		}
		this.rotationYProgress = this.calc.clamp(this.rotationYProgress, 0, 1);

		this.particleGroup.rotation.y = this.calc.map(this.ease.inOutExpo(this.rotationYProgress, 0, 1, 1), 0, 1, this.lastRotationYTarget, this.rotationYTarget);

		if(this.exiting && !this.loader.isOrbit && !this.loader.isGrid) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProgress, 0, 1, 1) * this.loader.cameraBaseZ;
		}
	}

}

module.exports = System;
