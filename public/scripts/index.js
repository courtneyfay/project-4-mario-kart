// V2 using Physijs engine instead of some Three

Physijs.scripts.worker = '../scripts/controls/physijs_worker.js'; //path relative to index.html
Physijs.scripts.ammo = 'ammo.js'; //path relative to physijs_worker

let sceneHeight, sceneWidth;
let camera, scene, renderer;
let orbitControls;
let cube;
let selected_block = null;
let blocks = [];
let _v3 = new THREE.Vector3;
let _vector = new THREE.Vector3;
let effect;
let offset;

init();

function init() {
	
	// sets up the scene, camera, renderer and 3D objects
	createScene();

	// calls game loop/animations
	animate();
}

function createScene(){
	// sets the renderer
	renderer = new THREE.WebGLRenderer({antialias: true});
	sceneWidth = window.innerWidth;
  sceneHeight = window.innerHeight;
	renderer.setSize(sceneWidth, sceneHeight); 
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	dom = document.getElementById('MarioKart');
	dom.appendChild(renderer.domElement);

	// sets the scene
	scene = new Physijs.Scene(); //{ fixedTimeStep: 1 / 120 }
	scene.setGravity(new THREE.Vector3(0, -30, 0));
	scene.addEventListener(
		'update',
		function() {
			if ( selected_block !== null ) {
					
					_v3.copy( mouse_position ).add( block_offset ).sub( selected_block.position ).multiplyScalar( 5 );
					_v3.y = 0;
					selected_block.setLinearVelocity( _v3 );
					
					// Reactivate all of the blocks
					_v3.set( 0, 0, 0 );
					for ( _i = 0; _i < blocks.length; _i++ ) {
						blocks[_i].applyCentralImpulse( _v3 );
					}
				}
			scene.simulate(undefined,2);
		}
	);
	// creates sky blue color and adds to the scene
	scene.background = new THREE.Color(0x90A2C5); //skyblue	

	// sets the camera and its position
  let viewAngle = 55;
  let aspect = sceneWidth / sceneHeight;
  let near = 0.1;
  let far = 1000; //2000
	camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
	camera.position.set(0, 1, 5); //(0, 0, 100); // x y z

	// sets ambient light
	let ambient = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambient);

	// sets sunlight with directional lighting effects
	light = new THREE.DirectionalLight(0xFFFFFF, 0.8); 
	light.position.set(3,6,5);
	light.castShadow = true;
	light.shadow.mapSize.width = 256;
	light.shadow.mapSize.height = 256;
	light.shadow.camera.near = 0.5;
	light.shadow.camera.far = 50;
	scene.add(light);

	// enables you to see the light cone from the directional light
	//let helper = new THREE.CameraHelper(light.shadow.camera);
	//scene.add(helper); 

	// creates green grass color and adds to scene
	// let grassWidth = 2000;
	// let grassLength = 800;
	// let grassGeometry = new THREE.PlaneGeometry(grassWidth, grassLength);
	// let grassMaterial = Physijs.createMaterial(
	// 	new THREE.MeshStandardMaterial({color: 'green'}),
	// 	0.8, // high friction
	// 	0.2  // low restitution
	// );
	// let grass = new Physijs.BoxMesh(
	// 	grassGeometry, 
	// 	grassMaterial,
	// 	0 	// mass
	// );
	// grass.rotation.x = -Math.PI / 2;
	// grass.position.y = -1.1;
	// grass.receiveShadow = true;
	// scene.add(grass);

	// creates grey racetrack color and adds to scene
	let racetrackWidth = 11;
	let racetrackHeight = 800;
	let racetrackGeometry = new THREE.PlaneGeometry(racetrackWidth, racetrackHeight);
	let racetrackMaterial = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({color: 0x576259}), //asphalt grey
		0.8,  // high friction
		0.4		// low restitution
	);
	let racetrack = new Physijs.BoxMesh(
		racetrackGeometry, 
		racetrackMaterial,
		0  // mass
	);
	racetrack.receiveShadow = true;
	racetrack.castShadow = false;
	racetrack.rotation.x = -Math.PI / 2;
	racetrack.position.y = -1;
	scene.add(racetrack);

	// creates starting line and adds to scene
	// let startingLineMaterial = new THREE.LineBasicMaterial({color: 0xffffff}); // white starting line
	// let startingLineGeometry = new THREE.Geometry();
	// 	startingLineGeometry.vertices.push(new THREE.Vector3(-1.7, 0, 0)); // x y z
	// 	startingLineGeometry.vertices.push(new THREE.Vector3(1.7, 0, 0)); // x y z
	// let startingLine = new THREE.LineSegments(startingLineGeometry, startingLineMaterial);
	// startingLine.position.y = 0.4;
	// scene.add(startingLine);

	// creates racecube and adds to scene
	let cubeGeometry = new THREE.BoxGeometry(1,1,1);
	let cubeMaterial = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({color: 0xE50009}), // Mario red
		0.8, // high friction
		0.5  // medium restitution
	);
	cube = new Physijs.BoxMesh(
		cubeGeometry, 
		cubeMaterial,
		1000  // mass
	);
	cube.castShadow = true;
	cube.receiveShadow = false;
	cube.position.y = -0.5;
	scene.add(cube);

	// adding constraints to try to get car physics logic to work
	/*cube_constraint = new Physijs.DOFConstraint(
		cube, 																// object A - cube
		cube, 																// object B - cube
		new THREE.Vector3(0, 0, 0)						// position - new vector
	);
	scene.addConstraint(cube_constraint);*/

	// enables you to visualize the x y and z axes
	// let axes = new THREE.AxesHelper(100);
	// scene.add(axes);

	// enables you to visualize the grid
	// let size = 100;
	// let divisions = 100;
	// let gridHelper = new THREE.GridHelper(size, divisions);
	// gridHelper.position.y = -1.0;
	// scene.add(gridHelper);

	// add these back in after you add orbit controls (helper to rotate around in scene)
	// orbitControls = new THREE.OrbitControls(camera); //renderer.domElement
	// orbitControls.enableZoom = true;
	// //orbitControls.addEventListener('change', render);

	// event listeners
	window.addEventListener('resize', onWindowResize, false);
}

