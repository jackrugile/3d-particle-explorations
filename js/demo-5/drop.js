class Drop {

	constructor(config, system, loader) {
		this.system = system;
		this.loader = loader;

		this.calc = this.loader.calc;
		this.ease = this.loader.ease;

		this.array = config.array;
		this.group = config.group;
		this.x = config.x;
		this.y = config.y;
		this.z = config.z;
		this.size = config.size;
		this.color = config.color;
		this.opacity = config.opacity;

		this.baseX = config.x;
		this.baseY = config.y;
		this.baseZ = config.z;

		this.prog = 0;
		this.rate = 0.015;

		this.createMesh();
	}

	createMesh() {
		this.geometry = new THREE.BoxBufferGeometry(1, 1, 1);

		this.material = new THREE.MeshBasicMaterial({
			color: this.color,
			transparent: true,
			opacity: this.opacity,
			depthTest: false,
			precision: 'lowp',
			side: THREE.DoubleSide
		});

		this.mesh = new THREE.Mesh(this.geometry, this.material);

		this.mesh.position.x = this.x;
		this.mesh.position.y = this.y;
		this.mesh.position.z = this.z;

		this.mesh.scale.set(this.size, this.size, this.size);

		this.group.add(this.mesh);
	}

	update(i) {
		// ease
		this.prog += this.rate;
		this.mesh.position.y = this.baseY - this.ease.inExpo(this.prog, 0, 1, 1) * this.baseY;
		this.mesh.scale.set(this.size, this.size + this.size * 16 * this.ease.inExpo(this.prog, 0, 1, 1), this.size);
		this.mesh.material.opacity = this.ease.inExpo(this.prog, 0, 1, 1);

		if(this.prog > 1) {
			this.array.splice(i, 1);
			this.group.remove(this.mesh);
			this.system.createRipple(this.mesh.position.x, this.mesh.position.z);
		}
	}

}

module.exports = Drop;
