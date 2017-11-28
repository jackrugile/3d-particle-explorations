PL.System = class extends PL.SystemBase {

	constructor(loader) {
		super(loader);

		this.texture = new THREE.TextureLoader().load('/images/circle.png');
		//this.texture = new THREE.TextureLoader().load('./images/orb.png');
		this.geometry = new THREE.BufferGeometry();
		this.objs = [];

		this.rings = 8;
		this.radius = 0;
		this.radiusGrowth = 1.5;
		this.duration = 3500;

		for(let i = 0; i < this.rings; i++) {
			let count = i === 0 ? 1 : 1 + Math.ceil(i * 6);

			for(let j = 0; j < count; j++) {
				let angle = (j / count) * Math.PI * 2;
				let x = Math.cos(angle) * this.radius;
				let y = Math.sin(angle) * this.radius;
				let z = 0;
				let size = this.calc.map(i, 0, this.rings, 0.2, 0.05);

				this.objs.push({
					group: this.particleGroup,
					pos: new THREE.Vector3(
						x,
						y,
						z
					),
					r: 1,
					g: 1,
					b: 1,
					a: 1,
					size: size,
					radius: this.radius,
					angle: angle,
					color: 0xffffff,
					baseAngle: angle,
					baseX: x,
					baseY: y,
					baseZ: z,
					baseRadius: this.radius,
					baseSize: size
				});
			}

			this.radius += this.radiusGrowth;
		}

		this.count = this.objs.length;

		this.positions = new Float32Array(this.count * 3);
		this.colors = new Float32Array(this.count * 4);
		this.sizes = new Float32Array(this.count);

		this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
		this.geometry.addAttribute('color', new THREE.BufferAttribute(this.colors, 4));
		this.geometry.addAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

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

		let i = this.count;
		while(i--) {
			let obj = this.objs[i];

			obj.angle -= this.loader.dtN * Math.cos(this.loader.elapsedMs * 0.0025 - obj.baseRadius * 0.15) * 0.02;

			obj.pos.x = Math.cos(obj.angle) * obj.baseRadius;
			obj.pos.y = Math.sin(obj.angle) * obj.baseRadius;
			obj.pos.z = Math.cos(this.loader.elapsedMs * 0.005 - obj.baseRadius * 0.3) * 10;

			let freeScale = Math.cos(this.loader.elapsedMs * 0.005 - obj.baseRadius * 0.6);
			let lockScale = this.calc.clamp(freeScale, 0, 1);
			let scale = obj.baseSize + lockScale * 0.2;
			obj.size = (obj.baseSize + lockScale * 0.2) * 7;
			//this.mesh.scale.set(scale, scale, scale);
		}

		this.updateSizes();
		this.updateColors();
		this.updatePositions();
	}

}
