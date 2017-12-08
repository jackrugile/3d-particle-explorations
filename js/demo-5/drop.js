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
		this.strength = config.strength;

		this.yBase = config.y;

		this.progress = 0;
		this.rate = 0.015;

		this.createMesh();
	}

	createMesh() {
		this.geometry = this.system.boxGeometry;

		this.material = new THREE.MeshBasicMaterial({
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

	update(i) {
		this.progress += this.rate * this.loader.deltaTimeNormal;
		this.mesh.position.y = this.yBase - this.ease.inExpo(this.progress, 0, 1, 1) * this.yBase;
		this.mesh.scale.set(this.size, this.size + this.size * 16 * this.ease.inExpo(this.progress, 0, 1, 1), this.size);
		this.mesh.material.opacity = this.ease.inExpo(this.progress, 0, 1, 1);

		if(this.progress >= 1) {
			this.geometry.dispose();
			this.material.dispose();
			this.group.remove(this.mesh);
			this.array.splice(i, 1);
			this.system.createRipple(this.mesh.position.x, this.mesh.position.z, this.strength);
		}
	}

}

module.exports = Drop;
