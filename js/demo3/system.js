PL.System = function(loader) {

	// #1 have all pop at once then start over

	this.loader = loader;
	this.calc = new PL.Calc();

	this.particles = [];
	this.particleGroup = new THREE.Object3D();
	this.loader.scene.add(this.particleGroup);

	this.count = 300;
	this.popping = false;

	this.update = function() {
		if(this.particles.length < this.count && !this.popping) {
			for(let i = 0; i < 6; i++) {
				this.particles.push(new PL.Particle({
					group: this.particleGroup,
					x: 0,
					y: 0,
					z: 0,
					size: this.calc.rand(0.2, 2)
				}, this, this.loader));
			}
		}

		var i = this.particles.length;
		while(i--) {
			this.particles[i].update();
		}

		for(let i = 0, l = this.particles.length; i < l; i++) {
			let c1 = this.particles[i];
			let c1pos = c1.mesh.position;
			for(let j = i + 1; j < l; j++) {
				let c2 = this.particles[j];
				let c2pos = c2.mesh.position;
				let dx = c1pos.x - c2pos.x;
				let dy = c1pos.y - c2pos.y;
				let dist = dx * dx + dy * dy - 10;
				let radii = (c1.size + c2.size) * (c1.size + c2.size);
				if(dist < radii) {
					let angle = Math.atan2(dy, dx) + this.calc.rand(-0.05, 0.05);
					let diff = radii - dist;
					let x = Math.cos(angle) * diff * 0.03;
					let y = Math.sin(angle) * diff * 0.03;
					c1pos.x += x;
					c1pos.y += y;
					c2pos.x -= x;
					c2pos.y -= y;
				}
			}
		}

		if(this.particles.length >= this.count) {
			setTimeout(() => {
				this.popping = true;
			}, 500);
		}

		if(this.popping) {
			let i = 6;
			while(i--) {
				this.particleGroup.remove(this.particleGroup.children[this.particles.length - 1]);
				this.particles.pop();
			}
		}

		if(this.particles.length === 0) {
			this.popping = false;
		}

	}

}
