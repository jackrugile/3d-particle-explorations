const SystemBase = require('../system-base');
const Particle = require('./particle');

class System extends SystemBase {

	constructor(loader) {
		super(loader);

		this.count = 1200;
		this.size = 10;
		this.center = new THREE.Vector3();

		for(let i = 0; i < this.count; i++) {
			let x = this.calc.rand(-this.size / 2, this.size / 2);
			let y = this.calc.rand(-this.size / 2, this.size / 2);
			let z = this.calc.rand(-this.size / 2, this.size / 2);
			let pos = new THREE.Vector3(x, y, z);
			let color = 0x333333;
			let size = 0.3;
			let opacity = 1;
			if(pos.distanceTo(this.center) > this.size / 2) {
				continue;
			}

			this.particles.push(new Particle({
				group: this.particleGroup,
				x: x,
				y: y,
				z: z,
				size: size,
				color: color,
				opacity: opacity
			}, this, this.loader));
		}

		this.wanderer = {
			position: new THREE.Vector3(),
			size: 1,
			color: 0xffffff,
			opacity: 1
		};
		this.geometry = new THREE.SphereBufferGeometry(1, 12, 12);
		this.material = new THREE.MeshBasicMaterial({
			color: this.wanderer.color,
			transparent: true,
			opacity: this.wanderer.opacity,
			depthTest: false,
			precision: 'lowp',
			side: THREE.DoubleSide
		});
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.x = this.wanderer.position.x;
		this.mesh.position.y = this.wanderer.position.y;
		this.mesh.position.z = this.wanderer.position.z;
		this.mesh.scale.set(this.wanderer.size, this.wanderer.size, this.wanderer.size);
		this.particleGroup.add(this.mesh);
	}

	update() {
		super.update();

		this.wanderer.position.x = Math.cos(this.loader.elapsedMs * 0.0025) * this.size / -2;
		this.wanderer.position.y = Math.sin(this.loader.elapsedMs * 0.0025) * this.size / 2;
		this.wanderer.position.z = Math.sin(this.loader.elapsedMs * 0.0013) * this.size / 2;

		this.mesh.position.x = this.wanderer.position.x;
		this.mesh.position.y = this.wanderer.position.y;
		this.mesh.position.z = this.wanderer.position.z;
	}

}

module.exports = System;
