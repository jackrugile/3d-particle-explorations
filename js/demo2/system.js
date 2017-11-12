PL.System = function(loader) {

	this.loader = loader;
	this.calc = new PL.Calc();
	this.simplex = new SimplexNoise();

	this.particles = [];
	this.particleGroup = new THREE.Object3D();
	this.loader.scene.add(this.particleGroup);

	this.count = Math.round(window.innerWidth / 8);
	this.visW = this.calc.visibleWidthAtZDepth(0, this.loader.camera) / 1;

	for(var i = 0; i < this.count ; i++) {
		var x = this.calc.map(i, 0, this.count , -this.visW / 2, this.visW / 2) + (this.visW / this.count  / 2);
		var y = 0;
		var z = 0;

		this.particles.push(new PL.Particle({
			group: this.particleGroup,
			x: x,
			y: y,
			z: z
		}, this, this.loader));
	}

	this.update = function() {
		var i = this.particles.length;
		while(i--) {
			this.particles[i].update();
		}

		//this.particleGroup.rotation.x += 0.01
		//this.particleGroup.rotation.y += 0.01
		//this.particleGroup.rotation.z += 0.01
	}

}
