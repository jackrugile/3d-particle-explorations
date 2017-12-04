const ParticleBase = require('../particle-base');
const Osc = require('../utils/osc');

class Particle extends ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.xBase = config.x;
		this.yBase = config.y;

		this.xLast = config.x;
		this.yLast = config.y;

		this.order = config.order;
		this.alternate = config.alternate;
		this.offset = config.offset;

		this.reset();
	}

	reset() {
		super.reset();
		this.osc = new Osc(this.order * 0.5 + this.offset, 0.015, true, false);
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
		this.osc.update(1);

		if(this.exiting && !this.loader.isOrbit && !this.loader.isGrid) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProgress, 0, 1, 1) * this.loader.cameraBaseZ;
		}

		let val1 = this.osc.val(this.ease.inOutExpo);
		let val2 = (Math.abs(this.yLast - this.mesh.position.y) * 3) * this.loader.deltaTimeNormal;
		let val3 = (Math.abs(this.yLast - this.mesh.position.y) / 4) * this.loader.deltaTimeNormal;

		if(this.alternate) {
			val2 = (Math.abs(this.xLast - this.mesh.position.x) * 3) * this.loader.deltaTimeNormal;
			val3 = (Math.abs(this.xLast - this.mesh.position.x) / 4) * this.loader.deltaTimeNormal;
		}

		this.xLast = this.mesh.position.x;
		this.yLast = this.mesh.position.y;

		if(this.alternate) {
			this.mesh.position.x = this.calc.map(val1, 0, 1, this.xBase - this.system.spread / 2, this.xBase + this.system.spread / 2);
			this.mesh.scale.set(this.size + val2, this.size - val3, this.size);
		} else {
			this.mesh.position.y = this.calc.map(val1, 0, 1, this.yBase - this.system.spread / 2, this.yBase + this.system.spread / 2);
			this.mesh.scale.set(this.size - val3, this.size + val2, this.size);
		}
	}

}

module.exports = Particle;
