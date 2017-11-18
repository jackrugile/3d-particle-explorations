PL.System = class {

	constructor(loader) {
		this.loader = loader;
		this.calc = new PL.Calc();

		this.particles = [];
		this.particleGroup = new THREE.Object3D();
		this.loader.scene.add(this.particleGroup);

		let rings = 10;
		let radius = 0;

		for(let i = 0; i < rings; i++) {
			let count = 1 + Math.ceil(i * 6);
			if(i === 0) {
				count = 1;
			}

			for(let j = 0; j < count; j++) {
				let angle = (j / count) * Math.PI * 2;

				let x = Math.cos(angle) * radius;
				let y = Math.sin(angle) * radius;
				//let z = radius;
				let z = 0;
				let size = this.calc.rand(0.1, 0.3);

				this.particles.push(new PL.Particle({
					group: this.particleGroup,
					angle: angle,
					color: i % 2 === 0 ? 0xffffff: 0xffffff,
					x: x,
					y: y,
					z: z,
					size: size,
					radius: radius
				}, this, this.loader));
			}

			radius += 1.5;
		}
	}

	update() {
		let i = this.particles.length;
		while(i--) {
			this.particles[i].update();
		}
	}

}
