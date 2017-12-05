class SystemBase {

	constructor(loader) {
		this.loader = loader;

		this.calc = this.loader.calc;
		this.ease = this.loader.ease;

		this.sphereGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
		this.boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
		this.center = new THREE.Vector3();

		this.particles = [];
		this.particleGroup = new THREE.Object3D();
		this.particleGroup.scale.set(0.0001, 0.0001, 0.0001);

		this.loader.scene.add(this.particleGroup);

		this.entering = true;
		this.enterProgress = 0;
		this.enterRate = 0.015;

		this.exiting = false;
		this.exitProgress = 0;
		this.exitRate = 0.01;
		this.duration = Infinity;
	}

	update() {
		let i = this.particles.length;
		while(i--) {
			this.particles[i].update();
		}

		if(this.entering && this.enterProgress < 1) {
			this.enterProgress += this.enterRate * this.loader.deltaTimeNormal;
			if(this.enterProgress > 1) {
				this.enterProgress = 1;
				this.entering = false;
			}
			let scale = this.ease.inOutExpo(this.enterProgress, 0, 1, 1);
			this.particleGroup.scale.set(scale, scale, scale);
		}

		if(!this.exiting && this.loader.elapsedMilliseconds > this.duration) {
			this.exiting = true;
		}

		if(this.exiting) {
			this.exitProgress += this.exitRate * this.loader.deltaTimeNormal;
			if(this.exitProgress >= 1 && !this.loader.completed) {
				this.exitProgress = 1;
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
		this.enterProgress = 0;

		this.exiting = false;
		this.exitProgress = 0;
	}

}

module.exports = SystemBase;
