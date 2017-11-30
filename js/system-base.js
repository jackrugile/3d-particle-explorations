class SystemBase {

	constructor(loader) {
		this.loader = loader;

		this.calc = this.loader.calc;
		this.ease = this.loader.ease;

		this.sphereGeometry = new THREE.SphereBufferGeometry(1, 12, 12);
		this.boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);

		this.particles = [];
		this.particleGroup = new THREE.Object3D();

		this.loader.scene.add(this.particleGroup);

		this.entering = true;
		this.enterProg = 0;
		this.enterRate = 0.015;

		this.exiting = false;
		this.exitProg = 0;
		this.exitRate = 0.01;
		this.duration = Infinity;
	}

	update() {
		let i = this.particles.length;
		while(i--) {
			this.particles[i].update();
		}

		if(this.entering && this.enterProg < 1) {
			this.enterProg += this.enterRate;
			if(this.enterProg > 1) {
				this.enterProg = 1;
				this.entering = false;
			}
			let scale = this.ease.inOutExpo(this.enterProg, 0, 1, 1);
			this.particleGroup.scale.set(scale, scale, scale);
		}

		if(!this.exiting && this.loader.elapsedMs > this.duration) {
			this.exiting = true;
		}

		if(this.exiting) {
			this.exitProg += this.exitRate;
			if(this.exitProg >= 1 && !this.loader.completed) {
				this.exitProg = 1;
				this.loader.complete();
			}
		}
	}

	replay() {
		this.particleGroup.scale.set(0.0001, 0.0001, 0.0001);

		let i = this.particles.length;
		while(i--) {
			this.particles[i].reset();
		}

		this.entering = true;
		this.enterProg = 0;

		this.exiting = false;
		this.exitProg = 0;

		if(this.osc) {
			this.osc.reset();
		}
	}

}

module.exports = SystemBase;
