const SystemBase = require('../system-base');
const Particle = require('./particle');
const Ripple = require('./ripple');
const Drop = require('./drop');

class System extends SystemBase {

	constructor(loader) {
		super(loader);

		this.simplex = new SimplexNoise();

		//this.duration = 3500;
		this.size = 30;
		this.cols = 25;
		this.rows = 25;

		this.drops = []
		this.ripples = [];
		this.tick = 0;

		for(let col = 0; col < this.cols; col++) {
			for(let row = 0; row < this.rows; row++) {
				let x = this.calc.map(col, 0, this.cols - 1, -this.size / 2, this.size / 2);
				let y = this.calc.map(row, 0, this.rows - 1, -this.size / 2, this.size / 2);
				let z = 0;

				this.particles.push(new Particle({
					group: this.particleGroup,
					x: x,
					y: y,
					z: z,
					size: 0.01,
					color: 0xffffff,
					opacity: 0.01
				}, this, this.loader));
			}
		}

		this.particleGroup.rotation.x = Math.PI * -0.4;
		this.particleGroup.rotation.z = Math.PI * 0.25;
	}

	createDrop() {
		this.drops.push(new Drop({
			array: this.drops,
			group: this.particleGroup,
			x: this.calc.rand(-this.size / 2, this.size / 2),
			y: this.calc.rand(-this.size / 2, this.size / 2),
			z: this.calc.rand(15, 20),
			size: 0.1,
			color: 0xffffff,
			opacity: 0
		}, this, this.loader));
	}

	updateDrops() {
		let i = this.drops.length;
		while(i--) {
			this.drops[i].update(i);
		}
	}

	createRipple(x, y) {
		this.ripples.push(new Ripple({
			array: this.ripples,
			group: this.particleGroup,
			x: x,
			y: y,
			z: -0.1
		}, this, this.loader));
	}

	updateRipples() {
		let i = this.ripples.length;
		while(i--) {
			this.ripples[i].update(i);
		}
	}

	update() {
		super.update();

		if(this.tick % 20 === 0) {
			this.createDrop();
		}

		this.updateDrops();
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

		//this.particleGroup.rotation.z += 0.005;

		if(this.exiting && !this.loader.isOrbit && !this.loader.isGrid) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProg, 0, 1, 1) * this.loader.cameraBaseZ;
		}

		this.tick++;
	}

}

module.exports = System;
