PL.System = class extends PL.SystemBase {

	constructor(loader) {
		super(loader);

		this.count = 300;

		for(let i = 0; i < this.count; i++) {
			let x = 0;
			let y = 0;
			let z = 0;
			let size = this.calc.map(i, 0, this.count - 1, 0.05, 0.3);
			let radius = this.calc.map(i, 0, this.count - 1, -20, 0);

			this.particles.push(new PL.Particle({
				group: this.particleGroup,
				prog: i / (this.count - 1),
				x: x,
				y: y,
				z: z,
				size: size,
				radius: radius,
				color: 0xffffff,
				opacity: this.calc.rand(0.1, 1)
			}, this, this.loader));
		}
	}

	update() {
		super.update();
	}

}
