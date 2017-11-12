PL.Loader = function() {

	this.calc = new PL.Calc();

	this.container = document.querySelector('.loader');
	this.width = null;
	this.height = null;
	this.rAF = null;

	this.isGrid = location.hash.indexOf('grid') > 0;
	this.isGridDark = location.hash.indexOf('dark') > 0
	this.isOrbit = location.hash.indexOf('orbit') > 0;

	this.setupTime = function() {
		this.clock = new THREE.Clock();
		this.elapsed = this.clock.getElapsedTime();
		this.elapsedMs = 0;
		this.dt = this.clock.getDelta();
		this.dtn = this.dt * 1000;
	}

	this.setupScene = function() {
		this.scene = new THREE.Scene();
	}

	this.setupCamera = function() {
		this.camera = new THREE.PerspectiveCamera(45, 0, 0.1, 10000);
		this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 300;
	}

	this.setupRenderer = function() {
		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true
		});
		this.container.appendChild(this.renderer.domElement);
	}

	this.setupControls = function() {
		if(this.isOrbit) {
			this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		}
	}

	this.setupHelpers = function() {
		if(this.isGrid) {
			var color = this.isGridDark ? 0x000000 : 0xffffff
			this.gridHelper = new THREE.GridHelper(1000, 100, color, color);
			this.gridHelper.material.transparent = true;
			this.gridHelper.material.opacity = this.isGridDark ? 0.15 : 0.25;
			this.scene.add(this.gridHelper);

			this.axisHelper = new PL.AxisHelper(500, 0.5);
			this.scene.add(this.axisHelper);
		}
	}

	this.setupSystem = function() {
		this.system = new PL.System(this);
	}

	this.update = function() {
		this.elapsed = this.clock.getElapsedTime();
		this.elapsedMs = this.elapsed * 1000;
		this.dt = this.clock.getDelta();
		this.dtn = 1 + this.dt * 1000 * 60;

		this.system.update();

		if(this.isOrbit) {
			this.controls.update();
		}
	}

	this.render = function() {
		this.renderer.render(this.scene, this.camera);
	}

	this.listen = function() {
		window.addEventListener('resize', this.onResize.bind(this));
	}

	this.onResize = function() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();

		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.width, this.height);
	}

	this.loop = function() {
		this.rAF = requestAnimationFrame(this.loop.bind(this));
		this.update();
		this.render();
	}

	this.setupTime();
	this.setupScene();
	this.setupCamera();
	this.setupRenderer();
	this.setupControls();
	this.setupHelpers();

	this.listen();
	this.onResize();
	this.setupSystem();
	this.loop();

}
