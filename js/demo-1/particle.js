const ParticleBase = require('../particle-base');

class Particle extends ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.angle = config.angle;
		this.radiusBase = config.radius;
		this.sizeBase = config.size;
	}

	update() {
		this.angle -= (Math.cos(this.loader.elapsedMilliseconds * 0.0025 - this.radiusBase * 0.15) * 0.02) * this.loader.deltaTimeNormal;

		this.mesh.position.x = Math.cos(this.angle) * this.radiusBase;
		this.mesh.position.y = Math.sin(this.angle) * this.radiusBase;
		this.mesh.position.z = Math.cos(this.loader.elapsedMilliseconds * 0.005 - this.radiusBase * 0.3) * 10;

		let freeScale = Math.cos(this.loader.elapsedMilliseconds * 0.005 - this.radiusBase * 0.6);
		let lockScale = this.calc.clamp(freeScale, 0, 1);
		let scale = this.sizeBase + lockScale * 0.2;
		this.mesh.scale.set(scale, scale, scale);
	}

}

module.exports = Particle;
