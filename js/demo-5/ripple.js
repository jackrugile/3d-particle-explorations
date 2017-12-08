class Ripple {

	constructor(config, system, loader) {
		this.system = system;
		this.loader = loader;

		this.calc = this.loader.calc;
		this.ease = this.loader.ease;

		this.array = config.array;
		this.group = config.group;
		this.sphere = new THREE.Sphere(new THREE.Vector3(config.x, config.y, config.z), 0);
		this.strength = config.strength ? config.strength : this.calc.rand(7, 12);
		this.threshold = this.calc.rand(4, 8);
		this.growth = this.calc.rand(0.1, 0.3);
		this.life = 1;
		this.decay = this.calc.rand(0.01, 0.02);
		this.influence = new THREE.Vector3();
		this.geometry = new THREE.CircleGeometry(1, 36);
		this.geometry.vertices.shift();
		this.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));

		this.material = new THREE.LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 1,
			depthTest: false,
			precision: 'lowp'
		});
		this.mesh = new THREE.LineLoop(this.geometry, this.material);
		this.mesh.position.x = this.sphere.center.x;
		this.mesh.position.y = 0;
		this.mesh.position.z = this.sphere.center.z;
		this.group.add(this.mesh);
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

	update(i) {
		this.sphere.radius += (this.growth * this.life) * this.loader.deltaTimeNormal;
		this.life -= this.decay * this.loader.deltaTimeNormal;

		this.mesh.position.y = (1 - this.life) * -2;
		let newScale = 0.001 + this.sphere.radius;
		this.mesh.scale.set(newScale, newScale, newScale);
		this.mesh.material.opacity = this.life / 3;

		if(this.life <= 0) {
			this.destroy(i);
		}
	}

	destroy(i) {
		this.geometry.dispose();
		this.material.dispose();
		this.group.remove(this.mesh);
		this.array.splice(i, 1);
	}
}

module.exports = Ripple;
