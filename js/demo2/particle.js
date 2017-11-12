PL.Particle = function(config, system, loader) {

	this.system = system;
	this.loader = loader;
	this.calc = new PL.Calc();
	this.group = config.group;

	this.size = this.calc.rand(0.2, 0.8);

	this.geometry = new THREE.SphereBufferGeometry(1, 12, 12);
	this.material = new THREE.MeshBasicMaterial({
		//blending: THREE.AdditiveBlending,
		color: 0xffffff,
		transparent: true,
		opacity: ((this.system.visW / 2) - Math.abs(config.x)) / (this.system.visW / 2),
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

	this.update = function() {
		// centered
		let div = 0.04 + Math.sin(this.loader.elapsed * 2) * 0.04;
		let amp = ((this.system.visW / 2) - Math.abs(this.mesh.position.x)) / (this.system.visW / 2);
		this.mesh.position.y = this.system.simplex.noise2D(this.mesh.position.x * div, this.loader.elapsed * 0.5) * 20 * amp;

		// left lock
		// let div = 0.04 + Math.sin(this.loader.elapsed * 3) * 0.04;
		// let amp = (this.mesh.position.x + this.system.visW / 2) / this.system.visW;
		// this.mesh.position.y = this.system.simplex.noise2D((this.mesh.position.x + this.system.visW / 2 )* div, this.loader.elapsed * 1.5) * 100 * amp;
	}

}
