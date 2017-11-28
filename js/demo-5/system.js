PL.System = class extends PL.SystemBase {

	constructor(loader) {
		super(loader);

		this.simplex = new SimplexNoise();

		//this.duration = 3500;
		this.size = 30;
		this.cols = 20;
		this.rows = 20;

		this.grid_lines = [];
		this.grid_line_tick = 0;
		this.grid_line_tick_max = this.calc.randInt(30, 60);

		for(let col = 0; col < this.cols; col++) {
			for(let row = 0; row < this.rows; row++) {
				let x = this.calc.map(col, 0, this.cols - 1, -this.size / 2, this.size / 2);
				let y = this.calc.map(row, 0, this.rows - 1, -this.size / 2, this.size / 2);
				let z = 0;
				let size = this.calc.rand(0.02, 0.3);
				size = 0.05;

				this.particles.push(new PL.Particle({
					group: this.particleGroup,
					x: x,
					y: y,
					z: z,
					size: size,
					color: 0xffffff,
					opacity: this.calc.rand(0.1, 1)
				}, this, this.loader));
			}
		}

		//this.particleGroup.rotation.x = -Math.PI / 2;
		//this.particleGroup.rotation.z = Math.PI / 4;
	}

	getAdjacentPoint(point) {
		let _point = [point[0], point[1]];
		if(Math.random() > 0.5) {
			if(Math.random() > 0.5) {
				_point[0] += 1;
			} else {
				_point[0] -= 1;
			}
		}
		if(Math.random() > 0.5) {
			_point[1] += 1;
		}
		_point[0] = this.calc.clamp(_point[0], 0, this.cols - 1);
		_point[1] = this.calc.clamp(_point[1], 0, this.rows - 1);
		return _point;
	}

	getGridLineSet(total) {
		let _coords = [];
		let _count = 1;
		let _total = total;
		_coords.push([this.calc.randInt(1, this.cols - 2), 0]);
		let _adjPoint = this.getAdjacentPoint(_coords[_count - 1]);
		while(_adjPoint[1] < this.cols - 1) {
			_adjPoint = this.getAdjacentPoint(_coords[_count - 1]);
			_coords.push(_adjPoint);
			_count++;
		}
		let _set = [];
		for(let i = 0, length = _coords.length; i < length; i++) {
			let _grid_particle = this.particles[this.calc.getIndexFromCoords(_coords[i][0], _coords[i][1], this.cols)];
			_set.push(_grid_particle);
		}
		return _set;
	}

	update() {
		super.update();

		if(this.grid_line_tick >= this.grid_line_tick_max) {
			this.grid_lines.push(new PL.Line({
					group: this.particleGroup,
					points: this.getGridLineSet(30)
				},
				this.system,
				this.loader
			));
			this.grid_line_tick = 0;
			this.grid_line_tick_max = this.calc.randInt(30, 80);
		}

		let i = this.grid_lines.length;
		while(i--) {
			let _grid_line = this.grid_lines[i];
			_grid_line.update();
			if(_grid_line.removeFlag) {
				this.particleGroup.remove(_grid_line.mesh);
				this.grid_lines.splice(i, 1);
			}
		}

		this.grid_line_tick++;

		if(this.exiting && !this.loader.isOrbit) {
			this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProg, 0, 1, 1) * this.loader.cameraBaseZ;
		}
	}

}
