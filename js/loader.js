PL.Loader = class {

	constructor() {
		this.calc = new PL.Calc();
		this.ease = new PL.Ease();

		this.container = document.querySelector('.loader');
		this.width = null;
		this.height = null;

		this.isGrid = location.hash.indexOf('grid') > 0;
		this.isGridDark = location.hash.indexOf('dark') > 0
		this.isOrbit = location.hash.indexOf('orbit') > 0;

		this.setupTime();
		this.setupScene();
		this.setupCamera();
		this.setupRenderer();
		this.setupControls();
		this.setupHelpers();

		this.listen();
		this.onResize();
		this.setupSystem();
		MainLoop
			.setUpdate((delta) => this.update(delta))
			.setDraw(() => this.render())
			.setEnd((fps, panic) => this.end(fps, panic))
			.start();
	}

	setupTime() {
		this.clock = new THREE.Clock();
		this.dtS = this.clock.getDelta();
		this.dtMs = this.dtS * 1000;
		this.dtN = this.dtMs / (1000 / 60);
		this.elapsedMs = 0;
	}

	setupScene() {
		this.scene = new THREE.Scene();
	}

	setupCamera() {
		this.camera = new THREE.PerspectiveCamera(45, 0, 0.0001, 10000);
		this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 100;
		if(this.isOrbit) {
			this.camera.position.x = -100;
			this.camera.position.y = 50;
			this.camera.position.z = 100;
		}
	}

	setupRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true
		});
		this.container.appendChild(this.renderer.domElement);
	}

	setupControls() {
		if(this.isOrbit) {
			this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		}
	}

	setupHelpers() {
		if(this.isGrid) {
			let color = this.isGridDark ? 0x000000 : 0xffffff
			this.gridHelper = new THREE.GridHelper(1000, 100, color, color);
			this.gridHelper.material.transparent = true;
			this.gridHelper.material.opacity = this.isGridDark ? 0.15 : 0.25;
			this.scene.add(this.gridHelper);

			this.axisHelper = new PL.AxisHelper(500, 0.5);
			this.scene.add(this.axisHelper);
		}
	}

	setupSystem() {
		this.system = new PL.System(this);
	}

	update() {
		this.dtS = this.clock.getDelta();
		this.dtMs = this.dtS * 1000;
		this.dtN = this.dtMs / (1000 / 60);
		this.elapsedMs += this.dtMs;

		this.system.update();

		if(this.isOrbit) {
			this.controls.update();
		}
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	end(fps, panic) {
		if(panic) {
			MainLoop.resetFrameDelta();
		}
	}

	listen() {
		window.addEventListener('resize', this.onResize.bind(this));
	}

	onResize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();

		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.width, this.height);
	}

}

let loader = new PL.Loader();
