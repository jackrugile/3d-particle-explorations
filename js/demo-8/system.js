const SystemBase = require('../system-base');
const Particle = require('./particle');
const Osc = require('../utils/osc');

class System extends SystemBase {

	constructor(loader) {
		super(loader);

		this.duration = 9300;
		this.simplex = new FastSimplexNoise();
		this.color = new THREE.Color();

		this.texture = new THREE.TextureLoader().load('./images/orb.png');
		this.size = 10;
		this.scale = 1;
		this.base = 20;
		this.count = this.base * this.base * this.base;
		this.geometry = new THREE.BufferGeometry();
		this.objs = [];

		this.positions = new Float32Array(this.count * 3);
		this.colors = new Float32Array(this.count * 4);
		this.sizes = new Float32Array(this.count);

		this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
		this.geometry.addAttribute('color', new THREE.BufferAttribute(this.colors, 4));
		this.geometry.addAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

		for(let i = 0; i < this.count; i++) {
			let size = this.calc.rand(0.1, 0.8);
			this.objs.push({
				offset: 0,
				pos: new THREE.Vector3(
					this.calc.rand(-this.size / 2, this.size / 2),
					this.calc.rand(-this.size / 2, this.size / 2),
					this.calc.rand(-this.size / 2, this.size / 2)
				),
				baseSize: size,
				size: size,
				r: 1,
				g: 1,
				b: 1,
				a: 0,
				life: 2,
				decay: this.calc.rand(0.05, 0.15),
				firstRun: true
			});
		}

		this.material = new THREE.ShaderMaterial({
			uniforms: {
				texture: {
					type: 't',
					value: this.texture
				}
			},
			vertexShader: `
				attribute float size;
				attribute vec4 color;
				varying vec4 vColor;
				void main() {
					vColor = color;
					vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
					gl_PointSize = size * (300.0 / length(mvPosition.xyz));
					gl_Position = projectionMatrix * mvPosition;
				}
			`,
			fragmentShader: `
				uniform sampler2D texture;
				varying vec4 vColor;
				void main(void) {
					gl_FragColor = vColor * texture2D(texture, gl_PointCoord);
				}
			`,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true
		});

		this.mesh = new THREE.Points(this.geometry, this.material);
		this.particleGroup.add(this.mesh);

		this.updateParticles(true, true, true);

		this.reset();
	}

	reset() {
		this.osc = new Osc(0, 0.015, true, false);
	}

	createMesh() {
	}

	updateParticles(color, position, size) {
		let i = this.count;
		while(i--) {
			let obj = this.objs[i];
			if(color) {
				this.colors[i * 4 + 0] = obj.r;
				this.colors[i * 4 + 1] = obj.g;
				this.colors[i * 4 + 2] = obj.b;
				this.colors[i * 4 + 3] = obj.a;
			}
			if(position) {
				this.positions[i * 3 + 0] = obj.pos.x;
				this.positions[i * 3 + 1] = obj.pos.y;
				this.positions[i * 3 + 2] = obj.pos.z;
			}
			if(size) {
				this.sizes[i] = obj.size;
			}
		}

		if(color) {
			this.geometry.attributes.color.needsUpdate = true;
		}
		if(position) {
			this.geometry.attributes.position.needsUpdate = true;
		}
		if(size) {
			this.geometry.attributes.size.needsUpdate = true;
		}
	}

	replay() {
		super.replay();
		this.reset();
	}

	update() {
		super.update();

		this.osc.update(this.loader.dtN);

		if(this.exiting && !this.loader.isOrbit && !this.loader.isGrid) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProg, 0, 1, 1) * this.loader.cameraBaseZ;
		}

		let i = this.count;

		let noiseDiv = 10;
		let noiseTime = this.loader.elapsedMs * 0.0008;
		let noiseVel = this.calc.map(this.osc.val(this.ease.inOutExpo), 0, 1, 0, 1);

		while(i--) {
			let obj = this.objs[i];

			let xDiv = obj.pos.x / noiseDiv;
			let yDiv = obj.pos.y / noiseDiv;
			let zDiv = obj.pos.z / noiseDiv;

			let noise1 = this.simplex.getRaw4DNoise(
				xDiv,
				yDiv,
				zDiv,
				noiseTime
			) * 0.5 + 0.5;
			let noise2 = this.simplex.getRaw4DNoise(
				xDiv + 100,
				yDiv + 100,
				zDiv + 100,
				50 + noiseTime
			) * 0.5 + 0.5;
			let noise3 = this.simplex.getRaw4DNoise(
				xDiv + 200,
				yDiv + 200,
				zDiv + 200,
				100 + noiseTime
			) * 0.5 + 0.5;

			obj.pos.x += Math.sin(noise1 * Math.PI * 2) * noiseVel * this.loader.dtN;
			obj.pos.y += Math.sin(noise2 * Math.PI * 2) * noiseVel * this.loader.dtN;
			obj.pos.z += Math.sin(noise3 * Math.PI * 2) * noiseVel * this.loader.dtN;

			if(obj.life > 0 ) {
				obj.life -= obj.decay * this.osc.val(this.ease.inOutExpo);
			}
			
			if(obj.life <= 0 || obj.firstRun) {
				obj.life = 2;
				obj.pos.x = this.calc.rand(-this.size / 2, this.size / 2);
				obj.pos.y = this.calc.rand(-this.size / 2, this.size / 2);
				obj.pos.z = this.calc.rand(-this.size / 2, this.size / 2);

				let hue = (this.loader.elapsedMs / 25 + this.calc.rand(60)) % 360 + 110;
				let lightness = Math.round(this.calc.rand(10, 50));
				this.color.set(`hsl(${hue}, 85%, ${lightness}%)`);

				obj.r = this.color.r;
				obj.g = this.color.g;
				obj.b = this.color.b;

				obj.firstRun = false;
			}

			obj.a = obj.life > 1 ? 2 - obj.life : obj.life;

			obj.size = this.calc.map(this.osc.val(this.ease.inOutExpo), 0, 1, obj.baseSize * 6, obj.baseSize * 1);
		}

		this.updateParticles(true, true, true);

		this.particleGroup.rotation.y += 0.005 + this.osc.val(this.ease.inOutExpo) * 0.04;
		this.particleGroup.position.z = 5 - this.osc.val(this.ease.inOutExpo) * 15;
	}

}

module.exports = System;
