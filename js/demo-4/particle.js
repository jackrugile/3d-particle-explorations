const ParticleBase = require('../particle-base');
const Osc = require('../utils/osc');

class Particle extends ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.radius = config.radius;
		this.order = config.order;
		this.alternate = config.alternate;

		this.osc = new Osc(this.order, 0.015, true, false);

		this.reset();
	}

	reset() {
		super.reset();
		this.osc.reset();
	}

	update() {
		this.osc.update(this.loader.timescale);

		let angle = this.calc.map(this.order, 0, 1, -Math.cos(this.loader.elapsedMilliseconds * 0.0015) * (Math.PI * 1.5), Math.sin(this.loader.elapsedMilliseconds * 0.0015) * (Math.PI * 1.5));
		angle += this.alternate ? Math.PI : 0;
		let x = Math.cos(angle) * this.radius;
		let y = this.calc.map(this.order, 0, 1, -this.system.height , this.system.height);
		let z = Math.sin(angle) * this.radius;

		this.mesh.position.x = x;
		this.mesh.position.y = y;
		this.mesh.position.z = z;

		let scale = 0.1 + (this.osc.val(this.ease.inOutExpo)) * 0.2;
		if(this.alternate) {
			scale = 0.1 + (1 - this.osc.val(this.ease.inOutExpo)) * 0.2;
		}
		this.mesh.scale.set(scale, scale, scale);
	}

}

module.exports = Particle;
