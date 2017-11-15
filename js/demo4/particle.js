PL.Particle = function(config, system, loader) {

	this.system = system;
	this.loader = loader;
	this.calc = new PL.Calc();
	this.group = config.group;

	this.size = config.size;
	this.radius = config.size;
	this.angle = config.angle;
	this.opacity = config.opacity;
	this.opacityBase = config.opacity;

	this.geometry = new THREE.SphereBufferGeometry(1, 12, 12);
	this.material = new THREE.MeshBasicMaterial({
		blending: THREE.AdditiveBlending,
		color: config.color,
		transparent: true,
		opacity: config.opacity,
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
		this.mesh.position.y -= 0.1;
		if(this.mesh.position.y < -15) {
			this.mesh.position.y += 30;
		}


		let prog = 1 - Math.abs(this.mesh.position.y) / 15;
		this.material.opacity = this.opacityBase * prog;
	}

}
