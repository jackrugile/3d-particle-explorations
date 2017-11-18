PL.System = class {

	constructor(loader) {
		this.loader = loader;
		this.calc = new PL.Calc();

		this.particles = [];
		this.particleGroup = new THREE.Object3D();
		this.loader.scene.add(this.particleGroup);

		//this.count = 40;
		this.count = 100;
		this.height = 20;

		for(let i = 0; i < this.count; i++) {
			let radius = 4;
			let angle = this.calc.map(i, 0, this.count, 0, Math.PI * 5);
			let x = Math.cos(angle) * radius;
			let y = this.calc.map(i, 0, this.count, -this.height , this.height );
			let z = Math.sin(angle) * radius;

			this.particles.push(new PL.Particle({
				group: this.particleGroup,
				color: new THREE.Color('magenta'),
				opacity: 1,
				x: x,
				y: y,
				z: z,
				//size: 0.25 + (Math.sin(i / 5)) * 0.2,
				size: this.calc.rand(0.05, 0.45),
				radius: radius,
				angle: angle
			}, this, this.loader));
		}

		for(let i = 0; i < this.count; i++) {
			let radius = 4;
			let angle = this.calc.map(i, 0, this.count, 0, Math.PI * 5) + Math.PI;
			let x = Math.cos(angle) * radius;
			let y = this.calc.map(i, 0, this.count, -this.height , this.height );
			let z = Math.sin(angle) * radius;

			this.particles.push(new PL.Particle({
				group: this.particleGroup,
				color: new THREE.Color('red'),
				opacity: 1,
				x: x,
				y: y,
				z: z,
				//size: 0.25 + (Math.cos(i / 5)) * 0.2,
				size: this.calc.rand(0.05, 0.45),
				radius: radius,
				angle: angle
			}, this, this.loader));
		}
	}

	update() {
		let i = this.particles.length;
		while(i--) {
			this.particles[i].update();
		}

		this.particleGroup.rotation.y += 0.02 * this.loader.dtN;

		//this.particleGroup.rotation.y += ((1 + Math.sin(this.loader.elapsedMs * 0.01)) / 2) * 0.2;

	}

}
