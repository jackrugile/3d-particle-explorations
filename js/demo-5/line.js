class Line {

	constructor(config, system, loader) {
		this.loader = loader;
		this.system = system;

		this.calc = this.loader.calc;
		this.ease = this.loader.ease;

		this.group = config.group;
		this.points = config.points;
		this.count = this.points.length;
		this.geometry = new THREE.BufferGeometry();

		this.positions = new Float32Array(this.count * 3);
		this.colors = new Float32Array(this.count * 3);
		this.line_distances = new Float32Array(this.count);

		this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
		this.geometry.addAttribute('color', new THREE.BufferAttribute(this.colors, 3));
		this.geometry.addAttribute('lineDistance', new THREE.BufferAttribute(this.line_distances, 1));

		this.material = new THREE.LineDashedMaterial( {
			vertexColors: THREE.VertexColors,
			dashSize: 1,
			gapSize: 1e10,
			opacity: 1,
			transparent: true
		});

		this.fraction = 0;
		this.removeFlag = false;
		this.speed = this.calc.rand(0.003, 0.007)

		this.mesh = new THREE.Line(this.geometry, this.material);
		this.group.add(this.mesh);
	}

	update() {
		for(let i = 0, l = this.count; i < l; i++) {
			this.positions[i * 3 + 0] = this.points[i].mesh.position.x;
			this.positions[i * 3 + 1] = this.points[i].mesh.position.y;
			this.positions[i * 3 + 2] = this.points[i].mesh.position.z;
			this.colors[i * 3 + 0] = 1;
			this.colors[i * 3 + 1] = 1;
			this.colors[i * 3 + 2] = 1;

			if(i > 0) {
				this.line_distances[i] = this.line_distances[i - 1] + this.points[i - 1].mesh.position.distanceTo(this.points[i].mesh.position);
			}
		}

		this.line_length = this.line_distances[this.count - 1];

		this.geometry.attributes.position.needsUpdate = true;
		this.geometry.attributes.color.needsUpdate = true;
		this.geometry.attributes.lineDistance.needsUpdate = true;

		this.fraction += this.speed;
		this.easing = this.ease.outExpo(this.fraction, 0, 1, 1);
		this.material.dashSize = this.easing * this.line_length;
		this.material.gapSize = this.line_length;
		this.material.opacity = 1 - this.easing;

		if(this.fraction >= 1) {
			this.destroy();
			this.removeFlag = true;
		}
	}

	destroy() {
		this.geometry.dispose();
		this.material.dispose();
	}

}

module.exports = Line;