function animate() {
	// animates the cube
	// cube.rotation.y += 0.01;
	requestAnimationFrame(animate);
	//camera.position.set(0, 1, 5);
	render();
	update();
}

function render() {
	renderer.render(scene, camera);
}

function update() {

	document.addEventListener('keydown', function(e) {
		// effect = 10;
		// offset = 3;

		switch(e.keyCode) {
			case 37: //left
				console.log('keydown: moving left!');
				vectorForce = new THREE.Vector3(-10,0,0);
				cube.applyCentralImpulse(vectorForce);
				break;
			case 39: //right
				console.log('keydown: moving right!');
				vectorForce = new THREE.Vector3(10,0,0);
				cube.applyCentralImpulse(vectorForce);
				break;
			case 38: //forward
				console.log('keydown: moving forward!');
				vectorForce = new THREE.Vector3(0,0,-10);
				cube.applyCentralImpulse(vectorForce);
				break;
			case 40: //backwards
				console.log('keydown: moving backwards!');
				vectorForce = new THREE.Vector3(0,0,10);
				cube.applyCentralImpulse(vectorForce);
				break;
		}
	});

	/*document.addEventListener('keyup', function(e) {
		switch(e.keyCode) {
			case 37: //left
				console.log('keyup: moving left!'); 
				break;
			case 39: //right
				console.log('keyup: moving right!');
				break;
			case 38: //up
				console.log('keyup: moving up!');
				break;
			case 40: //down
				console.log('keyup: moving down!');
				break;
		}
	});*/

	render();
	scene.simulate();
}

function onWindowResize() {
	
	// resizes and aligns depending on user screen size
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth / sceneHeight;
	camera.updateProjectionMatrix();
}

///////////////////////////////
////////// GRAVEYARD //////////
///////////////////////////////

