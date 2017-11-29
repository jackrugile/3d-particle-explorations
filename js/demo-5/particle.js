const ParticleBase = require('../particle-base');

class Particle extends ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.baseX = config.x;
		this.baseY = config.y;
		this.baseZ = config.z;
		this.base = new THREE.Vector3(config.x, config.y, config.z);

		this.lerpFactor = 0.25;
		this.dampFactor = 0.25;

		this.velocity = new THREE.Vector3(0, 0, 0);
	}

	update() {
		//let mult = 0.075;
		//let noise = this.system.simplex.noise3D(this.baseX * mult, this.baseY * mult, this.loader.elapsedMs * 0.0004);
		// let offset = noise * 5;

		// this.mesh.position.z = this.baseZ + offset;

		let scale = 0.05 + (Math.abs(this.velocity.z) / 25)
		this.mesh.scale.set(scale, scale, scale);

		let opacity = 0.1 + (Math.abs(this.velocity.z) / 3)
		this.mesh.material.opacity = this.calc.clamp(opacity, 0.1, 1);

		this.velocity.x += (this.base.x - this.mesh.position.x) * this.lerpFactor;
		this.velocity.y += (this.base.y - this.mesh.position.y) * this.lerpFactor;
		this.velocity.z += (this.base.z - this.mesh.position.z) * this.lerpFactor;
		this.velocity.multiplyScalar(this.dampFactor);
		this.mesh.position.add(this.velocity);
	}

}

module.exports = Particle;
