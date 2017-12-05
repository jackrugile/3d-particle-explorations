class Osc {

	constructor(val, rate, dir = true, flip = false) {
		this._val = val;
		this._rate = rate;
		this._dir = dir;
		this._flip = flip;

		this._valBase = val;
		this._rateBase = rate;
		this._dirBase = dir;
		this._flipBase = flip;

		this.trigger = false;
		this.triggerTop = false;
		this.triggerBot = false;
	}

	reset() {
		this._val = this._valBase;
		this._rate = this._rateBase;
		this._dir = this._dirBase;
		this._flip = this._flipBase;

		this.trigger = false;
		this.triggerTop = false;
		this.triggerBot = false;
	}

	update(dt) {
		this.trigger = false;
		this.triggerTop = false;
		this.triggerBot = false;
		if(this._dir) {
			if(this._val < 1) {
				this._val += this._rate * dt;
			} else {
				this.trigger = true;
				this.triggerTop = true;
				if(this._flip) {
					this._val = this._val - 1;
				} else {
					this._val = 1 - (this._val - 1);
					this._dir = !this._dir;
				}
			}
		} else {
			if(this._val > 0) {
				this._val -= this._rate * dt;
			} else {
				this.trigger = true;
				this.triggerBot = true;
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

module.exports = Osc;
