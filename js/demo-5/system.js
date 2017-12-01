const SystemBase = require('../system-base');
const Particle = require('./particle');
const Ripple = require('./ripple');
const Drop = require('./drop');

class System extends SystemBase {

	constructor(loader) {
		super(loader);

		this.duration = 6000;

		this.size = 35;
		this.cols = 25;
		this.rows = 25;

		this.drops = []
		this.ripples = [];
		this.tick = 0;

		this.dropTick = 20;
		this.dropTickMin = 20;
		this.dropTickMax = 40;

		for(let col = 0; col < this.cols; col++) {
			for(let row = 0; row < this.rows; row++) {
				let x = this.calc.map(col, 0, this.cols - 1, -this.size / 2, this.size / 2);
				let y = 0;
				let z = this.calc.map(row, 0, this.rows - 1, -this.size / 2, this.size / 2);

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

		this.reset();
	}

	reset() {
		this.tick = 0;
		this.setCamera();

		let i = this.drops.length;
		while(i--) {
			this.drops[i].prog = 1;
			this.drops[i].update(i);
		}

		let j = this.ripples.length;
		while(j--) {
			this.ripples[j].destroy(i);
		}

		this.drops.length = 0;
		this.ripples.length = 0;
	}

	setCamera() {
		if(!this.loader.isGrid) {
			this.loader.camera.position.y = 20;
			this.loader.camera.lookAt(new THREE.Vector3());
		}
	}

	createDrop() {
		this.drops.push(new Drop({
			array: this.drops,
			group: this.particleGroup,
			x: this.calc.rand(-this.size / 2, this.size / 2),
			y: this.calc.rand(15, 20),
			z: this.calc.rand(-this.size / 2, this.size / 2),
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

	createRipple(x, z) {
		this.ripples.push(new Ripple({
			array: this.ripples,
			group: this.particleGroup,
			x: x,
			y: -0.1,
			z: z
		}, this, this.loader));
	}

	updateRipples() {
		let i = this.ripples.length;
		while(i--) {
			this.ripples[i].update(i);
		}
	}

	replay() {
		super.replay();
		this.reset();
	}

	update() {
		super.update();

		if(this.tick % this.dropTick === 0) {
			this.createDrop();
			this.dropTick = this.calc.randInt(this.dropTickMin, this.dropTickMax);
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
				influence.setZ(0);
				particle.velocity.add(influence);
			}
		}

		this.particleGroup.rotation.x = Math.cos(this.loader.elapsedMs * 0.0005) * 0.1;
		this.particleGroup.rotation.y = Math.PI * 0.25 + Math.sin(this.loader.elapsedMs * 0.0005) * -0.2;

		if(this.exiting && !this.loader.isOrbit && !this.loader.isGrid) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProg, 0, 1, 1) * this.loader.cameraBaseZ;
			this.loader.camera.lookAt(new THREE.Vector3());
		}

		this.tick++;
	}

}

module.exports = System;
