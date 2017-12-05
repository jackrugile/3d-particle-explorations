const SystemBase = require('../system-base');
const Particle = require('./particle');

class System extends SystemBase {

	constructor(loader) {
		super(loader);

		this.duration = 6200;
		this.count = 75;

		for(let i = 0; i < this.count; i++) {
			this.particles.push(new Particle({
				group: this.particleGroup,
				x: 0,
				y: 0,
				z: this.calc.rand(0.01, 5),
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

		let resetFlagCount = 0;
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
					c1pos.x += x * this.loader.deltaTimeNormal;
					c1pos.y += y * this.loader.deltaTimeNormal;
					c2pos.x -= x * this.loader.deltaTimeNormal;
					c2pos.y -= y * this.loader.deltaTimeNormal;
				}
			}
			if(c1.resetFlag) {
				resetFlagCount++;
			}
		}

		if(resetFlagCount >= this.particles.length) {
			for(let i = 0, l = this.particles.length; i < l; i++) {
				this.particles[i].reset();
			}
		}

		this.particleGroup.rotation.z = this.loader.elapsedMilliseconds * -0.0003;

		if(this.exiting && !this.loader.isOrbit && !this.loader.isGrid) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProgress, 0, 1, 1) * this.loader.cameraBaseZ;
		}
	}

}

module.exports = System;
