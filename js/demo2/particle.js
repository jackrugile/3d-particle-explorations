PL.Particle = class {

	constructor(config, system, loader) {
		this.system = system;
		this.loader = loader;
		this.calc = new PL.Calc();
		this.group = config.group;

		this.color = config.color;
		this.size = config.size;

		this.geometry = new THREE.SphereBufferGeometry(1, 12, 12);
		this.material = new THREE.MeshBasicMaterial({
			color: this.color,
			transparent: true,
			opacity: ((this.system.visW / 2) - Math.abs(config.x)) / (this.system.visW / 2),
			//opacity: 0,
			depthTest: false,
			precision: 'lowp'
		});
		this.geometry = this.geometry;
		this.material = this.material;
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.x = config.x;
		this.mesh.position.y = config.y;
		this.mesh.position.z = config.z;
		this.mesh.scale.set(this.size, this.size, this.size);
		this.group.add(this.mesh);
	}

	update() {
		//let div = 0.06 + Math.sin(this.loader.elapsedMs / 500) * 0.04;
		let div = 0.15;
		//div *= this.system.progEased
		let amp = ((this.system.visW / 2) - Math.abs(this.mesh.position.x)) / (this.system.visW / 2);
		amp *= this.system.progEased;
		let speed = this.loader.elapsedMs / 1000;
		//speed += this.system.progEased * 100;

		this.mesh.position.y = this.system.simplex.noise2D(this.mesh.position.x * div + speed, 0) * 10 * amp;
	}

}
