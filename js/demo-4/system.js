const SystemBase = require('../system-base');
const Particle = require('./particle');

class System extends SystemBase {

	constructor(loader) {
		super(loader);

		this.lines = [];

		this.duration = 3500;
		this.count = 24;
		this.height = 10;

		for(let i = 0; i < this.count; i++) {
			this.particles.push(new Particle({
				group: this.particleGroup,
				prog: i / this.count,
				alt: false,
				color: 0xffffff,
				opacity: 1,
				size: this.calc.map(i, 0, this.count, 0.1, 0.3),
				radius: 4,
			}, this, this.loader));

			this.particles.push(new Particle({
				group: this.particleGroup,
				prog: i / this.count,
				alt: true,
				color: 0xffffff,
				opacity: 1,
				size: this.calc.map(i, 0, this.count, 0.3, 0.1),
				radius: 4,
			}, this, this.loader));
		}

		for(let i = 0; i < this.count; i++) {
			let lineMaterial = new THREE.LineBasicMaterial({
				color: 0xffffff,
				opacity: 0.5,
				transparent: true
			});
			let lineGeometry = new THREE.Geometry();
			lineGeometry.vertices.push(
				new THREE.Vector3(),
				new THREE.Vector3()
			);
			let lineMesh = new THREE.Line(lineGeometry, lineMaterial);
			this.particleGroup.add(lineMesh);
			this.lines.push(lineMesh);
		}
	}

	update() {
		super.update();

		let i = this.particles.length;
		while(i--) {
			this.particles[i].update();
		}

		let j = this.lines.length;
		while(j--) {
			let p1 = this.particles[j * 2];
			let p2 = this.particles[j * 2 + 1];
			let line = this.lines[j];
			line.geometry.vertices[0].x = p1.mesh.position.x;
			line.geometry.vertices[0].y = p1.mesh.position.y;
			line.geometry.vertices[0].z = p1.mesh.position.z;
			line.geometry.vertices[1].x = p2.mesh.position.x;
			line.geometry.vertices[1].y = p2.mesh.position.y;
			line.geometry.vertices[1].z = p2.mesh.position.z;
			line.geometry.verticesNeedUpdate = true;
		}

		this.particleGroup.rotation.z = Math.sin(this.loader.elapsedMs * 0.0015) * Math.PI * 0.25;

		if(this.exiting && !this.loader.isOrbit && !this.loader.isGrid) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProg, 0, 1, 1) * this.loader.cameraBaseZ;
		}
	}

}

module.exports = System;
