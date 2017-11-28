const ParticleBase = require('../particle-base');

class Particle extends ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.baseX = config.x;
		this.baseY = config.y;
		this.baseZ = config.z;
	}

	update() {
		let mult = 0.075;
		let offset = this.system.simplex.noise3D(this.baseX * mult, this.baseY * mult, this.loader.elapsedMs * 0.0004) * 5;

		this.mesh.position.z = this.baseZ + offset;
	}

}

module.exports = Particle;
