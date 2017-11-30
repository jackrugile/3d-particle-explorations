/*
 * A speed-improved simplex noise algorithm for 2D, 3D and 4D in JavaScript.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 */

function FastSimplexNoise(options) {
  if (!options) options = {};

  this.amplitude   = options.amplitude || 1.0;
  this.frequency   = options.frequency || 1.0;
  this.octaves     = parseInt(options.octaves || 1);
  this.persistence = options.persistence || 0.5;
  this.random      = options.random || Math.random;

  var i;
  var p = new Uint8Array(256);
  for (i = 0; i < 256; i++) {
    p[i] = i;
  }

  var n, q;
  for (i = 255; i > 0; i--) {
    n = Math.floor((i + 1) * this.random());
    q = p[i];
    p[i] = p[n];
    p[n] = q;
  }

  // To remove the need for index wrapping, double the permutation table length
  this.perm = new Uint8Array(512);
  this.permMod12 = new Uint8Array(512);
  for (i = 0; i < 512; i++) {
    this.perm[i] = p[i & 255];
    this.permMod12[i] = this.perm[i] % 12;
  }
}

FastSimplexNoise.G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
FastSimplexNoise.G3 = 1.0 / 6.0;
FastSimplexNoise.G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

FastSimplexNoise.GRADIENTS_3D = [
  [ 1, 1, 0], [-1, 1, 0], [ 1,-1, 0], [-1,-1, 0],
  [ 1, 0, 1], [-1, 0, 1], [ 1, 0,-1], [-1, 0,-1],
  [ 0, 1, 1], [ 0,-1,-1], [ 0, 1,-1], [ 0,-1,-1]
];

FastSimplexNoise.GRADIENTS_4D = [
  [ 0, 1, 1, 1], [ 0, 1, 1,-1], [ 0, 1,-1, 1], [ 0, 1,-1,-1],
  [ 0,-1, 1, 1], [ 0,-1, 1,-1], [ 0,-1,-1, 1], [ 0,-1,-1,-1],
  [ 1, 0, 1, 1], [ 1, 0, 1,-1], [ 1, 0,-1, 1], [ 1, 0,-1,-1],
  [-1, 0, 1, 1], [-1, 0, 1,-1], [-1, 0,-1, 1], [-1, 0,-1,-1],
  [ 1, 1, 0, 1], [ 1, 1, 0,-1], [ 1,-1, 0, 1], [ 1,-1, 0,-1],
  [-1, 1, 0, 1], [-1, 1, 0,-1], [-1,-1, 0, 1], [-1,-1, 0,-1],
  [ 1, 1, 1, 0], [ 1, 1,-1, 0], [ 1,-1, 1, 0], [ 1,-1,-1, 0],
  [-1, 1, 1, 0], [-1, 1,-1, 0], [-1,-1, 1, 0], [-1,-1,-1, 0]
];

FastSimplexNoise.dot2D = function (g, x, y) {
  return g[0] * x + g[1] * y;
};

FastSimplexNoise.dot3D = function (g, x, y, z) {
  return g[0] * x + g[1] * y + g[2] * z;
};

FastSimplexNoise.dot4D = function (g, x, y, z, w) {
  return g[0] * x + g[1] * y + g[2] * z + g[3] * w;
};

FastSimplexNoise.prototype.get2DNoise = function (x, y) {
  var amplitude = this.amplitude;
  var frequency = this.frequency;
  var maxAmplitude = 0;
  var noise = 0;
  var persistence = this.persistence;

  for (var i = 0; i < this.octaves; i++) {
    noise += this.getRaw2DNoise(x * frequency, y * frequency) * amplitude;
    maxAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }

  return noise / maxAmplitude;
};

FastSimplexNoise.prototype.get3DNoise = function (x, y, z) {
  var amplitude = this.amplitude;
  var frequency = this.frequency;
  var maxAmplitude = 0;
  var noise = 0;
  var persistence = this.persistence;

  for (var i = 0; i < this.octaves; i++) {
    noise += this.getRaw3DNoise(x * frequency, y * frequency, z * frequency) * amplitude;
    maxAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }

  return noise / maxAmplitude;
};

