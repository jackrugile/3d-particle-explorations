const SystemBase = require('../system-base');
const Particle = require('./particle');
const Osc = require('../utils/osc');

class System extends SystemBase {

	constructor(loader) {
		super(loader);

		this.duration = 8800;
		this.count = 10;
		this.spread = 20;
		this.increase = 0.04;
		this.colors = [
			0xff00ff,
			0xff0000,
			0x00ff00,
			0x0000ff
		];

		for(let j = 0; j < 4; j++) {
			for(let i = 0; i < this.count; i++) {
				let x = this.calc.map(i, 0, this.count - 1, -this.spread / 2, this.spread / 2);
				let y = 0;
				let z = this.calc.map(j, 0, 3, -0.25, 0.25);
				let color = this.colors[j];
				let size = 0.3;
				let opacity = 1;

				this.particles.push(new Particle({
					group: this.particleGroup,
					offset: j * this.increase,
					x: x,
					y: y,
					z: z,
					size: size,
					color: color,
					opacity: opacity,
					order: i / (this.count - 1),
					alternate: 0
				}, this, this.loader));

				this.particles.push(new Particle({
					group: this.particleGroup,
					offset: j * this.increase,
					x: y,
					y: x,
					z: z,
					size: size,
					color: color,
					opacity: opacity,
					order: i / (this.count - 1),
					alternate: 1
				}, this, this.loader));
			}
		}

		this.osc = new Osc(0.3, 0.015, false, false);

		this.reset();
	}

	reset() {
		this.osc.reset();

		this.particleGroup.rotation.z = Math.PI / 4;

		this.rotationXTarget = 0;
		this.lastRotationXTarget = this.rotationXTarget;
		this.rotationXProgress = 1;

		this.rotationZTarget = Math.PI / 4;
		this.lastRotationZTarget = this.rotationZTarget;
		this.rotationZProgress = 1;
	}

	replay() {
		super.replay();
		this.reset();
	}

	update() {
		super.update();

		this.osc.update(this.loader.deltaTimeNormal);

		if(this.osc.triggerTop) {
			this.lastRotationXTarget = this.rotationXTarget;
			this.rotationXTarget += Math.PI * -2;
			this.rotationXProgress = this.rotationXProgress - 1;

			this.lastRotationZTarget = this.rotationZTarget;
			this.rotationZTarget += Math.PI / -4;
			this.rotationZProgress = this.rotationZProgress - 1;
		}

		if(this.rotationXProgress < 1) {
			this.rotationXProgress += 0.015 * this.loader.deltaTimeNormal;
		}
		this.rotationXProgress = this.calc.clamp(this.rotationXProgress, 0, 1);

		if(this.rotationZProgress < 1) {
			this.rotationZProgress += 0.015 * this.loader.deltaTimeNormal;
		}
		this.rotationZProgress = this.calc.clamp(this.rotationZProgress, 0, 1);

		this.particleGroup.rotation.y = this.calc.map(this.ease.inOutExpo(this.rotationXProgress, 0, 1, 1), 0, 1, this.lastRotationXTarget, this.rotationXTarget);
		this.particleGroup.rotation.z = this.calc.map(this.ease.inOutExpo(this.rotationZProgress, 0, 1, 1), 0, 1, this.lastRotationZTarget, this.rotationZTarget);

		if(this.exiting && !this.loader.isOrbit && !this.loader.isGrid) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProgress, 0, 1, 1) * this.loader.cameraBaseZ;
		}
	}

}

module.exports = System;
