const ParticleBase = require('../particle-base');
const Osc = require('../utils/osc');

class Particle extends ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.sizeBase = config.size;
		this.delay = config.delay;
		this.opacityBase = config.opacity;

		this.osc1 = new Osc(0, 0.04, true, false);
		this.osc2 = new Osc(0, 0.05, true, false);

		this.reset();
	}

	reset() {
		super.reset();
		this.size = 0.0001;
		this.opacity = this.opacityBase;
		this.elapsedMilliseconds = 0;
		this.initiated = true;
		this.active = false;
		this.dying = false;
		this.mesh.position.x = 0;
		this.mesh.position.y = 0;
		this.mesh.position.z = 0;
		this.growthComplete = false;
		this.osc1.reset();
		this.osc2.reset();
		this.resetFlag = false;
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
			if(!this.growthComplete) {
				this.osc1.update(this.loader.deltaTimeNormal);
			}
			if(this.osc1.triggerTop) {
				this.growthComplete = true;
			}
			this.size = this.calc.map(this.osc1.val(this.ease.inOutExpo), 0, 1, 0.0001, this.sizeBase);
			this.mesh.position.z = this.calc.map(this.osc1.val(this.ease.inOutExpo), 0, 1, -10, this.z);
		}

		if(!this.dying && this.elapsedMilliseconds > 1500 + this.delay * 2) {
			this.dying = true;
		}

		if(this.dying && !this.resetFlag) {
			this.osc2.update(this.loader.deltaTimeNormal);
			this.size = this.calc.map(this.osc2.val(this.ease.inExpo), 0, 1, this.sizeBase, 0.01);
			this.mesh.position.z = this.calc.map(this.osc2.val(this.ease.inExpo), 0, 1, this.z, this.z + 15);
			this.opacity = this.calc.map(this.osc2.val(this.ease.inExpo), 0, 1, this.opacityBase, 0);
			if(this.osc2.triggerTop) {
				this.opacity = 0;
				this.size = 0.01;
				this.mesh.position.z = this.z + 15;
				this.resetFlag = true;
			}
		}

		this.mesh.material.opacity = this.opacity;
		this.mesh.scale.set(this.size, this.size, this.size);
	}

}

module.exports = Particle;
