(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Drop = function () {
	function Drop(config, system, loader) {
		_classCallCheck(this, Drop);

		this.system = system;
		this.loader = loader;

		this.calc = this.loader.calc;
		this.ease = this.loader.ease;

		this.array = config.array;
		this.group = config.group;
		this.x = config.x;
		this.y = config.y;
		this.z = config.z;
		this.size = config.size;
		this.color = config.color;
		this.opacity = config.opacity;

		this.baseX = config.x;
		this.baseY = config.y;
		this.baseZ = config.z;

		this.prog = 0;
		this.rate = 0.015;

		this.createMesh();
	}

	_createClass(Drop, [{
		key: 'createMesh',
		value: function createMesh() {
			this.geometry = this.system.boxGeometry;

			this.material = new THREE.MeshBasicMaterial({
				color: this.color,
				transparent: true,
				opacity: this.opacity,
				depthTest: false,
				precision: 'lowp',
				side: THREE.DoubleSide
			});

			this.mesh = new THREE.Mesh(this.geometry, this.material);

			this.mesh.position.x = this.x;
			this.mesh.position.y = this.y;
			this.mesh.position.z = this.z;

			this.mesh.scale.set(this.size, this.size, this.size);

			this.group.add(this.mesh);
		}
	}, {
		key: 'update',
		value: function update(i) {
			// ease
			this.prog += this.rate;
			this.mesh.position.y = this.baseY - this.ease.inExpo(this.prog, 0, 1, 1) * this.baseY;
			this.mesh.scale.set(this.size, this.size + this.size * 16 * this.ease.inExpo(this.prog, 0, 1, 1), this.size);
			this.mesh.material.opacity = this.ease.inExpo(this.prog, 0, 1, 1);

			if (this.prog > 1) {
				this.array.splice(i, 1);
				this.group.remove(this.mesh);
				this.system.createRipple(this.mesh.position.x, this.mesh.position.z);
			}
		}
	}]);

	return Drop;
}();

module.exports = Drop;

},{}],2:[function(require,module,exports){
'use strict';

var Loader = require('../loader');
var System = require('./system');

var loader = new Loader(System);

},{"../loader":6,"./system":5}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ParticleBase = require('../particle-base');

var Particle = function (_ParticleBase) {
	_inherits(Particle, _ParticleBase);

	function Particle(config, system, loader) {
		_classCallCheck(this, Particle);

		var _this = _possibleConstructorReturn(this, (Particle.__proto__ || Object.getPrototypeOf(Particle)).call(this, config, system, loader));

		_this.baseX = config.x;
		_this.baseY = config.y;
		_this.baseZ = config.z;
		_this.base = new THREE.Vector3(config.x, config.y, config.z);

		_this.lerpFactor = 0.25;
		_this.dampFactor = 0.25;

		_this.velocity = new THREE.Vector3(0, 0, 0);
		return _this;
	}

	_createClass(Particle, [{
		key: 'update',
		value: function update() {
			var scale = 0.075 + Math.abs(this.velocity.y) / 25;
			this.mesh.scale.set(scale, scale, scale);

			var opacity = 0.15 + Math.abs(this.velocity.y) / 1;
			this.mesh.material.opacity = this.calc.clamp(opacity, 0.15, 1);

			this.velocity.y += (this.base.y - this.mesh.position.y) * this.lerpFactor;
			this.velocity.multiplyScalar(this.dampFactor);
			this.mesh.position.add(this.velocity);
		}
	}]);

	return Particle;
}(ParticleBase);

module.exports = Particle;

},{"../particle-base":7}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ripple = function () {
	function Ripple(config, system, loader) {
		_classCallCheck(this, Ripple);

		this.system = system;
		this.loader = loader;

		this.calc = this.loader.calc;
		this.ease = this.loader.ease;

		this.array = config.array;
		this.group = config.group;
		this.sphere = new THREE.Sphere(new THREE.Vector3(config.x, config.y, config.z), 0);
		this.strength = this.calc.rand(4, 8);
		this.threshold = this.calc.rand(4, 8);
		this.growth = this.calc.rand(0.1, 0.3);
		this.life = 1;
		this.decay = this.calc.rand(0.01, 0.02);
		this.influence = new THREE.Vector3();

		// CIRCLE
		this.geometry = new THREE.CircleGeometry(1, 36);
		this.geometry.vertices.shift();
		this.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));

		this.material = new THREE.LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 1,
			depthTest: false,
			precision: 'lowp'
		});
		this.mesh = new THREE.LineLoop(this.geometry, this.material);
		this.mesh.position.x = this.sphere.center.x;
		this.mesh.position.y = 0;
		this.mesh.position.z = this.sphere.center.z;
		this.group.add(this.mesh);
	}

	_createClass(Ripple, [{
		key: 'getInfluenceVector',
		value: function getInfluenceVector(vec) {
			this.influence.set(0, 0, 0);
			var distance = this.sphere.distanceToPoint(vec);

			if (distance <= this.threshold) {
				var ease = this.ease.inOutSine(this.threshold - distance, 0, 1, this.threshold);
				var power = this.strength * ease * this.life;
				this.influence.addVectors(vec, this.sphere.center).multiplyScalar(power);
			}

			return this.influence;
		}
	}, {
		key: 'update',
		value: function update(i) {
			this.sphere.radius += this.growth * this.life;
			this.life -= this.decay;

			// CIRCLE
			this.mesh.position.y = (1 - this.life) * -2;
			var newScale = 0.001 + this.sphere.radius;
			this.mesh.scale.set(newScale, newScale, newScale);
			this.mesh.material.opacity = this.life / 3;

			if (this.life <= 0) {
				this.destroy(i);
			}
		}
	}, {
		key: 'destroy',
		value: function destroy(i) {
			// CIRCLE
			this.loader.scene.remove(this.mesh);

			this.array.splice(i, 1);
		}
	}]);

	return Ripple;
}();

