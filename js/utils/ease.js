class Ease {

	constructor() {

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
	inQuad(t, b, c, d) {
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
	outQuad(t, b, c, d) {
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
	inOutQuad(t, b, c, d) {
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
	inCubic(t, b, c, d) {
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
	outCubic(t, b, c, d) {
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
	inOutCubic(t, b, c, d) {
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
	inQuart(t, b, c, d) {
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
	outQuart(t, b, c, d) {
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
	inOutQuart(t, b, c, d) {
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
	inQuint(t, b, c, d) {
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
	outQuint(t, b, c, d) {
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
	inOutQuint(t, b, c, d) {
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
	inSine(t, b, c, d) {
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
	outSine(t, b, c, d) {
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
	inOutSine(t, b, c, d) {
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
	inExpo(t, b, c, d) {
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
	outExpo(t, b, c, d) {
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
	inOutExpo(t, b, c, d) {
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
	inCirc(t, b, c, d) {
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
	outCirc(t, b, c, d) {
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
	inOutCirc(t, b, c, d) {
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
	inElastic(t, b, c, d) {
		let s=1.70158;let p=0;let a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; let s=p/4; }
		else s = p/(2*Math.PI) * Math.asin (c/a);
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
	outElastic(t, b, c, d) {
		let s=1.70158;let p=0;let a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; let s=p/4; }
		else s = p/(2*Math.PI) * Math.asin (c/a);
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
	inOutElastic(t, b, c, d) {
		let s=1.70158;let p=0;let a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; let s=p/4; }
		else s = p/(2*Math.PI) * Math.asin (c/a);
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
	inBack(t, b, c, d, s) {
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
	outBack(t, b, c, d, s) {
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
	inOutBack(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	}

}

module.exports = Ease;
