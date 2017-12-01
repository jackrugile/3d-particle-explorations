const ParticleBase = require('../particle-base');
const Osc = require('../utils/osc');

class Particle extends ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.baseX = config.x;
		this.baseY = config.y;
		this.baseZ = config.z;

		this.lastX = config.x;
		this.lastY = config.y;
		this.lastZ = config.z;

		this.prog = config.prog;
		this.alt = config.alt;
		this.offset = config.offset;

		this.osc = new Osc(this.prog * 0.5 + this.offset, 0.015, true, false);
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
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProg, 0, 1, 1) * this.loader.cameraBaseZ;
		}

		let val1 = this.osc.val(this.ease.inOutExpo);
		let val2 = (Math.abs(this.lastY - this.mesh.position.y) * 3) * this.loader.dtN;
		let val3 = (Math.abs(this.lastY - this.mesh.position.y) / 4) * this.loader.dtN;

		if(this.alt) {
			val1 = this.osc.val(this.ease.inOutExpo);
			val2 = (Math.abs(this.lastX - this.mesh.position.x) * 3) * this.loader.dtN;
			val3 = (Math.abs(this.lastX - this.mesh.position.x) / 4) * this.loader.dtN;
		}

		this.lastX = this.mesh.position.x;
		this.lastY = this.mesh.position.y;
		this.lastZ = this.mesh.position.z;

		if(this.alt) {
			this.mesh.position.x = this.calc.map(val1, 0, 1, this.baseX - this.system.spread / 2, this.baseX + this.system.spread / 2);
			this.mesh.scale.set(this.size + val2, this.size - val3, this.size);
		} else {
			this.mesh.position.y = this.calc.map(val1, 0, 1, this.baseY - this.system.spread / 2, this.baseY + this.system.spread / 2);
			this.mesh.scale.set(this.size - val3, this.size + val2, this.size);
		}
	}

}

module.exports = Particle;
