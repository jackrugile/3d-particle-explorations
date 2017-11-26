PL.Particle = class extends PL.ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.prog = config.prog;
		this.radius = config.radius;
		this.osc1 = new PL.Osc(this.prog / 1, 0.02, true, false);
		this.osc2 = new PL.Osc(this.prog / 2, 0.01, true, false);
		this.speed = -0.0005 + (-20 - this.radius) * 0.002;
		this.angle = this.calc.rand(Math.PI * 2);
	}

	update() {
		this.osc1.update();
		this.osc2.update();

		this.angle += this.speed * this.osc1.val(this.ease.inOutExpo);
		this.mesh.position.x = Math.cos(this.angle) * this.radius * (0 + this.osc2.val(this.ease.inOutExpo) * 1);
		this.mesh.position.y = Math.sin(this.angle) * this.radius * (0 + this.osc2.val(this.ease.inOutExpo) * 1);
	}

}
