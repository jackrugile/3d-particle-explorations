const ParticleBase = require('../particle-base');

class Particle extends ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.alt = config.alt;

		this.div = 0.15
		this.amp = 0;
		this.speed = 0;
	}

	update() {
		if(this.alt) {
			this.amp = ((this.system.visW / 2) - Math.abs(this.mesh.position.x)) / (this.system.visW / 2);
			this.amp *= this.system.oscEased;
			this.speed = this.loader.elapsedMs / 750;
			this.mesh.position.y = this.system.simplex.noise2D(this.mesh.position.x * this.div + this.speed, 0) * 10 * this.amp;
		} else {
			this.amp = ((this.system.visW / 2) - Math.abs(this.mesh.position.x)) / (this.system.visW / 2);
			this.amp *= 1 - this.system.oscEased;
			this.speed = this.loader.elapsedMs / 750;
			this.mesh.position.y = this.system.simplex.noise2D(this.mesh.position.x * this.div + this.speed + 1000, 1000) * 10 * this.amp;
		}

		let size = 0.05 + this.size * this.amp;
		this.mesh.material.opacity = 0.1 + this.amp * 0.9;
		this.mesh.scale.set(size, size, size);
	}

}

module.exports = Particle;