module.exports = Ripple;

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SystemBase = require('../system-base');
var Particle = require('./particle');
var Ripple = require('./ripple');
var Drop = require('./drop');

var System = function (_SystemBase) {
	_inherits(System, _SystemBase);

	function System(loader) {
		_classCallCheck(this, System);

		var _this = _possibleConstructorReturn(this, (System.__proto__ || Object.getPrototypeOf(System)).call(this, loader));

		_this.duration = 6000;

		_this.size = 35;
		_this.cols = 25;
		_this.rows = 25;

		_this.drops = [];
		_this.ripples = [];
		_this.tick = 0;

		if (!_this.grid) {
			_this.loader.camera.position.y = 20;
			_this.loader.camera.lookAt(new THREE.Vector3());
		}

		for (var col = 0; col < _this.cols; col++) {
			for (var row = 0; row < _this.rows; row++) {
				var x = _this.calc.map(col, 0, _this.cols - 1, -_this.size / 2, _this.size / 2);
				var y = 0;
				var z = _this.calc.map(row, 0, _this.rows - 1, -_this.size / 2, _this.size / 2);

				_this.particles.push(new Particle({
					group: _this.particleGroup,
					x: x,
					y: y,
					z: z,
					size: 0.01,
					color: 0xffffff,
					opacity: 0.01
				}, _this, _this.loader));
			}
		}

		//this.particleGroup.rotation.x = Math.PI * -0.4;
		//this.particleGroup.rotation.z = Math.PI * 0.25;
		return _this;
	}

	_createClass(System, [{
		key: 'createDrop',
		value: function createDrop() {
			this.drops.push(new Drop({
				array: this.drops,
				group: this.particleGroup,
				x: this.calc.rand(-this.size / 2, this.size / 2),
				y: this.calc.rand(15, 20),
				z: this.calc.rand(-this.size / 2, this.size / 2),
				size: 0.1,
				color: 0xffffff,
				opacity: 0
			}, this, this.loader));
		}
	}, {
		key: 'updateDrops',
		value: function updateDrops() {
			var i = this.drops.length;
			while (i--) {
				this.drops[i].update(i);
			}
		}
	}, {
		key: 'createRipple',
		value: function createRipple(x, z) {
			this.ripples.push(new Ripple({
				array: this.ripples,
				group: this.particleGroup,
				x: x,
				y: -0.1,
				z: z
			}, this, this.loader));
		}
	}, {
		key: 'updateRipples',
		value: function updateRipples() {
			var i = this.ripples.length;
			while (i--) {
				this.ripples[i].update(i);
			}
		}
	}, {
		key: 'update',
		value: function update() {
			_get(System.prototype.__proto__ || Object.getPrototypeOf(System.prototype), 'update', this).call(this);

			if (this.tick % 20 === 0) {
				this.createDrop();
			}

			this.updateDrops();
			this.updateRipples();

			var i = this.particles.length;
			while (i--) {
				var j = this.ripples.length;
				while (j--) {
					var particle = this.particles[i];
					var ripple = this.ripples[j];
					var influence = ripple.getInfluenceVector(particle.base);
					influence.setX(0);
					influence.setZ(0);
					particle.velocity.add(influence);
				}
			}

			// this.particleGroup.rotation.y = this.loader.elapsedMs * 0.00025;

			this.particleGroup.rotation.x = Math.cos(this.loader.elapsedMs * 0.0005) * 0.1;
			this.particleGroup.rotation.y = Math.PI * 0.25 + Math.sin(this.loader.elapsedMs * 0.0005) * -0.2;

			if (this.exiting && !this.loader.isOrbit && !this.loader.isGrid) {
				this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProg, 0, 1, 1) * this.loader.cameraBaseZ;
			}

			this.tick++;
		}
	}]);

	return System;
}(SystemBase);

