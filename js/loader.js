const Calc = require('./utils/calc');
const Ease = require('./utils/ease');
const AxisHelper = require('./utils/axis');

class Loader {

	constructor(System) {
		this.calc = new Calc();
		this.ease = new Ease();

		this.dom = {
			html: document.documentElement,
			container: document.querySelector('.loader'),
			timescaleWrap: document.querySelector('.timescale-wrap'),
			timescaleRange: document.querySelector('.timescale-range'),
			timescaleValue: document.querySelector('.timescale-value'),
			replayButton: document.querySelector('.replay-animation'),
			debugButton: document.querySelector('.icon--debug')
		}

		this.dom.html.classList.add('loading');

		this.completed = false;
		this.raf = null;

		this.setupDebug();
		this.setupTime();
		this.setupScene();
		this.setupCamera();
		this.setupRenderer();
		this.setupControls();
		this.setupHelpers();
		this.listen();
		this.onResize();

		this.system = new System(this);
		this.loop();
	}

	setupDebug() {
		this.isDebug = location.hash.indexOf('debug') > 0;
		this.isGrid = location.hash.indexOf('grid') > 0;
		this.isOrbit = location.hash.indexOf('orbit') > 0;

		this.debugHash = '';

		if(this.isDebug) {
			this.isGrid = true;
			this.isOrbit = true;
			this.debugHash += 'debug';
			this.dom.html.classList.add('is-debug');
		} else {
			this.debugHash += this.isGrid ? 'grid' : '';
			this.debugHash += this.isOrbit ? 'orbit' : '';
		}

		if(this.debugHash) {
			[].slice.call(document.querySelectorAll('.demo')).forEach((elem, i, arr) => {
				elem.setAttribute('href', `${elem.getAttribute('href')}#${this.debugHash}`);
			});
		}
	}

	setupTime() {
		this.timescale = 1;
		this.clock = new THREE.Clock();
		this.deltaTimeSeconds = this.clock.getDelta() * this.timescale;
		this.deltaTimeMilliseconds = this.deltaTimeSeconds * 1000;
		this.deltaTimeNormal = this.deltaTimeMilliseconds / (1000 / 60);
		this.elapsedMilliseconds = 0;
	}

	setupScene() {
		this.scene = new THREE.Scene();
	}

	setupCamera() {
		this.camera = new THREE.PerspectiveCamera(100, 0, 0.0001, 10000);

		this.cameraBaseX = this.isGrid ? -20 : 0;
		this.cameraBaseY = this.isGrid ? 15 : 0;
		this.cameraBaseZ = this.isGrid ? 20 : 30;

		this.camera.position.x = this.cameraBaseX;
		this.camera.position.y = this.cameraBaseY;
		this.camera.position.z = this.cameraBaseZ;
	}

	setupRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true
		});

		this.dom.container.appendChild(this.renderer.domElement);
	}

	setupControls() {
		if(this.isOrbit) {
			this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
			this.controls.enableDamping = true;
			this.controls.dampingFactor = 0.2;
			this.controls.enableKeys = false;

			this.dom.timescaleWrap.style.visibility = 'visible';
		}
	}

	setupHelpers() {
		if(this.isGrid) {
			this.gridOpacityMap = [
				0.4, // 1
				0.2, // 2
				0.2, // 3
				0.2, // 4
				0.1, // 5
				0.2, // 6
				0.1, // 7
				0.1  // 8
			];
			this.gridHelper = new THREE.GridHelper(300, 60, 0xffffff, 0xffffff);
			this.gridHelper.material.transparent = true;
			this.gridHelper.material.opacity = this.gridOpacityMap[demoNum - 1];
			this.scene.add(this.gridHelper);

			this.axisOpacityMap = [
				1, // 1
				0.6, // 2
				0.6, // 3
				0.6, // 4
				0.3, // 5
				0.6, // 6
				0.3, // 7
				0.3  // 8
			];
			this.axisHelper = new AxisHelper(150, this.axisOpacityMap[demoNum - 1]);
			this.scene.add(this.axisHelper);

			this.camera.lookAt(new THREE.Vector3());
		}
	}

	update() {
		this.deltaTimeSeconds = this.clock.getDelta();
		if(this.diffTime) {
			this.deltaTimeSeconds -= this.diffTime;
			this.diffTime = 0;
		}
		this.deltaTimeSeconds *= this.timescale;
		this.deltaTimeMilliseconds = this.deltaTimeSeconds * 1000;
		this.deltaTimeNormal = this.deltaTimeMilliseconds / (1000 / 60);
		this.elapsedMilliseconds += this.deltaTimeMilliseconds;

		this.system.update();

		if(this.isOrbit) {
			this.controls.update();
		}
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	listen() {
		window.addEventListener('resize', (e) => this.onResize(e));

		this.dom.replayButton.addEventListener('click', (e) => this.onReplayButtonClick(e));
		this.dom.debugButton.addEventListener('click', (e) => this.onDebugButtonClick(e));

		if(this.isOrbit) {
			this.dom.timescaleRange.addEventListener('change', (e) => this.onTimescaleRangeChange(e));
			this.dom.timescaleRange.addEventListener('mousemove', (e) => this.onTimescaleRangeChange(e));
		}

		this.hidden = null;
		this.visibilityChange = null;
		if(typeof document.hidden !== 'undefined') {
			this.hidden = 'hidden';
			this.visibilityChange = 'visibilitychange';
		} else if(typeof document.msHidden !== 'undefined') {
			this.hidden = 'msHidden';
			this.visibilityChange = 'msvisibilitychange';
		} else if(typeof document.webkitHidden !== 'undefined') {
			this.hidden = 'webkitHidden';
			this.visibilityChange = 'webkitvisibilitychange';
		}
		if(typeof document.addEventListener === 'undefined' || typeof document.hidden === 'undefined') {
		} else {
			window.addEventListener(this.visibilityChange, (e) => this.onVisibilityChange(e));
		}
	}

	replay() {
		document.documentElement.classList.remove('completed');
		document.documentElement.classList.add('loading');

		this.camera.position.x = this.cameraBaseX;
		this.camera.position.y = this.cameraBaseY;
		this.camera.position.z = this.cameraBaseZ;

		this.timescale = 1;
		this.deltaTimeSeconds = 1 / 60;
		this.deltaTimeMilliseconds = this.deltaTimeSeconds * 1000;
		this.deltaTimeNormal = this.deltaTimeMilliseconds / (1000 / 60);
		this.elapsedMilliseconds = 0;
		this.blurTime = 0;
		this.diffTime = 0;
		this.focusTime = 0;

		this.system.replay();
		this.completed = false;
		this.clock.start();
		this.loop();
	}

	complete() {
		if(this.isOrbit || this.isGrid) {
			return;
		}
		setTimeout(() => {
			this.clock.stop();
			cancelAnimationFrame(this.raf);
		}, 600);
		this.completed = true;
		this.dom.html.classList.remove('loading');
		this.dom.html.classList.add('completed');
	}

	onResize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.dpr = window.devicePixelRatio > 1 ? 2 : 1

		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();

		this.renderer.setPixelRatio(this.dpr);
		this.renderer.setSize(this.width, this.height);
	}

	onReplayButtonClick(e) {
		e.preventDefault();
		this.replay();
	}

	onDebugButtonClick(e) {
		e.preventDefault();
		let baseURL = window.location.href.split('#')[0];
		if(this.isDebug) {
			if(history) {
				history.pushState('', document.title, window.location.pathname);
			} else {
				location.hash = '';
			}
			location.href = baseURL;
		} else {
			location.href = `${baseURL}#debug`;
		}
		location.reload();
	}

	onTimescaleRangeChange(e) {
		this.timescale = parseFloat(this.dom.timescaleRange.value);
		this.dom.timescaleValue.innerHTML = this.timescale.toFixed(1);
	}

	onVisibilityChange(e) {
		if(document.hidden) {
			this.blurTime = Date.now();
		} else {
			this.focusTime = Date.now();
			if(this.blurTime) {
				this.diffTime = (this.focusTime - this.blurTime) / 1000;
			}
		}
	}

	loop() {
		this.update();
		this.render();
		this.raf = window.requestAnimationFrame(() => this.loop());
	}

}

module.exports = Loader;
