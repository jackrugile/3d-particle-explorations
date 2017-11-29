class Ripple {


	constructor(config, system, loader) {
		this.system = system;
		this.loader = loader;

		this.calc = this.loader.calc;
		this.ease = this.loader.ease;

		this.group = config.group;
		this.sphere = new THREE.Sphere(new THREE.Vector3(config.x, config.y, config.z), 0);
		this.strength = this.calc.rand(1, 2);
		this.threshold = this.calc.rand(2, 8);
		this.growth = this.calc.rand(0.1, 0.3);
		this.life = 1;
		this.decay = this.calc.rand(0.01, 0.02);
		this.influence = new THREE.Vector3();

		// DEBUG
		// this.geometry = new THREE.SphereGeometry(1, 12, 12);
		// this.material = new THREE.MeshBasicMaterial({
		// 	color: 0xffffff,
		// 	wireframe: true,
		// 	transparent: true,
		// 	opacity: 0.1
		// });
		// this.mesh = new THREE.Mesh(this.geometry, this.material);
		// this.mesh.position.x = this.sphere.center.x;
		// this.mesh.position.y = this.sphere.center.y;
		// this.mesh.position.z = this.sphere.center.z;
		// this.loader.scene.add(this.mesh);

		// CIRCLE
		// this.circleVel = 1;
		// this.geometry = new THREE.SphereGeometry(1, 36, 36);
		// this.material = new THREE.MeshBasicMaterial({
		// 	color: 0xffffff,
		// 	transparent: true,
		// 	opacity: 1,
		// 	depthTest: false,
		// 	precision: 'lowp'
		// });
		// this.mesh = new THREE.Mesh(this.geometry, this.material);
		// this.mesh.position.x = this.sphere.center.x;
		// this.mesh.position.y = this.sphere.center.y;
		// this.mesh.position.z = this.sphere.center.z + 20;
		// this.loader.scene.add(this.mesh);
	}

	getInfluenceVector(vec) {
		this.influence.set(0, 0, 0);
		let distance = this.sphere.distanceToPoint(vec);

		if(distance <= this.threshold ) {
			let ease = this.ease.inOutSine(this.threshold - distance, 0, 1, this.threshold);
			let power = (this.strength * ease * this.life);
			this.influence.addVectors(vec, this.sphere.center).multiplyScalar(power);
		}

		return this.influence;
	}

	update() {
		this.sphere.radius += this.growth * this.life;
		this.life -= this.decay;

		// DEBUG
		//this.mesh.scale.set(this.sphere.radius, this.sphere.radius, this.sphere.radius);

		// CIRCLE
		//let newScale = (this.life) * this.sphere.radius / 8;
		//this.mesh.scale.set(newScale, newScale, newScale);

		//this.mesh.position.z = (1 - this.life) * 10;
		//this.mesh.position.z = this.ease.outExpo(1 - this.life, 0, 1, 1) * 10;
		//this.circleVel -= 0.025;
		//this.mesh.position.z += this.circleVel;
		//this.mesh.material.opacity = this.life;
		//this.mesh.material.opacity = 1;

		if(this.life <= 0) {
			this.destroy();
		}
	}

	destroy() {
		// DEBUG
		//this.loader.scene.remove(this.mesh);

		// CIRCLE
		//this.loader.scene.remove(this.mesh);

		this.group.splice(this.group.indexOf(this), 1);
	}
}

module.exports = Ripple;