module.exports = System;

},{"../system-base":8,"./drop":1,"./particle":3,"./ripple":4}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Calc = require('./utils/calc');
var Ease = require('./utils/ease');
var AxisHelper = require('./utils/axis');

var Loader = function () {
	function Loader(System) {
		var _this = this;

		_classCallCheck(this, Loader);

		this.calc = new Calc();
		this.ease = new Ease();

		this.container = document.querySelector('.loader');
		this.replayButton = document.querySelector('.replay-loader');
		this.width = null;
		this.height = null;
		this.completed = false;

		this.isDebug = location.hash.indexOf('debug') > 0;
		this.isGrid = location.hash.indexOf('grid') > 0;
		this.isGridDark = location.hash.indexOf('dark') > 0;
		this.isOrbit = location.hash.indexOf('orbit') > 0;

		this.debugHash = '';
		if (this.isDebug) {
			this.isGrid = true;
			this.isOrbit = true;
			this.debugHash += 'debug';
		} else {
			this.debugHash += this.isGrid ? 'grid' : '';
			this.debugHash += this.isGridDark ? 'dark' : '';
			this.debugHash += this.isOrbit ? 'orbit' : '';
		}
		if (this.debugHash) {
			[].slice.call(document.querySelectorAll('.demo')).forEach(function (elem, i, arr) {
				elem.setAttribute('href', elem.getAttribute('href') + '#' + _this.debugHash);
			});
		}

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
		MainLoop.setUpdate(function (delta) {
			return _this.update(delta);
		}).setDraw(function () {
			return _this.render();
		}).setEnd(function (fps, panic) {
			return _this.end(fps, panic);
		}).start();
	}

	_createClass(Loader, [{
		key: 'setupTime',
		value: function setupTime() {
			this.clock = new THREE.Clock();
			this.dtS = this.clock.getDelta();
			this.dtMs = this.dtS * 1000;
			this.dtN = this.dtMs / (1000 / 60);
			this.elapsedMs = 0;
		}
	}, {
		key: 'setupScene',
		value: function setupScene() {
			this.scene = new THREE.Scene();
		}
	}, {
		key: 'setupCamera',
		value: function setupCamera() {
			this.camera = new THREE.PerspectiveCamera(75, 0, 0.0001, 10000);
			this.cameraBaseX = this.isGrid ? -40 : 0;
			this.cameraBaseY = this.isGrid ? 20 : 0;
			this.cameraBaseZ = this.isGrid ? 40 : 50;

			this.camera.position.x = this.cameraBaseX;
			this.camera.position.y = this.cameraBaseY;
			this.camera.position.z = this.cameraBaseZ;
		}
	}, {
		key: 'setupRenderer',
		value: function setupRenderer() {
			this.renderer = new THREE.WebGLRenderer({
				alpha: true,
				antialias: true
			});
			this.container.appendChild(this.renderer.domElement);
		}
	}, {
		key: 'setupControls',
		value: function setupControls() {
			if (this.isOrbit) {
				this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
				this.controls.enableDamping = true;
				this.controls.dampingFactor = 0.25;
				this.controls.enableKeys = false;
			}
		}
	}, {
		key: 'setupHelpers',
		value: function setupHelpers() {
			if (this.isGrid) {
				var color = this.isGridDark ? 0x000000 : 0xffffff;
				this.gridHelper = new THREE.GridHelper(300, 30, color, color);
				this.gridHelper.material.transparent = true;
				this.gridHelper.material.opacity = this.isGridDark ? 0.15 : 0.25;
				this.scene.add(this.gridHelper);

				this.axisHelper = new AxisHelper(150, 0.5);
				this.scene.add(this.axisHelper);

				this.camera.lookAt(new THREE.Vector3());
			}
		}
	}, {
		key: 'update',
		value: function update() {
			this.dtS = this.clock.getDelta();
			this.dtMs = this.dtS * 1000;
			this.dtN = this.dtMs / (1000 / 60);
			this.elapsedMs += this.dtMs;

			this.system.update();

			if (this.isOrbit) {
				this.controls.update();
			}
		}
	}, {
		key: 'render',
		value: function render() {
			this.renderer.render(this.scene, this.camera);
		}
	}, {
		key: 'end',
		value: function end(fps, panic) {
			if (panic) {
				MainLoop.resetFrameDelta();
			}
		}
	}, {
		key: 'listen',
		value: function listen() {
			var _this2 = this;

			window.addEventListener('resize', function (e) {
				return _this2.onResize(e);
			});
			this.replayButton.addEventListener('click', function (e) {
				return _this2.onReplayButtonClick(e);
			});
		}
	}, {
		key: 'replay',
		value: function replay() {
			var _this3 = this;

			document.documentElement.classList.remove('completed');
			document.documentElement.classList.add('loading');
			this.camera.position.x = this.cameraBaseX;
			this.camera.position.y = this.cameraBaseY;
			this.camera.position.z = this.cameraBaseZ;
			this.elapsedMs = 0;
			this.system.replay();
			setTimeout(function () {
				_this3.completed = false;
				_this3.clock.start();
				MainLoop.resetFrameDelta();
				MainLoop.start();
			}, 600);
		}
	}, {
		key: 'complete',
		value: function complete() {
			if (this.isOrbit || this.isGrid) {
				return;
			}
			this.clock.stop();
			MainLoop.stop();
			this.completed = true;
			document.documentElement.classList.remove('loading');
			document.documentElement.classList.add('completed');
		}
	}, {
		key: 'onResize',
		value: function onResize() {
			this.width = window.innerWidth;
			this.height = window.innerHeight;
			this.dpr = window.devicePixelRatio > 1 ? 2 : 1;

			this.camera.aspect = this.width / this.height;
			this.camera.updateProjectionMatrix();

			this.renderer.setPixelRatio(this.dpr);
			this.renderer.setSize(this.width, this.height);
		}
	}, {
		key: 'onReplayButtonClick',
		value: function onReplayButtonClick(e) {
			e.preventDefault();
			this.replay();
		}
	}]);

	return Loader;
}();

