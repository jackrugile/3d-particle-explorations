PL.System = function(loader) {

	this.loader = loader;
	this.calc = new PL.Calc();

	this.particles = [];
	this.particleGroup = new THREE.Object3D();
	this.loader.scene.add(this.particleGroup);

	var rings = 20;
	var radius = 0;

	for(var i = 0; i < rings; i++) {
		var count = 1 + Math.ceil(i * 6);
		if(i === 0) {
			count = 1;
		}

		for(var j = 0; j < count; j++) {
			var angle = (j / count) * Math.PI * 2;

			var x = Math.cos(angle) * radius;
			var y = Math.sin(angle) * radius;
			var z = radius;
			var size = this.calc.rand(0.2, 0.5);

			this.particles.push(new PL.Particle({
				group: this.particleGroup,
				angle: angle,
				x: x,
				y: y,
				z: z,
				size: size,
				radius: radius
			}, this, this.loader));
		}

		radius += 3;
	}

	this.update = function() {
		var i = this.particles.length;
		while(i--) {
			this.particles[i].update();
		}
	}

}
