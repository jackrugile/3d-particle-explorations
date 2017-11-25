PL.Particle = class {

	constructor(config, system, loader) {
		this.system = system;
		this.loader = loader;
		this.calc = new PL.Calc();
		this.group = config.group;

		this.size = config.size;
		this.radius = config.radius;
		this.prog = config.prog;
		this.alt = config.alt;
		this.opacity = config.opacity;
		this.opacityBase = config.opacity;

		this.geometry = new THREE.SphereBufferGeometry(1, 12, 12);
		this.material = new THREE.MeshBasicMaterial({
			color: config.color,
			transparent: true,
			opacity: config.opacity,
			precision: 'lowp'
		});
		this.geometry = this.geometry;
		this.material = this.material;
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.scale.set(this.size, this.size, this.size);
		this.group.add(this.mesh);
	}

	update() {
		//this.radius = 2 + Math.cos(this.loader.elapsedMs * 0.002) * 2
		let angle = this.calc.map(this.prog, 0, 1, -Math.cos(this.loader.elapsedMs * 0.0015) * (Math.PI * 1.5), Math.sin(this.loader.elapsedMs * 0.0015) * (Math.PI * 1.5));
		angle += this.alt ? Math.PI : 0;
		let x = Math.cos(angle) * this.radius;
		let y = this.calc.map(this.prog, 0, 1, -this.system.height , this.system.height);
		let z = Math.sin(angle) * this.radius;

		this.mesh.position.x = x;
		this.mesh.position.y = y;
		this.mesh.position.z = z;

		//this.mesh.position.y -= 0.1;
		//if(this.mesh.position.y < -15) {
			//this.mesh.position.y += 30;
		//}

		//let prog = 1 - Math.abs(this.mesh.position.y) / 15;
		//this.material.opacity = this.opacityBase * prog;
	}

}
