const SystemBase = require('../system-base');
const Particle = require('./particle');
const Ripple = require('./ripple');

class System extends SystemBase {

	constructor(loader) {
		super(loader);

		this.simplex = new SimplexNoise();

		//this.duration = 3500;
		this.size = 30;
		this.cols = 30;
		this.rows = 30;

		this.ripples = [];
		this.tick = 0;

		for(let col = 0; col < this.cols; col++) {
			for(let row = 0; row < this.rows; row++) {
				let x = this.calc.map(col, 0, this.cols - 1, -this.size / 2, this.size / 2);
				let y = this.calc.map(row, 0, this.rows - 1, -this.size / 2, this.size / 2);
				let z = 0;
				let size = this.calc.rand(0.02, 0.3);
				size = 0.05;

				this.particles.push(new Particle({
					group: this.particleGroup,
					x: x,
					y: y,
					z: z,
					size: size,
					color: 0xffffff,
					opacity: this.calc.rand(0.1, 1)
				}, this, this.loader));
			}
		}
	}

	createRipple() {
		this.ripples.push(new Ripple({
			group: this.ripples,
			x: this.calc.rand(-this.size / 2, this.size / 2),
			y: this.calc.rand(-this.size / 2, this.size / 2),
			z: -1
		}, this, this.loader));
	}

	 updateRipples() {
		let i = this.ripples.length;
		while(i--) {
			this.ripples[i].update();
		}
	}

	update() {
		super.update();

		if(this.tick % 15 === 0) {
			this.createRipple();
		}

		this.updateRipples();

		let i = this.particles.length;
		while(i--) {
			let j = this.ripples.length;
			while(j--) {
				let particle = this.particles[i];
				let ripple = this.ripples[j];
				let influence = ripple.getInfluenceVector(particle.base);
				influence.setX(0);
				influence.setY(0);
				particle.velocity.add(influence);
			}
		}

		this.particleGroup.rotation.z = Math.PI / 4;

		if(this.exiting && !this.loader.isOrbit && !this.loader.isGrid) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProg, 0, 1, 1) * this.loader.cameraBaseZ;
		}

		this.tick++;
	}

}

module.exports = System;
