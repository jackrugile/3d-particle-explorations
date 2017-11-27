PL.System = class extends PL.SystemBase {

	constructor(loader) {
		super(loader);

		this.simplex = new SimplexNoise();

		this.count = 1000;
		this.duration = 3500;
		this.size = 10;

		for(let i = 0; i < this.count; i++) {
			let x = this.calc.rand(-this.size / 2, this.size / 2);
			let y = this.calc.rand(-this.size / 2, this.size / 2);
			let z = this.calc.rand(-this.size / 2, this.size / 2);
			let size = this.calc.rand(0.02, 0.3);

			this.particles.push(new PL.Particle({
				group: this.particleGroup,
				x: x,
				y: y,
				z: z,
				size: size,
				color: 0xffffff,
				opacity: this.calc.rand(1, 1)
			}, this, this.loader));
		}
	}

	update() {
		super.update();

		if(this.exiting && !this.loader.isOrbit) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProg, 0, 1, 1) * this.loader.cameraBaseZ;
		}
	}

}