module.exports = Loader;

},{"./utils/axis":9,"./utils/calc":10,"./utils/ease":11}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParticleBase = function () {
	function ParticleBase(config, system, loader) {
		_classCallCheck(this, ParticleBase);

		this.system = system;
		this.loader = loader;

		this.calc = this.loader.calc;
		this.ease = this.loader.ease;

		this.group = config.group;
		this.x = config.x;
		this.y = config.y;
		this.z = config.z;
		this.size = config.size;
		this.color = config.color;
		this.opacity = config.opacity;

		this.createMesh();
	}

	_createClass(ParticleBase, [{
		key: 'createMesh',
		value: function createMesh() {
			this.geometry = this.system.sphereGeometry;

			this.material = new THREE.MeshBasicMaterial({
				color: this.color,
				transparent: true,
				opacity: this.opacity,
				depthTest: false,
				precision: 'lowp',
				side: THREE.DoubleSide
			});

			this.mesh = new THREE.Mesh(this.geometry, this.material);

			this.mesh.position.x = this.x;
			this.mesh.position.y = this.y;
			this.mesh.position.z = this.z;

			this.mesh.scale.set(this.size, this.size, this.size);

			this.group.add(this.mesh);
		}
	}, {
		key: 'reset',
		value: function reset() {}
	}]);

	return ParticleBase;
}();

