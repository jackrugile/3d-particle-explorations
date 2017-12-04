class ParticleBase {

	constructor(config, system, loader) {
		this.system = system;
		this.loader = loader;

		this.calc = this.loader.calc;
		this.ease = this.loader.ease;

		this.group = config.group;
		this.x = config.x;
		this.y = config.y;
		this.z = config.z;
		this.size = config.size;
		this.color = config.color;
		this.opacity = config.opacity;

		this.createMesh();
	}

	createMesh() {
		this.geometry = this.system.sphereGeometry;

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

	reset() {}

}

module.exports = ParticleBase;
