PL.System = function(loader) {

	// #1 have all pop at once then start over

	this.loader = loader;
	this.calc = new PL.Calc();

	this.particles = [];
	this.particleGroup = new THREE.Object3D();
	this.loader.scene.add(this.particleGroup);

	this.count = 50;
	this.height = 15;

	for(let i = 0; i < this.count; i++) {
		let radius = 3;
		let angle = this.calc.map(i, 0, this.count, 0, Math.PI * 5);
		let x = Math.cos(angle) * radius;
		let y = this.calc.map(i, 0, this.count, -this.height , this.height );
		let z = Math.sin(angle) * radius;

		this.particles.push(new PL.Particle({
			group: this.particleGroup,
			color: 0xffffff,
			opacity: this.calc.rand(0.1, 0.5),
			x: x,
			y: y,
			z: z,
			size: this.calc.rand(0.1, 0.4),
			radius: radius,
			angle: angle
		}, this, this.loader));
	}

	for(let i = 0; i < this.count; i++) {
		let radius = 3;
		let angle = this.calc.map(i, 0, this.count, 0, Math.PI * 5) + Math.PI;
		let x = Math.cos(angle) * radius;
		let y = this.calc.map(i, 0, this.count, -this.height , this.height );
		let z = Math.sin(angle) * radius;

		this.particles.push(new PL.Particle({
			group: this.particleGroup,
			color: 0x000000,
			opacity: this.calc.rand(0.1, 0.9),
			x: x,
			y: y,
			z: z,
			size: this.calc.rand(0.1, 0.4),
			radius: radius,
			angle: angle
		}, this, this.loader));
	}

	this.update = function() {
		var i = this.particles.length;
		while(i--) {
			this.particles[i].update();
		}

		this.particleGroup.rotation.y += 0.02;

		//this.particleGroup.rotation.y += ((1 + Math.sin(this.loader.elapsedMs * 0.01)) / 2) * 0.2;

	}

}
