PL.Osc = class {

	constructor(val, rate, dir = true) {
		this._val = val;
		this._rate = rate;
		this._dir = dir;
	}

	update() {
		if(this._dir) {
			if(this._val < 1) {
				this._val += this._rate;
			} else {
				this._val = 1;
				this._dir = !this._dir;
			}
		} else {
			if(this._val > 0) {
				this._val -= this._rate;
			} else {
				this._val = 0;
				this._dir = !this._dir;
			}
		}
	}

	val(ease) {
		if(ease) {
			return ease(this._val, 0, 1, 1);
		} else {
			return this.val;
		}
	}

}
