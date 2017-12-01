const SystemBase = require('../system-base');
const Particle = require('./particle');
const Osc = require('../utils/osc');

class System extends SystemBase {

	constructor(loader) {
		super(loader);

		this.duration = 8800;
		this.count = 10;
		this.spread = 20;
		this.inc = 0.04;
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
				let pos = new THREE.Vector3(x, y, z);
				let color = this.colors[j];
				let size = 0.3;
				let opacity = 1;

				this.particles.push(new Particle({
					group: this.particleGroup,
					offset: j * this.inc,
					x: x,
					y: y,
					z: z,
					size: size,
					color: color,
					opacity: opacity,
					prog: i / (this.count - 1),
					alt: 0
				}, this, this.loader));

				this.particles.push(new Particle({
					group: this.particleGroup,
					offset: j * this.inc,
					x: y,
					y: x,
					z: z,
					size: size,
					color: color,
					opacity: opacity,
					prog: i / (this.count - 1),
					alt: 1
				}, this, this.loader));
			}
		}

		this.reset();
	}

	reset() {
		this.osc = new Osc(0.3, 0.015, false, false);

		this.particleGroup.rotation.z = Math.PI / 4;

		this.rotationTargetX = 0;
		this.lastRotationTargetX = this.rotationTargetX;
		this.rotationTargetZ = Math.PI / 4;
		this.lastRotationTargetZ = this.rotationTargetZ;
		this.rotProg = 1;
	}

	replay() {
		super.replay();
		this.reset();
	}

	update() {
		super.update();

		if(this.exiting && !this.loader.isOrbit && !this.loader.isGrid) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProg, 0, 1, 1) * this.loader.cameraBaseZ;
		}

		this.osc.update(this.loader.dtN);

		if(this.osc._triggerTop) {
			this.lastRotationTargetX = this.rotationTargetX;
			this.rotationTargetX += Math.PI * -2;
			this.lastRotationTargetZ = this.rotationTargetZ;
			this.rotationTargetZ += Math.PI / -4;
			this.rotProg = this.rotProg - 1;
		}

		if(this.rotProg < 1) {
			this.rotProg += 0.015 * this.loader.dtN;
		}
		this.rotProg = this.calc.clamp(this.rotProg, 0, 1);

		this.particleGroup.rotation.y = this.calc.map(this.ease.inOutExpo(this.rotProg, 0, 1, 1), 0, 1, this.lastRotationTargetX, this.rotationTargetX);
		this.particleGroup.rotation.z = this.calc.map(this.ease.inOutExpo(this.rotProg, 0, 1, 1), 0, 1, this.lastRotationTargetZ, this.rotationTargetZ);
	}

}

module.exports = System;
