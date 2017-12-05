const ParticleBase = require('../particle-base');
const Osc = require('../utils/osc');

class Particle extends ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.zBase = config.z;
		this.order = config.order;
		this.index = config.index;
		this.radius = config.radius;

		this.createTail();
		this.createHead();

		this.osc = new Osc(1 - this.order / 5, 0.015, true, false);

		this.reset();
	}

	reset() {
		super.reset();
		this.osc.reset();
	}

	createMesh() {
		this.object3D = new THREE.Object3D();
		this.group.add(this.object3D);
	}

	createTail() {
		this.curveAngle = this.calc.rand(Math.PI / 8, Math.PI / 3);
		this.curve = new THREE.EllipseCurve(
			0,
			0,
			this.radius,
			this.radius,
			0,
			this.curveAngle,
			false,
			0
		);

		this.curvePoints = this.curve.getPoints(10);
		this.curveGeometry = new THREE.BufferGeometry().setFromPoints(this.curvePoints);

		this.curveMaterial = new THREE.LineBasicMaterial({
			color: this.color,
			transparent: true,
			opacity: ((this.radius) / this.system.outer) * 1
		});

		this.curveMesh = new THREE.Line(this.curveGeometry, this.curveMaterial);

		this.curveMesh.position.z = this.z;

		this.object3D.add(this.curveMesh);
	}

	createHead() {
		this.particleGeometry = new THREE.SphereBufferGeometry(1, 12, 12);

		this.particleMaterial = new THREE.MeshBasicMaterial({
			color: this.color,
			transparent: true,
			opacity: this.opacity,
			depthTest: false,
			precision: 'lowp'
		});

		this.particleMesh = new THREE.Mesh(this.particleGeometry, this.particleMaterial);

		this.particleMesh.position.x = this.x;
		this.particleMesh.position.y = this.y;
		this.particleMesh.position.z = this.z;

		this.particleMesh.scale.set(this.size, this.size, this.size);

		this.object3D.add(this.particleMesh);
	}

	update() {
		this.osc.update(this.loader.timescale);

		let oscEased = this.osc.val(this.ease.inOutExpo);
		this.angle = (Math.PI / 2) + (this.index % 3) * ((Math.PI * 2) / 3) + oscEased * ((Math.PI * 6) / 3);
		this.angle += oscEased * (Math.PI / 3);
		this.particleMesh.position.x = Math.cos(this.angle) * this.radius;
		this.particleMesh.position.y = Math.sin(this.angle) * this.radius;
		this.particleMesh.position.z = this.calc.map(oscEased, 0, 1, this.zBase / 2, -this.zBase / 2);

		this.curveMesh.position.z = this.calc.map(oscEased, 0, 1, this.zBase / 2, -this.zBase / 2);
		this.curveMesh.rotation.z = this.angle - this.curveAngle * (1 - oscEased);
	}

}

module.exports = Particle;
