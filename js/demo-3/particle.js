const ParticleBase = require('../particle-base');

class Particle extends ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.size = 0.0001;
		this.sizeTarget = config.size;
		this.sizeBase = config.size;

		this.delay = config.delay;
		this.elapsedMilliseconds = 0;
		this.initiated = true;
		this.active = false;
		this.dying = false;
	}

	reset() {
		super.reset();
		this.size = 0.0001;
		this.elapsedMilliseconds = 0;
		this.initiated = true;
		this.active = false;
		this.dying = false;
	}

	update() {
		if(this.initiated) {
			this.elapsedMilliseconds += this.loader.deltaTimeMilliseconds;
		}

		if(!this.active && this.elapsedMilliseconds > 400 + this.delay * 5) {
			this.mesh.position.x = 0;
			this.mesh.position.y = 0;
			this.mesh.position.z = 0;
			this.active = true;
		}

		if(this.active && !this.dying) {
			this.size = this.calc.lerp(this.size, this.sizeTarget, 0.1);
			this.mesh.position.z = this.calc.map(this.size / this.sizeTarget, 0, 1, -10, this.z);
		}

		if(!this.dying && this.elapsedMilliseconds > 1500 + this.delay * 4) {
			this.dying = true;
		}

		if(this.dying) {
			this.size *= 0.85;
			this.mesh.position.z *= 1.2;
			this.mesh.material.opacity = this.size / this.sizeBase;
			if(this.size < 0.1) {
				this.dying = false;
				this.active = false;
				this.elapsedMilliseconds = 0;
				this.initiated = false;
				this.mesh.position.x = 0;
				this.mesh.position.y = 0;
				this.mesh.position.z = 0;
				this.size = 0.0001;
				this.sizeTarget = this.sizeBase;
				this.mesh.material.opacity = this.calc.rand(0.1, 1);
			}
		}

		this.mesh.scale.set(this.size, this.size, this.size);
	}

}

module.exports = Particle;