FastSimplexNoise.prototype.get4DNoise = function (x, y, z, w) {
  var amplitude = this.amplitude;
  var frequency = this.frequency;
  var maxAmplitude = 0;
  var noise = 0;
  var persistence = this.persistence;

  for (var i = 0; i < this.octaves; i++) {
    noise += this.getRaw4DNoise(x * frequency, y * frequency, z * frequency, w * frequency) * amplitude;
    maxAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }

  return noise / maxAmplitude;
};

FastSimplexNoise.prototype.getRaw2DNoise = function (x, y) {
  var G2        = FastSimplexNoise.G2;
  var dot2      = FastSimplexNoise.dot2D;
  var grad3     = FastSimplexNoise.GRADIENTS_3D;
  var perm      = this.perm;
  var permMod12 = this.permMod12;

  var n0, n1, n2; // Noise contributions from the three corners

  // Skew the input space to determine which simplex cell we're in
  var s = (x + y) * 0.5 * (Math.sqrt(3.0) - 1.0); // Hairy factor for 2D
  var i = Math.floor(x + s);
  var j = Math.floor(y + s);
  var t = (i + j) * G2;
  var X0 = i - t; // Unskew the cell origin back to (x,y) space
  var Y0 = j - t;
  var x0 = x - X0; // The x,y distances from the cell origin
  var y0 = y - Y0;

  // For the 2D case, the simplex shape is an equilateral triangle.
  // Determine which simplex we are in.
  var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
  if (x0 > y0) { // Lower triangle, XY order: (0,0)->(1,0)->(1,1)
    i1 = 1;
    j1 = 0;
  } else { // Upper triangle, YX order: (0,0)->(0,1)->(1,1)
    i1 = 0;
    j1 = 1;
  }

  // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
  // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
  // c = (3 - sqrt(3)) / 6

  var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
  var y1 = y0 - j1 + G2;
  var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
  var y2 = y0 - 1.0 + 2.0 * G2;

  // Work out the hashed gradient indices of the three simplex corners
  var ii = i & 255;
  var jj = j & 255;
  var gi0 = permMod12[ii + perm[jj]];
  var gi1 = permMod12[ii + i1 + perm[jj + j1]];
  var gi2 = permMod12[ii + 1 + perm[jj + 1]];

  // Calculate the contribution from the three corners
  var t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 < 0) {
    n0 = 0.0;
  } else {
    t0 *= t0;
    // (x,y) of 3D gradient used for 2D gradient
    n0 = t0 * t0 * dot2(grad3[gi0], x0, y0);
  }
  var t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 < 0) {
    n1 = 0.0;
  } else {
    t1 *= t1;
    n1 = t1 * t1 * dot2(grad3[gi1], x1, y1);
  }
  var t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 < 0) {
    n2 = 0.0;
  } else {
    t2 *= t2;
    n2 = t2 * t2 * dot2(grad3[gi2], x2, y2);
  }

  // Add contributions from each corner to get the final noise value.
  // The result is scaled to return values in the interval [-1, 1];
  return 70.1 * (n0 + n1 + n2);
};