module.exports = ParticleBase;

},{}],8:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SystemBase = function () {
	function SystemBase(loader) {
		_classCallCheck(this, SystemBase);

		this.loader = loader;

		this.calc = this.loader.calc;
		this.ease = this.loader.ease;

		this.sphereGeometry = new THREE.SphereBufferGeometry(1, 12, 12);
		this.boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);

		this.particles = [];
		this.particleGroup = new THREE.Object3D();

		this.loader.scene.add(this.particleGroup);

		this.entering = true;
		this.enterProg = 0;
		this.enterRate = 0.015;

		this.exiting = false;
		this.exitProg = 0;
		this.exitRate = 0.01;
		this.duration = Infinity;
	}

	_createClass(SystemBase, [{
		key: "update",
		value: function update() {
			var i = this.particles.length;
			while (i--) {
				this.particles[i].update();
			}

			if (this.entering && this.enterProg < 1) {
				this.enterProg += this.enterRate;
				if (this.enterProg > 1) {
					this.enterProg = 1;
					this.entering = false;
				}
				var scale = this.ease.inOutExpo(this.enterProg, 0, 1, 1);
				this.particleGroup.scale.set(scale, scale, scale);
			}

			if (!this.exiting && this.loader.elapsedMs > this.duration) {
				this.exiting = true;
			}

			if (this.exiting) {
				this.exitProg += this.exitRate;
				if (this.exitProg >= 1 && !this.loader.completed) {
					this.exitProg = 1;
					this.loader.complete();
				}
			}
		}
	}, {
		key: "replay",
		value: function replay() {
			this.particleGroup.scale.set(0.0001, 0.0001, 0.0001);

			var i = this.particles.length;
			while (i--) {
				this.particles[i].reset();
			}

			this.entering = true;
			this.enterProg = 0;

			this.exiting = false;
			this.exitProg = 0;

			if (this.osc) {
				this.osc.reset();
			}
		}
	}]);

	return SystemBase;
}();

module.exports = SystemBase;

},{}],9:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AxisHelper = function () {
	function AxisHelper(axisLength, opacity) {
		_classCallCheck(this, AxisHelper);

		this.object3d = new THREE.Object3D();
		this.axisLength = axisLength;
		this.opacity = opacity;

		this.createAxis(new THREE.Vector3(-this.axisLength, 0, 0), new THREE.Vector3(this.axisLength, 0, 0), new THREE.Color('hsl(0, 100%, 50%)'));

		this.createAxis(new THREE.Vector3(0, -this.axisLength, 0), new THREE.Vector3(0, this.axisLength, 0), new THREE.Color('hsl(120, 100%, 50%)'));

		this.createAxis(new THREE.Vector3(0, 0, -this.axisLength), new THREE.Vector3(0, 0, this.axisLength), new THREE.Color('hsl(240, 100%, 50%)'));

		return this.object3d;
	}

	_createClass(AxisHelper, [{
		key: 'createAxis',
		value: function createAxis(p1, p2, color) {
			var geom = new THREE.Geometry();
			var mat = new THREE.LineBasicMaterial({
				color: color,
				opacity: this.opacity,
				transparent: true
			});
			geom.vertices.push(p1, p2);
			var line = new THREE.Line(geom, mat);
			this.object3d.add(line);
		}
	}]);

	return AxisHelper;
}();

