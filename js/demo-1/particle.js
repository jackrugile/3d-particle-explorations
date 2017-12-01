const ParticleBase = require('../particle-base');

class Particle extends ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.baseAngle = config.angle;
		this.baseX = config.x;
		this.baseY = config.y;
		this.baseZ = config.z;
		this.baseRadius = config.radius;
		this.baseSize = config.size;
		this.angle = this.baseAngle;
	}

	update() {
		this.angle -= (Math.cos(this.loader.elapsedMs * 0.0025 - this.baseRadius * 0.15) * 0.02) * this.loader.dtN;

		this.mesh.position.x = Math.cos(this.angle) * this.baseRadius;
		this.mesh.position.y = Math.sin(this.angle) * this.baseRadius;
		this.mesh.position.z = Math.cos(this.loader.elapsedMs * 0.005 - this.baseRadius * 0.3) * 10;

		let freeScale = Math.cos(this.loader.elapsedMs * 0.005 - this.baseRadius * 0.6);
		let lockScale = this.calc.clamp(freeScale, 0, 1);
		let scale = this.baseSize + lockScale * 0.2;
		this.mesh.scale.set(scale, scale, scale);
	}

}

module.exports = Particle;
