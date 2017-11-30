const SystemBase = require('../system-base');
const Particle = require('./particle');
const Osc = require('../utils/osc');

class System extends SystemBase {

	constructor(loader) {
		super(loader);

		this.count = 15;
		this.spread = 20;
		this.osc1 = new Osc(0, 0.015, true, false);

		this.particleGroup.rotation.z = Math.PI / 4;

		//this.particleGroup.rotation.x = 0;
		this.rotationTarget = Math.PI / 4;

		for(let i = 0; i < this.count; i++) {
			let x = this.calc.map(i, 0, this.count - 1, -this.spread / 2, this.spread / 2);
			let y = 0;
			let z = 0;
			let pos = new THREE.Vector3(x, y, z);
			let color = 0x222222;
			let size = 0.3;
			let opacity = 1;

			color = 0xff00ff;

			this.particles.push(new Particle({
				group: this.particleGroup,
				offset: 0,
				x: x,
				y: y,
				z: z,
				size: size,
				color: color,
				opacity: opacity,
				prog: i / (this.count - 1),
				alt: 0
			}, this, this.loader));

			this.particles.push(new Particle({
				group: this.particleGroup,
				offset: 0,
				x: y,
				y: x,
				z: z,
				size: size,
				color: color,
				opacity: opacity,
				prog: i / (this.count - 1),
				alt: 1
			}, this, this.loader));
		}

		for(let i = 0; i < this.count; i++) {
			let x = this.calc.map(i, 0, this.count - 1, -this.spread / 2, this.spread / 2);
			let y = 0;
			let z = 0;
			let pos = new THREE.Vector3(x, y, z);
			let color = 0x222222;
			let size = 0.3;
			let opacity = 1;

			color = 0xff0000;

			this.particles.push(new Particle({
				group: this.particleGroup,
				offset: 0.05,
				x: x,
				y: y,
				z: z,
				size: size,
				color: color,
				opacity: opacity,
				prog: i / (this.count - 1),
				alt: 0
			}, this, this.loader));

			this.particles.push(new Particle({
				group: this.particleGroup,
				offset: 0.05,
				x: y,
				y: x,
				z: z,
				size: size,
				color: color,
				opacity: opacity,
				prog: i / (this.count - 1),
				alt: 1
			}, this, this.loader));
		}

		for(let i = 0; i < this.count; i++) {
			let x = this.calc.map(i, 0, this.count - 1, -this.spread / 2, this.spread / 2);
			let y = 0;
			let z = 0;
			let pos = new THREE.Vector3(x, y, z);
			let color = 0x222222;
			let size = 0.3;
			let opacity = 1;

			color = 0x00ff00;

			this.particles.push(new Particle({
				group: this.particleGroup,
				offset: 0.1,
				x: x,
				y: y,
				z: z,
				size: size,
				color: color,
				opacity: opacity,
				prog: i / (this.count - 1),
				alt: 0
			}, this, this.loader));

			this.particles.push(new Particle({
				group: this.particleGroup,
				offset: 0.1,
				x: y,
				y: x,
				z: z,
				size: size,
				color: color,
				opacity: opacity,
				prog: i / (this.count - 1),
				alt: 1
			}, this, this.loader));
		}

		for(let i = 0; i < this.count; i++) {
			let x = this.calc.map(i, 0, this.count - 1, -this.spread / 2, this.spread / 2);
			let y = 0;
			let z = 0;
			let pos = new THREE.Vector3(x, y, z);
			let color = 0x222222;
			let size = 0.3;
			let opacity = 1;

			color = 0x0000ff;

			this.particles.push(new Particle({
				group: this.particleGroup,
				offset: 0.15,
				x: x,
				y: y,
				z: z,
				size: size,
				color: color,
				opacity: opacity,
				prog: i / (this.count - 1),
				alt: 0
			}, this, this.loader));

			this.particles.push(new Particle({
				group: this.particleGroup,
				offset: 0.15,
				x: y,
				y: x,
				z: z,
				size: size,
				color: color,
				opacity: opacity,
				prog: i / (this.count - 1),
				alt: 1
			}, this, this.loader));
		}
	}

	update() {
		super.update();

		this.osc1.update();

		if(this.osc1._triggerBot) {
			this.rotationTarget += Math.PI / -4;
		}

		this.particleGroup.rotation.z = Math.PI / 4 + Math.sin(this.loader.elapsedMs * 0.001) * Math.PI / 4

		//this.particleGroup.rotation.z += (this.rotationTarget - this.particleGroup.rotation.z) * 0.1;

		// SHOW LINES?

	}

}

module.exports = System;
