// IncrementManager fixed needs some rethinking I'm pretty sure the cumulative stuff is unnecessary


var IncrementManager = function () {
	'use strict';
	this.step = 0;
	this.min = 0;
	this.max = 0;
	this.lastStep = 0;
	this.increment = 0;
	this.cumulative = 0;
};


IncrementManager.prototype.updateStep = function () {
	'use strict';
	this.cumulative += this.step;
};

IncrementManager.prototype.getStep = function () {
	'use strict';
	return this.step;
};

IncrementManager.prototype.getIncrement = function () {
	'use strict';
	return this.increment;
};

IncrementManager.prototype.getLastStep = function () {
	'use strict';
	return this.lastStep;
};

IncrementManager.prototype.getMin = function () {
	'use strict';
	return this.min;
};

IncrementManager.prototype.getMax = function () {
	'use strict';
	return this.max;
};

IncrementManager.prototype.withinMinMax = function (min, max) {
	'use strict';
	var tmp;

	if (typeof min !== 'number') {
		throw {'msg': 'IncrementFixed expects first parameter "min" to be a number. ' + typeof min + ' given!'};
	}

	if (typeof max !== 'number') {
		throw {'msg': 'IncrementFixed expects second parameter "max" to be a number. ' + typeof max + ' given!'};
	}

	if (min > max) {
		tmp = min;
		min = max;
		max = tmp;
	}

	if (this.step > max || this.step < min || this.min < min || this.max >= max || this.max <= min) {
		return false;
	}
	return true;
};






//  END:  IncrementManager (interface)
// ==================================================================
// START: IncrementFixed






var IncrementFixed = function (step) {
	'use strict';
	if (typeof step !== 'Number') {
		throw {'msg': 'IncrementFixed expects first parameter "step" to be a number. ' + typeof step + ' given!'};
	}
	this.step = step;
	this.lastStep = step;
	this.min = step;
	this.max = step;
};
IncrementFixed.prototype = Object.create(IncrementManager);







//  END:  IncrementFixed
// ==================================================================
// START: IncrementFixed





/**
 * supplies an ever decreasing step
 * @param {number} step        the value that will be returned
 * @param {number} decayFactor [[Description]]
 */
var IncrementDecay = function (step, decayFactor) {
	'use strict';
	if (typeof step !== 'Number') {
		throw {'msg': 'IncrementDecay expects first parameter "step" to be a number. ' + typeof step + ' given!'};
	}
	if (typeof decayFactor !== 'Number') {
		throw {'msg': 'IncrementDecay expects second parameter "decayFactor" to be a number. ' + typeof decayFactor + ' given!'};
	}
	this.step = step;
	this.min = 0;
	this.max = step;
	this.decayFactor = decayFactor;
};
IncrementDecay.prototype = Object.create(IncrementManager);


IncrementDecay.prototype.updateStep = function () {
	'use strict';
	this.lastStep = this.step;
	this.step *= this.decayFactor;
};







//  END:  IncrementFixed
// ==================================================================
// START: IncrementOscillate






var IncrementOscillate = function (step, increment, min, max) {
	'use strict';

	var tmp = 'doMinMax';

	this.doMinMax = this.doMinMaxLinier;

	if (typeof step !== 'Number') {
		throw {'msg': 'IncrementDecay expects first parameter "step" to be a number. ' + typeof step + ' given!'};
	}
	if (typeof increment !== 'Number') {
		throw {'msg': 'IncrementDecay expects second parameter "increment" to be a number. ' + typeof increment + ' given!'};
	}
	if (typeof min !== 'Number') {
		throw {'msg': 'IncrementDecay expects third parameter "min" to be a number. ' + typeof min + ' given!'};
	}
	if (typeof max !== 'Number') {
		throw {'msg': 'IncrementDecay expects fourth parameter "max" to be a number. ' + typeof max + ' given!'};
	}

	if (min > max) {
		this.min = max;
		this.max = min;
	} else {
		this.max = max;
		this.min = min;
	}
	this.step = step;
	this.increment = increment;
	this.getStep();
};
IncrementOscillate.prototype = Object.create(IncrementManager);


IncrementOscillate.prototype.doMinMaxLinier = function () {
	'use strict';
	if (this.step > this.max) {
		// bounce _step off max
		this.step = this.max - (this.step - this.max);
		this.increment = -this.increment;
	} else if (this.step < this.min) {
		// bounce _step off min
		this.step = this.min + (this.min - this.step);
		this.increment = -this.increment;
	}
};

IncrementOscillate.prototype.doMinMaxReset = function () {
	'use strict';
	this.step += this.increment;
	if (this.step > this.max) {
		// bounce _step off max
		this.step = this.min + (this.step - this.max);
	}
};

IncrementOscillate.prototype.doMinMaxCurve = function () {
	'use strict';
	// calculate the X coordinate on a curve at a given angle
};

IncrementOscillate.prototype.doMinMax = IncrementOscillate.doMinMaxLinier;


IncrementOscillate.prototype.getStep = function () {
	'use strict';
	return this.increment;
};

IncrementOscillate.prototype.updateStep = function () {
	'use strict';
	this.lastStep = this.step;
	this.step += this.increment;
	return this.doMinMax(this.step);
};


IncrementOscillate.prototype.setIncrementMode = function (mode) {
	'use strict';
	if (mode === undefined || typeof mode !== 'String') {
		throw {'message': 'IncrementOscillate.setMode() expects only parameter to be a string. ' + typeof mode + ' given.'};
	} else if (mode === 'linier') {
		this.doMinMax = this.doMinMaxLinier;
	} else if (mode === 'reset') {
		this.doMinMax = this.doMinMaxReset;
	} else if (mode === 'curve') {
		this.doMinMax = this.doMinMaxCurve;
	} else {
		throw {'message': 'IncrementOscillate.setMode() expects only parameter to be a string matching: "linier", "reset" or "curve". "' + mode + '" given.'};
	}
};

IncrementOscillate.prototype.setDoCumulative = function (mode) {
	'use strict';
	if (mode === undefined || typeof mode !== 'Boolean') {
		throw {'message': 'IncrementOscillate.setMode() expects only parameter to be boolean. ' + typeof mode + ' given.'};
	} else if (mode === true) {
		this.getStep = function () {
			return this.step;
		};
	} else {
		this.getStep = function () {
			return this.increment;
		};
	}
};





//  END:  IncrementOscillate
// ==================================================================
// START: IncrementCircular






/*
var IncrementCircular = function () {
	'use strict';
};
IncrementCircular.prototype = Object.create(IncrementManager);
*/






//  END:  IncrementCircular
// ==================================================================
// START: IncrementEliptic






/*
var IncrementEliptic = function () {
	'use strict';
};
IncrementEliptic.prototype = Object.create(IncrementManager);
*/






//  END:  IncrementEliptic
// ==================================================================
