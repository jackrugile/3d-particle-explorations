const SystemBase = require('../system-base');
const Particle = require('./particle');

class System extends SystemBase {

	constructor(loader) {
		super(loader);

		this.duration = 6000;
		this.rings = 8;
		this.radius = 0;
		this.radiusGrowth = 1.5;

		for(let i = 0; i < this.rings; i++) {
			let count = i === 0 ? 1 : 1 + Math.ceil(i * 6);

			for(let j = 0; j < count; j++) {
				let angle = (j / count) * Math.PI * 2;
				let x = Math.cos(angle) * this.radius;
				let y = Math.sin(angle) * this.radius;
				let z = 0;
				let size = this.calc.map(i, 0, this.rings, 0.2, 0.05);

				this.particles.push(new Particle({
					group: this.particleGroup,
					x: x,
					y: y,
					z: z,
					size: size,
					radius: this.radius,
					angle: angle,
					color: 0xffffff,
					opacity: 1
				}, this, this.loader));
			}

			this.radius += this.radiusGrowth;
		}
	}

	update() {
		super.update();

		if(this.exiting && !this.loader.isOrbit && !this.loader.isGrid && !this.loader.isGrid) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProgress, 0, 1, 1) * this.loader.cameraBaseZ;
		}
	}

}

module.exports = System;
