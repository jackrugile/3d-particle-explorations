PL.Particle = class extends PL.ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);
	}

	update() {
		let div = 0.15;
		let amp = ((this.system.visW / 2) - Math.abs(this.mesh.position.x)) / (this.system.visW / 2);
		amp *= this.system.oscEased;
		let speed = this.loader.elapsedMs / 1000;

		this.mesh.position.y = this.system.simplex.noise2D(this.mesh.position.x * div + speed, 0) * 10 * amp;
	}

}
