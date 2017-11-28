class Calc {

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
	rand(min, max, ease) {
		if(max === undefined) {
			max = min;
			min = 0;
		}
		let random = Math.random();
		if(ease) {
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
	randInt(min, max, ease) {
		if(max === undefined) {
			max = min;
			min = 0;
		}
		let random = Math.random();
		if(ease) {
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
	randArr(arr) {
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
	map(val, inputMin, inputMax, outputMin, outputMax) {
		return ((outputMax - outputMin) * ((val - inputMin) / (inputMax - inputMin))) + outputMin;
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
	clamp(val, min, max) {
		return Math.max(Math.min(val, max), min);
	}

	lerp(current, target, mix) {
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
	roundToUpperInterval(value, interval) {
		if(value % interval === 0) {
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
	roundToLowerInterval(value, interval) {
		if(value % interval === 0) {
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
	roundToNearestInterval(value, interval) {
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
	intersectSphere(a, b) {
		let distance = Math.sqrt(
			(a.x - b.x) * (a.x - b.x) +
			(a.y - b.y) * (a.y - b.y) +
			(a.z - b.z) * (a.z - b.z)
		);
		return distance < (a.radius + b.radius);
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
	getIndexFromCoords(x, y, w) {
		return x + (y * w);
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
	getCoordsFromIndex(i, w) {
		return {
			x: i % w,
			y: Math.floor(i / w)
		}
	}

	visibleHeightAtZDepth(depth, camera) {
		// https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269
		let cameraOffset = camera.position.z;
		if ( depth < cameraOffset ) depth -= cameraOffset;
		else depth += cameraOffset;
		let vFOV = camera.fov * Math.PI / 180; 
		return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
	};

	visibleWidthAtZDepth(depth, camera) {
		// https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269
		let height = this.visibleHeightAtZDepth( depth, camera );
		return height * camera.aspect;
	};

}

module.exports = Calc;
