PL.System = class {

	constructor(loader) {
		this.loader = loader;
		this.calc = new PL.Calc();
		this.ease = new PL.Ease();
		this.simplex = new SimplexNoise();

		this.particles = [];
		this.particleGroup = new THREE.Object3D();
		this.lines = [];
		this.loader.scene.add(this.particleGroup);

		//this.count = Math.round(window.innerWidth / 10);
		this.count = 150;
		//this.visW = this.calc.visibleWidthAtZDepth(0, this.loader.camera) / 1;
		this.visW = 30;

		this.prog = 0;
		this.progRate = 0.015;
		this.progDir = true;
		this.progEased = 0;

		for(let i = 0; i < this.count; i++) {
			let x = this.calc.map(i, 0, this.count , -this.visW / 2, this.visW / 2) + (this.visW / this.count / 2);
			let y = 0;
			let z = 0;

			this.particles.push(new PL.Particle({
				group: this.particleGroup,
				x: x,
				y: y,
				z: z,
				color: i % 2 === 0 ? 0xffffff: 0xffffff,
				size: this.calc.map(Math.abs(x), 0, this.visW / 2, 0.2, 0.01)
			}, this, this.loader));
		}

		for(let i = 0; i < this.count; i++) {
			let lineMaterial = new THREE.LineBasicMaterial({
				color: 0xffffff,
				opacity: 0.25,
				transparent: true
			});
			let lineGeometry = new THREE.Geometry();
			lineGeometry.vertices.push(
				new THREE.Vector3(),
				new THREE.Vector3()
			);
			let lineMesh = new THREE.Line(lineGeometry, lineMaterial);
			this.particleGroup.add(lineMesh);
			this.lines.push(lineMesh);
		}

	}

	update() {
		if(this.progDir) {
			if(this.prog < 1) {
				this.prog += this.progRate;
			} else {
				this.prog = 1;
				this.progDir = !this.progDir;
			}
		} else {
			if(this.prog > 0) {
				this.prog -= this.progRate;
			} else {
				this.prog = 0;
				this.progDir = !this.progDir;
			}
		}
		this.progEased = this.ease.inOutExpo(this.prog, 0, 1, 1);

		let i = this.particles.length;
		while(i--) {
			this.particles[i].update();
		}

		let j = this.lines.length - 1;
		while(j--) {
			let p1 = this.particles[j];
			let p2 = this.particles[j + 1];
			let line = this.lines[j];
			line.geometry.vertices[0].x = p1.mesh.position.x;
			line.geometry.vertices[0].y = p1.mesh.position.y;
			line.geometry.vertices[0].z = p1.mesh.position.z;
			line.geometry.vertices[1].x = p2.mesh.position.x;
			line.geometry.vertices[1].y = p2.mesh.position.y;
			line.geometry.vertices[1].z = p2.mesh.position.z;
			line.geometry.verticesNeedUpdate = true;
		}
	}

}