module.exports = AxisHelper;

},{}],10:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Calc = function () {
	function Calc() {
		_classCallCheck(this, Calc);
	}

	_createClass(Calc, [{
		key: "rand",


		/*
  ------------------------------------------
  | rand:float - returns random float
  |
  | min:number - minimum value
  | max:number - maximum value
  | ease:function - easing function to apply to the random value
  |
  | Get a random float between two values,
  | with the option of easing bias.
  ------------------------------------------ */
		value: function rand(min, max, ease) {
			if (max === undefined) {
				max = min;
				min = 0;
			}
			var random = Math.random();
			if (ease) {
				random = ease(Math.random(), 0, 1, 1);
			}
			return random * (max - min) + min;
		}

		/*
  ------------------------------------------
  | randInt:integer - returns random integer
  |
  | min:number - minimum value
  | max:number - maximum value
  | ease:function - easing function to apply to the random value
  |
  | Get a random integer between two values,
  | with the option of easing bias.
  ------------------------------------------ */

	}, {
		key: "randInt",
		value: function randInt(min, max, ease) {
			if (max === undefined) {
				max = min;
				min = 0;
			}
			var random = Math.random();
			if (ease) {
				random = ease(Math.random(), 0, 1, 1);
			}
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		/*
  ------------------------------------------
  | randArr:item - returns random iem from array
  |
  | arr:array - the array to randomly pull from
  |
  | Get a random item from an array.
  ------------------------------------------ */

	}, {
		key: "randArr",
		value: function randArr(arr) {
			return arr[Math.floor(Math.random() * arr.length)];
		}

		/*
  ------------------------------------------
  | map:number - returns a mapped value
  |
  | val:number - input value
  | inputMin:number - minimum of input range
  | inputMax:number - maximum of input range
  | outputMin:number - minimum of output range
  | outputMax:number - maximum of output range
  |
  | Get a mapped value from and input min/max
  | to an output min/max.
  ------------------------------------------ */

	}, {
		key: "map",
		value: function map(val, inputMin, inputMax, outputMin, outputMax) {
			return (outputMax - outputMin) * ((val - inputMin) / (inputMax - inputMin)) + outputMin;
		}

		/*
  ------------------------------------------
  | clamp:number - returns clamped value
  |
  | val:number - value to be clamped
  | min:number - minimum of clamped range
  | max:number - maximum of clamped range
  |
  | Clamp a value to a min/max range.
  ------------------------------------------ */

	}, {
		key: "clamp",
		value: function clamp(val, min, max) {
			return Math.max(Math.min(val, max), min);
		}
	}, {
		key: "lerp",
		value: function lerp(current, target, mix) {
			return current + (target - current) * mix;
		}

		/*
  ------------------------------------------
  | roundToUpperInterval:number - returns rounded up value
  |
  | value:number - value to be rounded
  | interval:number - interval
  |
  | Round up a value to the next highest interval.
  ------------------------------------------ */

	}, {
		key: "roundToUpperInterval",
		value: function roundToUpperInterval(value, interval) {
			if (value % interval === 0) {
				value += 0.0001;
			}
			return Math.ceil(value / interval) * interval;
		}

		/*
  ------------------------------------------
  | roundDownToInterval:number - returns rounded down value
  |
  | value:number - value to be rounded
  | interval:number - interval
  |
  | Round down a value to the next lowest interval.
  ------------------------------------------ */

	}, {
		key: "roundToLowerInterval",
		value: function roundToLowerInterval(value, interval) {
			if (value % interval === 0) {
				value -= 0.0001;
			}
			return Math.floor(value / interval) * interval;
		}

		/*
  ------------------------------------------
  | roundToNearestInterval:number - returns rounded value
  |
  | value:number - value to be rounded
  | interval:number - interval
  |
  | Round a value to the nearest interval.
  ------------------------------------------ */

	}, {
		key: "roundToNearestInterval",
		value: function roundToNearestInterval(value, interval) {
			return Math.round(value / interval) * interval;
		}

		/*
  ------------------------------------------
  | intersectSphere:boolean - returns if intersecting or not
  |
  | a:object - sphere 1 with radius, x, y, and z
  | b:object - sphere 2 with radius, x, y, and z
  |
  | Check if two sphere are intersecting
  | in 3D space.
  ------------------------------------------ */

	}, {
		key: "intersectSphere",
		value: function intersectSphere(a, b) {
			var distance = Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) + (a.z - b.z) * (a.z - b.z));
			return distance < a.radius + b.radius;
		}

		/*
  ------------------------------------------
  | getIndexFromCoords:number - returns index
  |
  | x:number - x value (column)
  | y:number - y value (row)
  | w:number - width of grid
  |
  | Convert from grid coords to index.
  ------------------------------------------ */

	}, {
		key: "getIndexFromCoords",
		value: function getIndexFromCoords(x, y, w) {
			return x + y * w;
		}

		/*
  ------------------------------------------
  | getCoordsFromIndex:object - returns coords
  |
  | i:number - index
  | w:number - width of grid
  |
  | Convert from index to grid coords.
  ------------------------------------------ */

	}, {
		key: "getCoordsFromIndex",
		value: function getCoordsFromIndex(i, w) {
			return {
				x: i % w,
				y: Math.floor(i / w)
			};
		}
	}, {
		key: "visibleHeightAtZDepth",
		value: function visibleHeightAtZDepth(depth, camera) {
			// https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269
			var cameraOffset = camera.position.z;
			if (depth < cameraOffset) depth -= cameraOffset;else depth += cameraOffset;
			var vFOV = camera.fov * Math.PI / 180;
			return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
		}
	}, {
		key: "visibleWidthAtZDepth",
		value: function visibleWidthAtZDepth(depth, camera) {
			// https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269
			var height = this.visibleHeightAtZDepth(depth, camera);
			return height * camera.aspect;
		}
	}]);

	return Calc;
}();

