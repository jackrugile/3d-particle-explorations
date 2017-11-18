PL.System = class {

	constructor(loader) {
		this.loader = loader;
		this.calc = new PL.Calc();
		this.simplex = new SimplexNoise();

		this.particles = [];
		this.particleGroup = new THREE.Object3D();
		this.loader.scene.add(this.particleGroup);

		this.count = Math.round(window.innerWidth / 12);
		this.visW = this.calc.visibleWidthAtZDepth(0, this.loader.camera) / 1;

		for(let i = 0; i < this.count ; i++) {
			let x = this.calc.map(i, 0, this.count , -this.visW / 2, this.visW / 2) + (this.visW / this.count  / 2);
			let y = 0;
			let z = 0;

			this.particles.push(new PL.Particle({
				group: this.particleGroup,
				x: x,
				y: y,
				z: z
			}, this, this.loader));
		}
	}

	update() {
		let i = this.particles.length;
		while(i--) {
			this.particles[i].update();
		}
	}

}
