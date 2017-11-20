PL.Particle = class {

	constructor(config, system, loader) {
		this.system = system;
		this.loader = loader;

		this.calc = new PL.Calc();

		this.group = config.group;

		this.baseAngle = config.angle;
		this.baseX = config.x;
		this.baseY = config.y;
		this.baseZ = config.z;
		this.baseRadius = config.radius;
		this.baseSize = config.size;

		this.color = config.color;
		this.angle = this.baseAngle;

		this.geometry = new THREE.SphereBufferGeometry(1, 12, 12);
		this.material = new THREE.MeshBasicMaterial({
			color: this.color,
			transparent: true,
			opacity: 1,
			depthTest: false,
			precision: 'lowp',
			side: THREE.DoubleSide
		});
		this.geometry = this.geometry;
		this.material = this.material;
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.x = config.x;
		this.mesh.position.y = config.y;
		this.mesh.position.z = config.z;
		this.mesh.scale.set(config.size, config.size, config.size);
		this.group.add(this.mesh);
	}

	update() {
		this.angle -= this.loader.dtN * Math.cos(this.loader.elapsedMs * 0.0025 - this.baseRadius * 0.15) * 0.02;

		this.mesh.position.x = Math.cos(this.angle) * this.baseRadius;
		this.mesh.position.y = Math.sin(this.angle) * this.baseRadius;

		let freeScale = Math.cos(this.loader.elapsedMs * 0.005 - this.baseRadius * 0.6);
		let lockScale = this.calc.clamp(freeScale, 0, 1);
		let scale = this.baseSize + lockScale * 0.15;
		this.mesh.scale.set(scale, scale, scale);
	}

}
