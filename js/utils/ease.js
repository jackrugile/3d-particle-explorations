PL.Ease = function() {

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
	this.inQuad = function(t, b, c, d) {
		return c*(t/=d)*t + b;
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
	this.outQuad = function(t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
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
	this.inOutQuad = function(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
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
	this.inCubic = function(t, b, c, d) {
		return c*(t/=d)*t*t + b;
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
	this.outCubic = function(t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
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
	this.inOutCubic = function(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
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
	this.inQuart = function(t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
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
	this.outQuart = function(t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
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
	this.inOutQuart = function(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
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
	this.inQuint = function(t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
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
	this.outQuint = function(t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
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
	this.inOutQuint = function(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
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
	this.inSine = function(t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
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
	this.outSine = function(t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
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
	this.inOutSine = function(t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
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
	this.inExpo = function(t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
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
	this.outExpo = function(t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
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
	this.inOutExpo = function(t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
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
	this.inCirc = function(t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
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
	this.outCirc = function(t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
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
	this.inOutCirc = function(t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
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
	this.inElastic = function(t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
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
	this.outElastic = function(t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
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
	this.inOutElastic = function(t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
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
	this.inBack = function(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
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
	this.outBack = function(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
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
	this.inOutBack = function(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	}

	/*
	------------------------------------------
	| inBounce:float - returns eased float value
	|
	| t:number - current time
	| b:number - beginning value
	| c:number - change in value
	| d:number - duration
	|
	| Get an eased float value based on outBounce.
	------------------------------------------ */
	this.inBounce = function(t, b, c, d) {
		return c - this.outBounce (d-t, 0, c, d) + b;
	}

	/*
	------------------------------------------
	| outBounce:float - returns eased float value
	|
	| t:number - current time
	| b:number - beginning value
	| c:number - change in value
	| d:number - duration
	|
	| Get an eased float value based on outBounce.
	------------------------------------------ */
	this.outBounce = function(t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	}

	/*
	------------------------------------------
	| inOutBounce:float - returns eased float value
	|
	| t:number - current time
	| b:number - beginning value
	| c:number - change in value
	| d:number - duration
	|
	| Get an eased float value based on inOutBounce.
	------------------------------------------ */
	this.inOutBounce = function(t, b, c, d) {
		if (t < d/2) return this.inBounce (t*2, 0, c, d) * .5 + b;
		return this.outBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
	}

}
