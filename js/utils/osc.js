PL.Osc = class {

	constructor(val, rate, dir = true, flip = false) {
		this._baseVal = val;
		this._baseRate = rate;
		this._baseDir = dir;
		this._baseFlip = flip;

		this._val = val;
		this._rate = rate;
		this._dir = dir;
		this._flip = flip;
	}

	reset() {
		this._val = this._baseVal;
		this._rate = this._baseRate;
		this._dir = this._baseDir;
		this._flip = this._baseFlip;
	}

	update() {
		if(this._dir) {
			if(this._val < 1) {
				this._val += this._rate;
			} else {
				if(this._flip) {
					this._val = this._val - 1;
				} else {
					this._val = 1 - (this._val - 1);
					this._dir = !this._dir;
				}
			}
		} else {
			if(this._val > 0) {
				this._val -= this._rate;
			} else {
				if(this._flip) {
					this._val = 1 + this._val;
				} else {
					this._val = -(this._val);
					this._dir = !this._dir;
				}
			}
		}
	}

	val(ease) {
		if(ease) {
			return ease(this._val, 0, 1, 1);
		} else {
			return this._val;
		}
	}

}
