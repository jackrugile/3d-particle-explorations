const ParticleBase = require('../particle-base');

class Particle extends ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.alternate = config.alternate;
		this.noiseScale = 0.15
		this.amplitude = 0;
		this.speed = 0;
	}

	update() {
		if(this.alternate) {
			this.amplitude = ((this.system.size / 2) - Math.abs(this.mesh.position.x)) / (this.system.size / 2);
			this.amplitude *= this.system.osc1Eased;
			this.speed = this.loader.elapsedMilliseconds / 750;
			this.mesh.position.y = this.system.simplex.getRaw2DNoise(this.mesh.position.x * this.noiseScale + this.speed, 0) * 10 * this.amplitude;
		} else {
			this.amplitude = ((this.system.size / 2) - Math.abs(this.mesh.position.x)) / (this.system.size / 2);
			this.amplitude *= 1 - this.system.osc1Eased;
			this.speed = this.loader.elapsedMilliseconds / 750;
			this.mesh.position.y = this.system.simplex.getRaw2DNoise(this.mesh.position.x * this.noiseScale + this.speed + 1000, 1000) * 10 * this.amplitude;
		}

		let size = 0.05 + this.size * this.amplitude;
		this.mesh.material.opacity = 0.1 + this.amplitude * 0.9;
		size = 0.05 + 0.1 * this.amplitude;
		this.mesh.scale.set(size, size, size);

		this.mesh.position.z = this.alternate ? 0.05 + 10 * this.amplitude : -(0.05 + 10 * this.amplitude);
	}

}

module.exports = Particle;