FastSimplexNoise.prototype.getRaw3DNoise = function (x, y, z) {
  var dot3      = FastSimplexNoise.dot3D;
  var grad3     = FastSimplexNoise.GRADIENTS_3D;
  var G3        = FastSimplexNoise.G3;
  var perm      = this.perm;
  var permMod12 = this.permMod12;

  var n0, n1, n2, n3; // Noise contributions from the four corners

  // Skew the input space to determine which simplex cell we're in
  var s = (x + y + z) / 3.0; // Very nice and simple skew factor for 3D
  var i = Math.floor(x + s);
  var j = Math.floor(y + s);
  var k = Math.floor(z + s);
  var t = (i + j + k) * G3;
  var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
  var Y0 = j - t;
  var Z0 = k - t;
  var x0 = x - X0; // The x,y,z distances from the cell origin
  var y0 = y - Y0;
  var z0 = z - Z0;

  // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
  // Determine which simplex we are in.
  var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
  var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
  if (x0 >= y0) {
    if( y0 >= z0) { // X Y Z order
      i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
    } else if (x0 >= z0) { // X Z Y order
      i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;
    } else { // Z X Y order
      i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;
    }
  } else { // x0 < y0
    if (y0 < z0) { // Z Y X order
      i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;
    } else if (x0 < z0) { // Y Z X order
      i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;
    } else { // Y X Z order
      i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
    }
  }

  // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
  // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
  // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
  // c = 1/6.
  var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
  var y1 = y0 - j1 + G3;
  var z1 = z0 - k1 + G3;
  var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
  var y2 = y0 - j2 + 2.0 * G3;
  var z2 = z0 - k2 + 2.0 * G3;
  var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
  var y3 = y0 - 1.0 + 3.0 * G3;
  var z3 = z0 - 1.0 + 3.0 * G3;

  // Work out the hashed gradient indices of the four simplex corners
  var ii = i & 255;
  var jj = j & 255;
  var kk = k & 255;
  var gi0 = permMod12[ii + perm[jj + perm[kk]]];
  var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]];
  var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]];
  var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]];

  // Calculate the contribution from the four corners
  var t0 = 0.5 - x0 * x0 - y0 * y0 - z0 * z0;
  if (t0 < 0) {
    n0 = 0.0;
  } else {
    t0 *= t0;
    n0 = t0 * t0 * dot3(grad3[gi0], x0, y0, z0);
  }
  var t1 = 0.5 - x1 * x1 - y1 * y1 - z1 * z1;
  if (t1 < 0) {
    n1 = 0.0;
  } else {
    t1 *= t1;
    n1 = t1 * t1 * dot3(grad3[gi1], x1, y1, z1);
  }
  var t2 = 0.5 - x2 * x2 - y2 * y2 - z2 * z2;
  if (t2 < 0) {
    n2 = 0.0;
  } else {
    t2 *= t2;
    n2 = t2 * t2 * dot3(grad3[gi2], x2, y2, z2);
  }
  var t3 = 0.5 - x3 * x3 - y3 * y3 - z3 * z3;
  if (t3 < 0) {
    n3 = 0.0;
  } else {
    t3 *= t3;
    n3 = t3 * t3 * dot3(grad3[gi3], x3, y3, z3);
  }

  // Add contributions from each corner to get the final noise value.
  // The result is scaled to stay just inside [-1,1]
  return 76.8 * (n0 + n1 + n2 + n3);
};

