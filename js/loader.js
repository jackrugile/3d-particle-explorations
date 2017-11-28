const Calc = require('./utils/calc');
const Ease = require('./utils/ease');
const Axis = require('./utils/axis');

class Loader {

	constructor(System) {
		this.calc = new Calc();
		this.ease = new Ease();

		this.container = document.querySelector('.loader');
		this.replayButton = document.querySelector('.replay-loader');
		this.width = null;
		this.height = null;
		this.completed = false;

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
		this.system = new System(this);

		document.documentElement.classList.add('loading');
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
		// this.camera = new THREE.PerspectiveCamera(45, 0, 0.0001, 10000);
		// this.camera.position.x = 0;
		// this.camera.position.y = 0;
		// this.camera.position.z = 100;

		this.camera = new THREE.PerspectiveCamera(75, 0, 0.0001, 10000);
		this.cameraBaseX = 0;
		this.cameraBaseY = 0;
		this.cameraBaseZ = 50;
		this.camera.position.x = this.cameraBaseX;
		this.camera.position.y = this.cameraBaseY;
		this.camera.position.z = this.cameraBaseZ;
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
			this.controls.enableDamping = true;
			this.controls.dampingFactor = 0.1;
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
		window.addEventListener('resize', (e) => this.onResize(e));
		this.replayButton.addEventListener('click', (e) => this.onReplayButtonClick(e));
	}

	replay() {
		document.documentElement.classList.remove('completed');
		document.documentElement.classList.add('loading');
		this.camera.position.x = this.cameraBaseX;
		this.camera.position.y = this.cameraBaseY;
		this.camera.position.z = this.cameraBaseZ;
		this.elapsedMs = 0;
		this.system.replay();
		setTimeout(() => {
			this.completed = false;
			this.clock.start();
			MainLoop.resetFrameDelta();
			MainLoop.start();
		}, 600);
	}

	complete() {
		if(this.isOrbit) {
			return;
		}
		this.clock.stop();
		MainLoop.stop();
		this.completed = true;
		document.documentElement.classList.remove('loading');
		document.documentElement.classList.add('completed');
	}

	onResize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();

		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.width, this.height);
	}

	onReplayButtonClick(e) {
		e.preventDefault();
		this.replay();
	}

}

module.exports = Loader;

//let loader = new PL.Loader();
