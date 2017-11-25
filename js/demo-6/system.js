PL.System = class {

	constructor(loader) {
		this.loader = loader;
		this.calc = new PL.Calc();
		this.ease = new PL.Ease();

		this.particles = [];
		this.particleGroup = new THREE.Object3D();
		this.loader.scene.add(this.particleGroup);

		this.exitProg = 0;
		this.exiting = false;
		this.completed = false;

		let rings = 8;
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
				//let size = this.calc.rand(0.1, 0.3);
				let size = this.calc.map(i, 0, rings, 0.2, 0.05);
				//let size = 0.2;

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

		if(!this.exiting && this.loader.elapsedMs > 3000) {
			this.exiting = true;
		}

		if(this.exiting) {
			this.exitProg += 0.01;
			if(this.exitProg >= 1 && !this.completed) {
				this.exitProg = 1;
				this.complete();
			}
			this.loader.camera.position.z = 100 - this.ease.inExpo(this.exitProg, 0, 1, 1) * 100;
		}
	}

	complete() {
		this.completed = true;
		document.documentElement.classList.add('complete');
	}

}
