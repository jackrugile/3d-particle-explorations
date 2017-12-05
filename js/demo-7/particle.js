const ParticleBase = require('../particle-base');
const Osc = require('../utils/osc');

class Particle extends ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.xBase = config.x;
		this.yBase = config.y;

		this.order = config.order;
		this.alternate = config.alternate;
		this.offset = config.offset;

		this.osc1 = new Osc(this.order * 0.5 + this.offset, 0.015, true, false);
		this.osc2 = new Osc(this.order * 0.5 + this.offset + 0.5, 0.03, true, false);

		this.reset();
	}

	reset() {
		super.reset();
		this.osc1.reset();
		this.osc2.reset();
	}

	createMesh() {
		this.geometry = this.system.boxGeometry;

		this.material = new THREE.MeshBasicMaterial({
			blending: THREE.AdditiveBlending,
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
		this.osc1.update(this.loader.timescale);
		this.osc2.update(this.loader.timescale);

		let val1 = this.osc1.val(this.ease.inOutExpo);
		let val2 = this.calc.map(this.osc2.val(this.ease.inOutExpo), 0, 1, this.size, this.size * 8);
		let val3 = this.calc.map(this.osc2.val(this.ease.inOutExpo), 0, 1, this.size, this.size * 0.4);

		if(this.alternate) {
			this.mesh.position.x = this.calc.map(val1, 0, 1, this.xBase - this.system.spread / 2, this.xBase + this.system.spread / 2);
			this.mesh.scale.set(val2, val3, this.size);
		} else {
			this.mesh.position.y = this.calc.map(val1, 0, 1, this.yBase - this.system.spread / 2, this.yBase + this.system.spread / 2);
			this.mesh.scale.set(val3, val2, this.size);
		}
	}

}

module.exports = Particle;
