/*
	- set life span for this, by system? or by particle?
	- set opacity to fade out at end when zooming
*/

PL.System = class {

	constructor(loader) {
		this.loader = loader;
		this.calc = new PL.Calc();

		this.total = 5000;
		this.completed = false;

		this.particles = [];
		this.particleGroup = new THREE.Object3D();
		this.loader.scene.add(this.particleGroup);

		this.count = 75;

		for(let i = 0; i < this.count; i++) {
			this.particles.push(new PL.Particle({
				group: this.particleGroup,
				x: 0,
				y: 0,
				z: 0,
				size: this.calc.rand(0.1, 0.8),
				delay: i
			}, this, this.loader));
		}
	}

	update() {
		let i = this.particles.length;
		let initiatedCount = 0;
		while(i--) {
			this.particles[i].update();
			if(this.particles[i].initiated) {
				initiatedCount++;
			}
		}

		if(initiatedCount === 0) {
			let j = this.particles.length;
			while(j--) {
				this.particles[j].initiated = true;
			}
		}

		for(let i = 0, l = this.particles.length; i < l; i++) {
			let c1 = this.particles[i];
			let c1pos = c1.mesh.position;
			for(let j = i + 1; j < l; j++) {
				let c2 = this.particles[j];
				let c2pos = c2.mesh.position;
				let dx = c1pos.x - c2pos.x;
				let dy = c1pos.y - c2pos.y;
				let dist = dx * dx + dy * dy - 8;
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

		if(!this.completed && this.loader.elapsedMs > this.total) {
			this.complete();
		}

	}

	complete() {
		this.completed = true;
		console.log('complete');
	}

}
