PL.Particle = function(config, system, loader) {

	this.system = system;
	this.loader = loader;
	this.calc = new PL.Calc();
	this.group = config.group;

	this.size = 0;
	this.sizeTarget = config.size;

	this.geometry = new THREE.SphereBufferGeometry(1, 12, 12);
	this.material = new THREE.MeshBasicMaterial({
		blending: THREE.AdditiveBlending,
		color: Math.random() > 0.5 ? 0xffffcc : 0xffccff,
		transparent: true,
		opacity: this.calc.rand(0.1, 0.5),
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
		this.size = this.calc.lerp(this.size, this.sizeTarget, 0.01);
		this.mesh.scale.set(this.size, this.size, this.size);
	}

}
