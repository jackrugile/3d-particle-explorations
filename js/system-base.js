PL.SystemBase = class {

	constructor(loader) {
		this.loader = loader;

		this.calc = this.loader.calc;
		this.ease = this.loader.ease;

		this.particles = [];
		this.particleGroup = new THREE.Object3D();
		this.loader.scene.add(this.particleGroup);

		this.exiting = false;
		this.exitProg = 0;
		this.exitRate = 0.01;
		this.completed = false;
		this.duration = Infinity;
	}

	update() {
		let i = this.particles.length;
		while(i--) {
			this.particles[i].update();
		}

		if(!this.exiting && this.loader.elapsedMs > this.duration) {
			this.exiting = true;
		}

		if(this.exiting) {
			this.exitProg += this.exitRate;
			if(this.exitProg >= 1 && !this.completed) {
				this.exitProg = 1;
				this.complete();
			}
		}
	}

	complete() {
		this.completed = true;
		document.documentElement.classList.add('complete');
	}

}