// adding logic to try to get box physics to work
				// let strength = 35; 
				// let distance = 50;
				// let effect = mouse_position.clone().sub( cube.position ).normalize().multiplyScalar( strength / distance ).negate();
				// let offset = mouse_position.clone().sub( cube.position );
				
				// trying to get car constraints physics to work
				/*cube_constraint.configureAngularMotor(
					1, 							// which
					-Math.PI / 2, 	// low_angle
					Math.PI / 2, 		// high_angle
					1, 							// velocity
					200							// max_force
				);
				cube_constraint.enableAngularMotor(1); //which*/

// TRY WHEN YOU WANT TO ADD TEXTURES INSTEAD OF JUST COLORS
// Loader
/*loader = new THREE.TextureLoader();

// Materials
ground_material = Physijs.createMaterial(
	new THREE.MeshLambertMaterial({ map: loader.load( 'images/rocks.jpg' ) }),
	.8, // high friction
	.4 // low restitution
);
ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
ground_material.map.repeat.set( 3, 3 );

// Ground
ground = new Physijs.BoxMesh(
	new THREE.BoxGeometry(100, 1, 100),
	ground_material,
	0 // mass
);
ground.receiveShadow = true;
scene.add( ground );*/

// playing with the Jenga event handlers
// handleMouseDown
	/*document.addEventListener('mousedown', function(evt) {
		var ray, intersections;
		
		_vector.set(
			( evt.clientX / window.innerWidth ) * 2 - 1,
			-( evt.clientY / window.innerHeight ) * 2 + 1,
			1
		);
		_vector.unproject( camera );
		
		ray = new THREE.Raycaster( camera.position, _vector.sub( camera.position ).normalize() );
		intersections = ray.intersectObjects( blocks );
		if ( intersections.length > 0 ) {
			selected_block = intersections[0].object;
			
			_vector.set( 0, 0, 0 );
			selected_block.setAngularFactor( _vector );
			selected_block.setAngularVelocity( _vector );
			selected_block.setLinearFactor( _vector );
			selected_block.setLinearVelocity( _vector );
			mouse_position.copy( intersections[0].point );
			block_offset.subVectors( selected_block.position, mouse_position );
			
			intersect_plane.position.y = mouse_position.y;
		}
	});
	
	// handleMouseMove
	document.addEventListener('mousemove', function(evt) {
		var ray, intersection,
			i, scalar;
		
		if ( selected_block !== null ) {
			
			_vector.set(
				( evt.clientX / window.innerWidth ) * 2 - 1,
				-( evt.clientY / window.innerHeight ) * 2 + 1,
				1
			);
			_vector.unproject( camera );
			
			ray = new THREE.Raycaster( camera.position, _vector.sub( camera.position ).normalize() );
			intersection = ray.intersectObject( intersect_plane );
			mouse_position.copy( intersection[0].point );
		}	
	});
	
	// handleMouseUp
	document.addEventListener('mouseup', function(evt) {
		if ( selected_block !== null ) {
			_vector.set( 1, 1, 1 );
			selected_block.setAngularFactor( _vector );
			selected_block.setLinearFactor( _vector );
			
			selected_block = null;
		}
	});*/

// creates starting line banner and adds to scene
// let poleGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
// let poleMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
// let pole = new THREE.Mesh(poleGeometry, poleMaterial);
// pole.position.y = 10;
// scene.add(pole);

// creates sky and adds to scene -- not working
// let skyGeometry = new THREE.SphereGeometry(100000, 25, 25); 
// let loader  = new THREE.TextureLoader();
// loader.setCrossOrigin("");
// texture = loader.load("./images/sky2.jpeg");
// let material = new THREE.MeshPhongMaterial({map: texture});
// let sky = new THREE.Mesh(skyGeometry, material);
// sky.material.side = THREE.BackSide;
// scene.add(sky);

// point light: alternative to directional light
// let light = new THREE.PointLight(0xffffff);
// light.position.set(10,10,10);
// scene.add(light);
// enables you to see the light cone from the point light
// let pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper);


