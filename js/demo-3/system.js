PL.System = class extends PL.SystemBase {

	constructor(loader) {
		super(loader);

		this.count = 75;
		this.duration = 3500;

		for(let i = 0; i < this.count; i++) {
			this.particles.push(new PL.Particle({
				group: this.particleGroup,
				x: 0,
				y: 0,
				z: 0,
				size: this.calc.rand(0.1, 0.8),
				delay: i,
				color: 0xffffff,
				opacity: this.calc.rand(0.1, 1)
			}, this, this.loader));
		}
	}

	update() {
		super.update();

		let i = this.particles.length;
		let initiatedCount = 0;
		while(i--) {
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
				let dist = dx * dx + dy * dy - 6;
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

		if(this.exiting) {
			this.loader.camera.position.z = 100 - this.ease.inExpo(this.exitProg, 0, 1, 1) * 100;
		}
	}

}
