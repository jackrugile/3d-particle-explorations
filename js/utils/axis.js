PL.AxisHelper = function(axisLength, opacity) {

	this.object3d = new THREE.Object3D();

	this.createAxis = function(p1, p2, color){
		var geom = new THREE.Geometry();
		var mat = new THREE.LineBasicMaterial({
			color: color,
			opacity: opacity,
			transparent: true
		});
		geom.vertices.push(p1, p2);
		var line = new THREE.Line(geom, mat);
		this.object3d.add(line);
	}

	this.createAxis(
		new THREE.Vector3(-axisLength, 0, 0),
		new THREE.Vector3(axisLength, 0, 0),
		new THREE.Color('hsl(0, 100%, 50%)')
	);
	this.createAxis(
		new THREE.Vector3(0, -axisLength, 0),
		new THREE.Vector3(0, axisLength, 0),
		new THREE.Color('hsl(120, 100%, 50%)')
	);
	this.createAxis(
		new THREE.Vector3(0, 0, -axisLength),
		new THREE.Vector3(0, 0, axisLength),
		new THREE.Color('hsl(240, 100%, 50%)')
	);

	return this.object3d;

}