FastSimplexNoise.prototype.getRaw4DNoise = function (x, y, z, w) {
  var dot4      = FastSimplexNoise.dot4D;
  var grad4     = FastSimplexNoise.GRADIENTS_4D;
  var G4        = FastSimplexNoise.G4;
  var perm      = this.perm;
  var permMod12 = this.permMod12;

  var n0, n1, n2, n3, n4; // Noise contributions from the five corners

  // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
  var s = (x + y + z + w) * (Math.sqrt(5.0) - 1.0) / 4.0; // Factor for 4D skewing
  var i = Math.floor(x + s);
  var j = Math.floor(y + s);
  var k = Math.floor(z + s);
  var l = Math.floor(w + s);
  var t = (i + j + k + l) * G4; // Factor for 4D unskewing
  var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
  var Y0 = j - t;
  var Z0 = k - t;
  var W0 = l - t;
  var x0 = x - X0;  // The x,y,z,w distances from the cell origin
  var y0 = y - Y0;
  var z0 = z - Z0;
  var w0 = w - W0;

  // For the 4D case, the simplex is a 4D shape I won't even try to describe.
  // To find out which of the 24 possible simplices we're in, we need to
  // determine the magnitude ordering of x0, y0, z0 and w0.
  // Six pair-wise comparisons are performed between each possible pair
  // of the four coordinates, and the results are used to rank the numbers.
  var rankx = 0;
  var ranky = 0;
  var rankz = 0;
  var rankw = 0;
  if (x0 > y0) {
    rankx++;
  } else {
    ranky++;
  }
  if (x0 > z0) {
    rankx++;
  } else {
    rankz++;
  }
  if (x0 > w0) {
    rankx++;
  } else {
    rankw++;
  }
  if (y0 > z0) {
    ranky++;
  } else {
    rankz++;
  }
  if (y0 > w0) {
    ranky++;
  } else {
    rankw++;
  }
  if (z0 > w0) {
    rankz++;
  } else {
    rankw++;
  }
  var i1, j1, k1, l1; // The integer offsets for the second simplex corner
  var i2, j2, k2, l2; // The integer offsets for the third simplex corner
  var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner

  // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
  // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
  // impossible. Only the 24 indices which have non-zero entries make any sense.
  // We use a thresholding to set the coordinates in turn from the largest magnitude.
  // Rank 3 denotes the largest coordinate.
  i1 = rankx >= 3 ? 1 : 0;
  j1 = ranky >= 3 ? 1 : 0;
  k1 = rankz >= 3 ? 1 : 0;
  l1 = rankw >= 3 ? 1 : 0;
  // Rank 2 denotes the second largest coordinate.
  i2 = rankx >= 2 ? 1 : 0;
  j2 = ranky >= 2 ? 1 : 0;
  k2 = rankz >= 2 ? 1 : 0;
  l2 = rankw >= 2 ? 1 : 0;
  // Rank 1 denotes the second smallest coordinate.
  i3 = rankx >= 1 ? 1 : 0;
  j3 = ranky >= 1 ? 1 : 0;
  k3 = rankz >= 1 ? 1 : 0;
  l3 = rankw >= 1 ? 1 : 0;

  // The fifth corner has all coordinate offsets = 1, so no need to compute that.
  var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
  var y1 = y0 - j1 + G4;
  var z1 = z0 - k1 + G4;
  var w1 = w0 - l1 + G4;
  var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords
  var y2 = y0 - j2 + 2.0 * G4;
  var z2 = z0 - k2 + 2.0 * G4;
  var w2 = w0 - l2 + 2.0 * G4;
  var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords
  var y3 = y0 - j3 + 3.0 * G4;
  var z3 = z0 - k3 + 3.0 * G4;
  var w3 = w0 - l3 + 3.0 * G4;
  var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords
  var y4 = y0 - 1.0 + 4.0 * G4;
  var z4 = z0 - 1.0 + 4.0 * G4;
  var w4 = w0 - 1.0 + 4.0 * G4;

  // Work out the hashed gradient indices of the five simplex corners
  var ii = i & 255;
  var jj = j & 255;
  var kk = k & 255;
  var ll = l & 255;
  var gi0 = perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32;
  var gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32;
  var gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32;
  var gi3 = perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32;
  var gi4 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32;

  // Calculate the contribution from the five corners
  var t0 = 0.5 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
  if (t0 < 0) {
    n0 = 0.0;
  } else {
    t0 *= t0;
    n0 = t0 * t0 * dot4(grad4[gi0], x0, y0, z0, w0);
  }
  var t1 = 0.5 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
  if (t1 < 0) {
    n1 = 0.0;
  } else {
    t1 *= t1;
    n1 = t1 * t1 * dot4(grad4[gi1], x1, y1, z1, w1);
  }
  var t2 = 0.5 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
  if (t2 < 0) {
    n2 = 0.0;
  } else {
    t2 *= t2;
    n2 = t2 * t2 * dot4(grad4[gi2], x2, y2, z2, w2);
  }
  var t3 = 0.5 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
  if (t3 < 0) {
    n3 = 0.0;
  } else {
    t3 *= t3;
    n3 = t3 * t3 * dot4(grad4[gi3], x3, y3, z3, w3);
  }
  var t4 = 0.5 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
  if (t4 < 0) {
    n4 = 0.0;
  } else {
    t4 *= t4;
    n4 = t4 * t4 * dot4(grad4[gi4], x4, y4, z4, w4);
  }

  // Sum up and scale the result to cover the range [-1,1]
  return 72.3 * (n0 + n1 + n2 + n3 + n4);
};

