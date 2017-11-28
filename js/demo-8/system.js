PL.System = class extends PL.SystemBase {

	constructor(loader) {
		super(loader);

		this.simplex = new SimplexNoise();

		//this.duration = 3500;

		this.osc1 = new PL.Osc(0, 0.02, true, false);
		this.color = new THREE.Color();

		//this.texture = new THREE.TextureLoader().load('/images/circle.png');
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

		this.updateColors();
		this.updateSizes();
		this.updatePositions();
	}

	createMesh() {

	}

	updateColors() {
		let i = this.count;
		while(i--) {
			let obj = this.objs[i];
			this.colors[i * 4 + 0] = obj.r;
			this.colors[i * 4 + 1] = obj.g;
			this.colors[i * 4 + 2] = obj.b;
			this.colors[i * 4 + 3] = obj.a;
		}
		this.geometry.attributes.color.needsUpdate = true;
	}

	updateSizes() {
		let i = this.count;
		while(i--) {
			let obj = this.objs[i];
			this.sizes[i] = obj.size;
		}
		this.geometry.attributes.size.needsUpdate = true;
	}

	updatePositions() {
		let i = this.count;
		while(i--) {
			let obj = this.objs[i];
			this.positions[i * 3 + 0] = obj.pos.x;
			this.positions[i * 3 + 1] = obj.pos.y;
			this.positions[i * 3 + 2] = obj.pos.z;
		}
		this.geometry.attributes.position.needsUpdate = true;
	}

	update() {
		super.update();

		this.osc1.update();

		// if(this.exiting && !this.loader.isOrbit) {
		// 	this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProg, 0, 1, 1) * this.loader.cameraBaseZ;
		// }

		let i = this.count;

		let noiseDiv = 10;//this.calc.map(this.osc1.val(1 - this.ease.inOutExpo), 0, 1, 5, 10);
		let noiseTime = this.loader.elapsedMs * 0.0008;
		//let noiseTime = this.loader.elapsedMs * this.calc.map(this.osc1.val(this.ease.inOutExpo), 0, 1, 0.0004, 0.0006);
		let noiseVel = this.calc.map(this.osc1.val(this.ease.inOutExpo), 0, 1, 0.05, 1);

		while(i--) {
			let obj = this.objs[i];

			let xDiv = obj.pos.x / noiseDiv;
			let yDiv = obj.pos.y / noiseDiv;
			let zDiv = obj.pos.z / noiseDiv;

			let noise1 = this.simplex.noise4D(
				xDiv,
				yDiv,
				zDiv,
				noiseTime
			) * 0.5 + 0.5;
			let noise2 = this.simplex.noise4D(
				xDiv + 100,
				yDiv + 100,
				zDiv + 100,
				50 + noiseTime
			) * 0.5 + 0.5;
			let noise3 = this.simplex.noise4D(
				xDiv + 200,
				yDiv + 200,
				zDiv + 200,
				100 + noiseTime
			) * 0.5 + 0.5;

			obj.pos.x += Math.sin(noise1 * Math.PI * 2) * noiseVel * this.loader.dtN;
			obj.pos.y += Math.sin(noise2 * Math.PI * 2) * noiseVel * this.loader.dtN;
			obj.pos.z += Math.sin(noise3 * Math.PI * 2) * noiseVel * this.loader.dtN;

			if(obj.life > 0 ) {
				obj.life -= obj.decay * this.osc1.val(this.ease.inOutExpo);
			}
			if(obj.life <= 0 || obj.firstRun) {
				obj.life = 2;
				obj.pos.x = this.calc.rand(-this.size / 2, this.size / 2);
				obj.pos.y = this.calc.rand(-this.size / 2, this.size / 2);
				obj.pos.z = this.calc.rand(-this.size / 2, this.size / 2);

				let hue = (this.loader.elapsedMs / 10) % 360 + this.calc.rand(90);
				let lightness = Math.round(this.calc.rand(10, 50));
				this.color.set(`hsl(${hue}, 85%, ${lightness}%)`);

				obj.r = this.color.r;
				obj.g = this.color.g;
				obj.b = this.color.b;

				obj.firstRun = false;
			}

			obj.a = obj.life > 1 ? 2 - obj.life : obj.life;

			obj.size = this.calc.map(this.osc1.val(this.ease.inOutQuad), 0, 1, obj.baseSize * 6, obj.baseSize * 1);

			this.positions[i * 3 + 0] = obj.pos.x;
			this.positions[i * 3 + 1] = obj.pos.y;
			this.positions[i * 3 + 2] = obj.pos.z;
		}

		this.geometry.attributes.position.needsUpdate = true;

		this.updateSizes();
		this.updateColors();

		this.particleGroup.rotation.y += 0.003 + this.osc1.val(this.ease.inOutExpo) * 0.04;
		this.particleGroup.position.z = 5 - this.osc1.val(this.ease.inOutExpo) * 15;
		//let scale = 1 - this.osc1.val(this.ease.inOutExpo) * 0.5;
		//this.particleGroup.scale.set(scale, scale, scale);
	}

}
