const ParticleBase = require('../particle-base');

class Particle extends ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.baseX = config.x;
		this.baseY = config.y;
		this.baseZ = config.z;
		this.dummyVec = new THREE.Vector3();
		this.velocity = new THREE.Vector3();
	}

	update() {
		this.thresh = 5;
		this.distance = this.mesh.position.distanceTo(this.system.wanderer.position);

		this.scale = this.calc.map(this.distance, 0, this.thresh, this.size, 0.1);
		this.scale = this.calc.clamp(this.scale, 0.1, this.size);
		this.mesh.scale.set(this.scale, this.scale, this.scale);

		this.opacity = this.calc.map(this.distance, 0, this.thresh, 1, 0.15);
		this.opacity = this.calc.clamp(this.opacity, 0.15, 1);
		this.mesh.material.opacity = this.opacity;

		// this.pull = this.calc.map(this.distance, 0, this.thresh, 0.1, 0);
		// this.pull = this.calc.clamp(this.pull, 0, 0.1);
		// this.velocity.x += this.baseX + (this.system.wanderer.position.x - this.baseX) * this.pull;
		// this.velocity.y += this.baseY + (this.system.wanderer.position.y - this.baseY) * this.pull;
		// this.velocity.z += this.baseZ + (this.system.wanderer.position.z - this.baseZ) * this.pull;

		if(this.distance <= this.thresh) {
			this.velocity.x += (this.baseX - this.system.wanderer.position.x) * 0.25;
			this.velocity.y += (this.baseY - this.system.wanderer.position.y) * 0.25;
			this.velocity.z += (this.baseZ - this.system.wanderer.position.z) * 0.25;
		} else {
			this.velocity.x += (this.baseX - this.mesh.position.x) * 0.25;
			this.velocity.y += (this.baseY - this.mesh.position.y) * 0.25;
			this.velocity.z += (this.baseZ - this.mesh.position.z) * 0.25;
		}
		this.velocity.multiplyScalar(0.25);

		this.mesh.position.add(this.velocity);

		// this.velocity.x += (this.origin.x - this.position.x) * this.lerpFactor;
		// this.velocity.y += (this.origin.y - this.position.y) * this.lerpFactor;
		// this.velocity.z += (this.origin.z - this.position.z) * this.lerpFactor;
		// this.velocity.multiplyScalar(this.dampFactor);
		// OU.threeVec3.copy(this.velocity).multiplyScalar(OU.delta);
		// this.position.add(OU.threeVec3);
	}

}

module.exports = Particle;
