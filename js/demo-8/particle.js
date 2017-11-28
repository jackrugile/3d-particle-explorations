const ParticleBase = require('../particle-base');

class Particle extends ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.origin = new THREE.Vector3(config.x, config.y, config.z);
		this.position = new THREE.Vector3(config.x, config.y, config.z);

		this.life = 2;
		this.decay = this.calc.rand(0.02, 0.06);
	}

	createMesh() {
		this.geometry = new THREE.SphereBufferGeometry(1, 6, 6);

		this.material = new THREE.MeshBasicMaterial({
			//blending: THREE.AdditiveBlending,
			color: this.color,
			transparent: true,
			opacity: this.opacity,
			depthTest: false,
			precision: 'lowp'
		});

		this.mesh = new THREE.Mesh(this.geometry, this.material);

		this.mesh.position.x = this.x;
		this.mesh.position.y = this.y;
		this.mesh.position.z = this.z;

		this.mesh.scale.set(this.size, this.size, this.size);

		this.group.add(this.mesh);
	}

	update() {
		let mult = 0.2;
		
		let multX = this.position.x * mult;
		let multY = this.position.y * mult;
		let multZ = this.position.z * mult;

		let noiseVel = 0.2;
		let noiseTime = this.loader.elapsedMs * 0.0008;

		let noise1 = this.system.simplex.noise4D(
			multX,
			multY,
			multZ,
			noiseTime
		);
		let noise2 = this.system.simplex.noise4D(
			multX + 100,
			multY + 100,
			multZ + 100,
			50 + noiseTime
		);
		let noise3 = this.system.simplex.noise4D(
			multX + 200,
			multY + 200,
			multZ + 200,
			100 + noiseTime
		);

		this.position.x += Math.sin(noise1 * Math.PI * 2) * noiseVel;
		this.position.y += Math.sin(noise2 * Math.PI * 2) * noiseVel;
		this.position.z += Math.sin(noise3 * Math.PI * 2) * noiseVel;

		if(this.life > 0 ) {
			this.life -= this.decay;
		} else {
			this.life = 2;
			this.position.x = this.calc.rand(-this.system.size / 2, this.system.size / 2);
			this.position.y = this.calc.rand(-this.system.size / 2, this.system.size / 2);
			this.position.z = this.calc.rand(-this.system.size / 2, this.system.size / 2);
		}

		this.mesh.material.opacity = this.life > 1 ? 2 - this.life : this.life;

		this.mesh.position.x = this.position.x;
		this.mesh.position.y = this.position.y;
		this.mesh.position.z = this.position.z;
	}

}

module.exports = Particle;
