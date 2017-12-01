const ParticleBase = require('../particle-base');
const Osc = require('../utils/osc');

class Particle extends ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.radius = config.radius;
		this.prog = config.prog;
		this.alt = config.alt;
		this.opacityBase = config.opacity;
		this.reset();
	}

	reset() {
		this.osc = new Osc(this.prog, 0.015, true, false);
	}

	update() {
		this.osc.update(1);

		let angle = this.calc.map(this.prog, 0, 1, -Math.cos(this.loader.elapsedMs * 0.0015) * (Math.PI * 1.5), Math.sin(this.loader.elapsedMs * 0.0015) * (Math.PI * 1.5));
		angle += this.alt ? Math.PI : 0;
		let x = Math.cos(angle) * this.radius;
		let y = this.calc.map(this.prog, 0, 1, -this.system.height , this.system.height);
		let z = Math.sin(angle) * this.radius;

		this.mesh.position.x = x;
		this.mesh.position.y = y;
		this.mesh.position.z = z;

		let scale = 0.1 + (this.osc.val(this.ease.inOutExpo)) * 0.2;
		if(this.alt) {
			scale = 0.1 + (1 - this.osc.val(this.ease.inOutExpo)) * 0.2;
		}
		this.mesh.scale.set(scale, scale, scale);
	}

}

module.exports = Particle;
