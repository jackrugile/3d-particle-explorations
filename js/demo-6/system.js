const SystemBase = require('../system-base');
const Particle = require('./particle');
const Osc = require('../utils/osc');

class System extends SystemBase {

	constructor(loader) {
		super(loader);

		this.duration = 6000;

		this.count = 60;
		this.outer = 12;

		this.osc = new Osc(1, 0.015, true, false);

		this.rotationTarget = 0;
		this.lastRotationTarget = this.rotationTarget;
		this.rotProg = 0;
		
		for(let i = 0; i < this.count; i++) {
			let x = 0;
			let y = 0;
			let z = this.calc.map(i, 0, this.count - 1, -10, 0);
			let size = this.calc.map(i, 0, this.count - 1, 0.01, 0.175);
			let radius = this.calc.map(i, 0, this.count - 1, 1, this.outer) - ((this.outer / this.count) * (i % 3));
			let opacity = this.calc.map(i, 0, this.count - 1, 0.1, 1)

			this.particles.push(new Particle({
				group: this.particleGroup,
				prog: i / (this.count - 1),
				alt: i % 2 === 0,
				index: i,
				x: x,
				y: y,
				z: z,
				size: size,
				radius: radius,
				color: 0xffffff,
				opacity: opacity
			}, this, this.loader));
		}
	}

	update() {
		super.update();

		this.osc.update();

		if(this.exiting && !this.loader.isOrbit && !this.loader.isGrid) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProg, 0, 1, 1) * this.loader.cameraBaseZ;
		}

		//this.particleGroup.rotation.x = Math.cos(this.loader.elapsedMs * 0.002) * -0.5;
		//this.particleGroup.rotation.y = this.calc.map(this.osc.val(this.ease.inOutExpo), 0, 1, 0, Math.PI * 0.5);

		if(this.osc._triggerTop) {
			this.lastRotationTarget = this.rotationTarget;
			this.rotationTarget += Math.PI / -1;
			this.rotProg = 0;
		}

		if(this.rotProg < 1) {
			this.rotProg += 0.0075;
		} 
		this.rotProg = this.calc.clamp(this.rotProg, 0, 1);

		this.particleGroup.rotation.y = this.calc.map(this.ease.inOutExpo(this.rotProg, 0, 1, 1), 0, 1, this.lastRotationTarget, this.rotationTarget);
	}

}

module.exports = System;
