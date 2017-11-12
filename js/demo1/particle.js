PL.Particle = function(config, system, loader) {

	this.system = system;
	this.loader = loader;

	this.calc = new PL.Calc();

	this.group = config.group;

	this.baseAngle = config.angle;
	this.baseX = config.x;
	this.baseY = config.y;
	this.baseZ = config.z;
	this.baseRadius = config.radius;

	this.angle = this.baseAngle;

	this.geometry = new THREE.SphereBufferGeometry(1, 12, 12);
	this.material = new THREE.MeshBasicMaterial({
		//blending: THREE.AdditiveBlending,
		color: 0xffffff,
		transparent: true,
		opacity: this.calc.rand(0.2, 1),
		depthTest: false,
		precision: 'lowp'
	});
	this.geometry = this.geometry;
	this.material = this.material;
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.position.x = config.x;
	this.mesh.position.y = config.y;
	this.mesh.position.z = config.z;
	this.mesh.scale.set(config.size, config.size, config.size);
	this.group.add(this.mesh);

	this.update = function() {
		this.angle -= 0.001 + this.loader.dtn * 0.0003 * (60 - this.baseRadius);

		//this.mesh.position.z = Math.sin(this.loader.elapsedMs * 0.002) * this.baseZ;
		this.mesh.position.x = Math.cos(this.angle) * this.baseRadius;
		this.mesh.position.y = Math.sin(this.angle) * this.baseRadius;
	}

}
