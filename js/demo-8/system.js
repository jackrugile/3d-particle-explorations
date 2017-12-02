const SystemBase = require('../system-base');
const Osc = require('../utils/osc');

class System extends SystemBase {

	constructor(loader) {
		super(loader);

		this.duration = 9300;
		this.simplex = new FastSimplexNoise();
		this.color = new THREE.Color();

		this.texture = this.generateTexture();
		this.size = 10;
		this.scale = 1;
		this.base = 20;
		this.count = this.base * this.base * this.base;
		this.geometry = new THREE.BufferGeometry();
		this.parts = [];

		this.positions = new Float32Array(this.count * 3);
		this.colors = new Float32Array(this.count * 4);
		this.sizes = new Float32Array(this.count);

		this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
		this.geometry.addAttribute('color', new THREE.BufferAttribute(this.colors, 4));
		this.geometry.addAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

		for(let i = 0; i < this.count; i++) {
			let size = this.calc.rand(0.1, 0.8);
			this.parts.push({
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

		this.updateParticleAttributes(true, true, true);

		this.reset();
	}

	reset() {
		this.osc = new Osc(0, 0.015, true, false);
	}

	generateTexture() {
		let c = document.createElement('canvas');
		let ctx = c.getContext('2d');
		let size = 64;
		c.width = size;
		c.height = size;

		let gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
		gradient.addColorStop(0, 'hsla(0, 0%, 100%, 1)');
		gradient.addColorStop(1, 'hsla(0, 0%, 100%, 0)');

		ctx.beginPath();
		ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
		ctx.fillStyle = gradient;
		ctx.fill();

		let texture = new THREE.Texture(c);
		texture.needsUpdate = true;

		return texture;
	}

	updateParticleAttributes(color, position, size) {
		let i = this.count;
		while(i--) {
			let part = this.parts[i];
			if(color) {
				this.colors[i * 4 + 0] = part.r;
				this.colors[i * 4 + 1] = part.g;
				this.colors[i * 4 + 2] = part.b;
				this.colors[i * 4 + 3] = part.a;
			}
			if(position) {
				this.positions[i * 3 + 0] = part.pos.x;
				this.positions[i * 3 + 1] = part.pos.y;
				this.positions[i * 3 + 2] = part.pos.z;
			}
			if(size) {
				this.sizes[i] = part.size;
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
		this.oscEased = this.osc.val(this.ease.inOutExpo);

		if(this.exiting && !this.loader.isOrbit && !this.loader.isGrid) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProg, 0, 1, 1) * this.loader.cameraBaseZ;
		}

		let i = this.count;

		let noiseDiv = 10;
		let noiseTime = this.loader.elapsedMs * 0.0008;
		let noiseVel = this.calc.map(this.oscEased, 0, 1, 0, 1);

		while(i--) {
			let part = this.parts[i];

			let xDiv = part.pos.x / noiseDiv;
			let yDiv = part.pos.y / noiseDiv;
			let zDiv = part.pos.z / noiseDiv;

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

			part.pos.x += Math.sin(noise1 * Math.PI * 2) * noiseVel * this.loader.dtN;
			part.pos.y += Math.sin(noise2 * Math.PI * 2) * noiseVel * this.loader.dtN;
			part.pos.z += Math.sin(noise3 * Math.PI * 2) * noiseVel * this.loader.dtN;

			if(part.life > 0 ) {
				part.life -= part.decay * this.oscEased;
			}
			
			if(part.life <= 0 || part.firstRun) {
				part.life = 2;
				part.pos.x = this.calc.rand(-this.size / 2, this.size / 2);
				part.pos.y = this.calc.rand(-this.size / 2, this.size / 2);
				part.pos.z = this.calc.rand(-this.size / 2, this.size / 2);

				let hue = (this.loader.elapsedMs / 25 + this.calc.rand(60)) % 360 + 110;
				let lightness = Math.round(this.calc.rand(10, 50));
				this.color.set(`hsl(${hue}, 85%, ${lightness}%)`);

				part.r = this.color.r;
				part.g = this.color.g;
				part.b = this.color.b;

				part.firstRun = false;
			}

			part.a = part.life > 1 ? 2 - part.life : part.life;

			part.size = this.calc.map(this.oscEased, 0, 1, part.baseSize * 4, part.baseSize * 1);
		}

		this.updateParticleAttributes(true, true, true);

		this.particleGroup.rotation.y += 0.005 + this.oscEased * 0.04;
		this.particleGroup.position.z = 5 - this.oscEased * 15;
	}

}

module.exports = System;