module.exports = Calc;

},{}],11:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ease = function () {
	function Ease() {
		_classCallCheck(this, Ease);
	}

	/*
 ------------------------------------------
 | inQuad:float - returns eased float value
 |
 | t:number - current time
 | b:number - beginning value
 | c:number - change in value
 | d:number - duration
 |
 | Get an eased float value based on inQuad.
 ------------------------------------------ */


	_createClass(Ease, [{
		key: "inQuad",
		value: function inQuad(t, b, c, d) {
			return c * (t /= d) * t + b;
		}

		/*
  ------------------------------------------
  | outQuad:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on outQuad.
  ------------------------------------------ */

	}, {
		key: "outQuad",
		value: function outQuad(t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		}

		/*
  ------------------------------------------
  | inOutQuad:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on inOutQuad.
  ------------------------------------------ */

	}, {
		key: "inOutQuad",
		value: function inOutQuad(t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t + b;
			return -c / 2 * (--t * (t - 2) - 1) + b;
		}

		/*
  ------------------------------------------
  | inCubic:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on inCubic.
  ------------------------------------------ */

	}, {
		key: "inCubic",
		value: function inCubic(t, b, c, d) {
			return c * (t /= d) * t * t + b;
		}

		/*
  ------------------------------------------
  | outCubic:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on outCubic.
  ------------------------------------------ */

	}, {
		key: "outCubic",
		value: function outCubic(t, b, c, d) {
			return c * ((t = t / d - 1) * t * t + 1) + b;
		}

		/*
  ------------------------------------------
  | inOutCubic:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on inOutCubic.
  ------------------------------------------ */

	}, {
		key: "inOutCubic",
		value: function inOutCubic(t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t + 2) + b;
		}

		/*
  ------------------------------------------
  | inQuart:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on inQuart.
  ------------------------------------------ */

	}, {
		key: "inQuart",
		value: function inQuart(t, b, c, d) {
			return c * (t /= d) * t * t * t + b;
		}

		/*
  ------------------------------------------
  | outQuart:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on outQuart.
  ------------------------------------------ */

	}, {
		key: "outQuart",
		value: function outQuart(t, b, c, d) {
			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
		}

		/*
  ------------------------------------------
  | inOutQuart:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on inOutQuart.
  ------------------------------------------ */

	}, {
		key: "inOutQuart",
		value: function inOutQuart(t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
		}

		/*
  ------------------------------------------
  | inQuint:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on inQuint.
  ------------------------------------------ */

	}, {
		key: "inQuint",
		value: function inQuint(t, b, c, d) {
			return c * (t /= d) * t * t * t * t + b;
		}

		/*
  ------------------------------------------
  | outQuint:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on outQuint.
  ------------------------------------------ */

	}, {
		key: "outQuint",
		value: function outQuint(t, b, c, d) {
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
		}

		/*
  ------------------------------------------
  | inOutQuint:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on inOutQuint.
  ------------------------------------------ */

	}, {
		key: "inOutQuint",
		value: function inOutQuint(t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		}

		/*
  ------------------------------------------
  | inSine:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on inSine.
  ------------------------------------------ */

	}, {
		key: "inSine",
		value: function inSine(t, b, c, d) {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
		}

		/*
  ------------------------------------------
  | outSine:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on outSine.
  ------------------------------------------ */

	}, {
		key: "outSine",
		value: function outSine(t, b, c, d) {
			return c * Math.sin(t / d * (Math.PI / 2)) + b;
		}

		/*
  ------------------------------------------
  | inOutSine:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on inOutSine.
  ------------------------------------------ */

	}, {
		key: "inOutSine",
		value: function inOutSine(t, b, c, d) {
			return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
		}

		/*
  ------------------------------------------
  | inExpo:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on inExpo.
  ------------------------------------------ */

	}, {
		key: "inExpo",
		value: function inExpo(t, b, c, d) {
			return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
		}

		/*
  ------------------------------------------
  | outExpo:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on outExpo.
  ------------------------------------------ */

	}, {
		key: "outExpo",
		value: function outExpo(t, b, c, d) {
			return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
		}

		/*
  ------------------------------------------
  | inOutExpo:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on inOutExpo.
  ------------------------------------------ */

	}, {
		key: "inOutExpo",
		value: function inOutExpo(t, b, c, d) {
			if (t == 0) return b;
			if (t == d) return b + c;
			if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
		}

		/*
  ------------------------------------------
  | inCirc:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on inCirc.
  ------------------------------------------ */

	}, {
		key: "inCirc",
		value: function inCirc(t, b, c, d) {
			return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
		}

		/*
  ------------------------------------------
  | outCirc:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on outCirc.
  ------------------------------------------ */

	}, {
		key: "outCirc",
		value: function outCirc(t, b, c, d) {
			return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
		}

		/*
  ------------------------------------------
  | inOutCirc:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on inOutCirc.
  ------------------------------------------ */

	}, {
		key: "inOutCirc",
		value: function inOutCirc(t, b, c, d) {
			if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
			return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
		}

		/*
  ------------------------------------------
  | inElastic:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on inElastic.
  ------------------------------------------ */

	}, {
		key: "inElastic",
		value: function inElastic(t, b, c, d) {
			var s = 1.70158;var p = 0;var a = c;
			if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
			if (a < Math.abs(c)) {
				a = c;var _s = p / 4;
			} else s = p / (2 * Math.PI) * Math.asin(c / a);
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		}

		/*
  ------------------------------------------
  | outElastic:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on outElastic.
  ------------------------------------------ */

	}, {
		key: "outElastic",
		value: function outElastic(t, b, c, d) {
			var s = 1.70158;var p = 0;var a = c;
			if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
			if (a < Math.abs(c)) {
				a = c;var _s2 = p / 4;
			} else s = p / (2 * Math.PI) * Math.asin(c / a);
			return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
		}

		/*
  ------------------------------------------
  | inOutElastic:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  |
  | Get an eased float value based on inOutElastic.
  ------------------------------------------ */

	}, {
		key: "inOutElastic",
		value: function inOutElastic(t, b, c, d) {
			var s = 1.70158;var p = 0;var a = c;
			if (t == 0) return b;if ((t /= d / 2) == 2) return b + c;if (!p) p = d * (.3 * 1.5);
			if (a < Math.abs(c)) {
				a = c;var _s3 = p / 4;
			} else s = p / (2 * Math.PI) * Math.asin(c / a);
			if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
		}

		/*
  ------------------------------------------
  | inBack:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  | s:number - strength
  |
  | Get an eased float value based on inBack.
  ------------------------------------------ */

	}, {
		key: "inBack",
		value: function inBack(t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		}

		/*
  ------------------------------------------
  | outBack:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  | s:number - strength
  |
  | Get an eased float value based on outBack.
  ------------------------------------------ */

	}, {
		key: "outBack",
		value: function outBack(t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		}

		/*
  ------------------------------------------
  | inOutBack:float - returns eased float value
  |
  | t:number - current time
  | b:number - beginning value
  | c:number - change in value
  | d:number - duration
  | s:number - strength
  |
  | Get an eased float value based on inOutBack.
  ------------------------------------------ */

	}, {
		key: "inOutBack",
		value: function inOutBack(t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
			return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
		}
	}]);

	return Ease;
}();

module.exports = Ease;

},{}]},{},[2]);
