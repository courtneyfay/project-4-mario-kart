// V2 using Physijs engine instead of some Three

Physijs.scripts.worker = '../scripts/controls/physijs_worker.js'; //path relative to index.html
Physijs.scripts.ammo = 'ammo.js'; //path relative to physijs_worker

let sceneHeight, sceneWidth;
let perspectiveCamera;
let scene;
let renderer;
let orbitControls;
let cube;
let countdownBall;
let countdownClock;
let finishLineDistance = -250;
let font;
let timerHTML = document.getElementById("timer");
let startTime = "00 '00 \"00";
let raceClock;
let shrinkScreenSize = 4;
let minimapCamera; 
let minimapWidth = 240; 
let minimapHeight = 160; // w/h should match div dimensions
let gameoverHTML = document.getElementById("game-over");
let gameOverBoolean = false;

// sets up the scene, camera, renderer and 3D objects
createScene();
// calls game loop/animations
animate();

function createScene(){
	// sets the renderer
	renderer = new THREE.WebGLRenderer({antialias: true});
	sceneWidth = window.innerWidth - shrinkScreenSize;
  sceneHeight = window.innerHeight - shrinkScreenSize;
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
			scene.simulate(undefined,2);
		}
	);
	
	// creates sky blue color and adds to the scene
	//scene.background = new THREE.Color(0x90A2C5); //skyblue	

	// sets up a game clock to start the countdown
	countdownClock = new THREE.Clock();

	// 0: orthographic camera
	minimapCamera = new THREE.OrthographicCamera(
    window.innerWidth / -2,			// Left
    window.innerWidth / 2,			// Right
    window.innerHeight / 2,			// Top
    window.innerHeight / -2,		// Bottom
    -5000,            					// Near 
    10000);           					// Far 
	minimapCamera.up = new THREE.Vector3(0,0,-1);
	minimapCamera.lookAt(new THREE.Vector3(0,-1,0));
	scene.add(minimapCamera);

	// 1: sets the perspective camera and its position
  let viewAngle = 55;
  let aspect = sceneWidth / sceneHeight;
  let near = 1;
  let far = 1000; //2000
	perspectiveCamera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
	perspectiveCamera.position.set(0, 2, 10); //(0, 0, 100); // x y z
	perspectiveCamera.lookAt(scene.position);
	scene.add(perspectiveCamera);

	// 2: sets ambient light
	let ambient = new THREE.AmbientLight(0xFFFFFF, 0.5);
	scene.add(ambient);

	// 3: sets sunlight with directional lighting effects
	light = new THREE.DirectionalLight(0xFFFFFF, 0.8); 
	light.position.set(0,500,5); // x y z
	light.castShadow = true;
	light.shadow.mapSize.width = 256;
	light.shadow.mapSize.height = 256;
	light.shadow.camera.near = 0.5;
	light.shadow.camera.far = 50;
	scene.add(light);

	// 4: creates green grass color and adds to scene
	let grassWidth = 100;
	let grassLength = 1600;
	let grassGeometry = new THREE.PlaneGeometry(grassWidth, grassLength);
	let grassMaterial = Physijs.createMaterial(
		new THREE.MeshStandardMaterial({color: 'green'}),
		1.0, // highest friction
		0.4  // lowest restitution
	);
	let grass = new Physijs.BoxMesh(
		grassGeometry, 
		grassMaterial,
		0 	// mass
	);
	grass.rotation.x = -Math.PI / 2;
	grass.position.y = -1.1;
	grass.receiveShadow = true;
	scene.add(grass);

	// 5: creates grey racetrack color and adds to scene
	let racetrackWidth = 11;
	let racetrackHeight = 1600;
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

	// 6: creates startingLine plane and adds to scene
	let startingLineWidth = 11;
	let startingLineHeight = 3;
	let startingLineGeometry = new THREE.PlaneGeometry(startingLineWidth, startingLineHeight);
	let startingLineMaterial = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({color: 0xffffff}), // white
		0.8,  // high friction
		0.4		// low restitution
	);
	let startingLine = new Physijs.BoxMesh(
		startingLineGeometry, 
		startingLineMaterial,
		0  // mass
	);
	startingLine.receiveShadow = true;
	startingLine.castShadow = false;
	startingLine.rotation.x = -Math.PI / 2;
	startingLine.position.y = -0.999;
	startingLine.position.z = 775;
	scene.add(startingLine);

	// 7: creates finishLine plane and adds to scene
	let finishLineWidth = 11;
	let finishLineHeight = 3;
	let finishLineGeometry = new THREE.PlaneGeometry(finishLineWidth, finishLineHeight);
	let finishLineMaterial = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({color: 0xffffff}), // white
		0.8,  // high friction
		0.4		// low restitution
	);
	let finishLine = new Physijs.BoxMesh(
		finishLineGeometry, 
		finishLineMaterial,
		0  // mass
	);
	finishLine.receiveShadow = true;
	finishLine.castShadow = false;
	finishLine.rotation.x = -Math.PI / 2;
	finishLine.position.y = -0.99;
	finishLine.position.z = finishLineDistance;
	scene.add(finishLine);

	// 8: creates racecube and adds to scene
	let cubeGeometry = new THREE.BoxGeometry(1,1,1);
	let cubeMaterial = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({color: 0xE50009}), // Mario red
		0.8, // highest friction
		0.4  // medium restitution
	);
	cube = new Physijs.BoxMesh(
		cubeGeometry, 
		cubeMaterial,
		1500  // mass
	);
	cube.castShadow = true;
	cube.receiveShadow = true;
	cube.position.y = -0.5;
	cube.position.z = 780;
	scene.add(cube);
	// cube.add(perspectiveCamera);
	
	// 9: countdown ball
	// starts invisible
	let ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
	let ballMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0}); 
	let countdownBall = new THREE.Mesh(ballGeometry, ballMaterial);
	countdownBall.castShadow = true;
	countdownBall.receiveShadow = true;
	countdownBall.position.y = 1;
	countdownBall.position.x = 1;
	countdownBall.position.z = 780;
	scene.add(countdownBall);

	// enables you to see the light cone from the directional light
	// let helper = new THREE.CameraHelper(light.shadow.camera);
	// scene.add(helper); 

	// camera helper
	// let perspectiveCameraHelper = new THREE.CameraHelper(perspectiveCamera);
	// scene.add(perspectiveCameraHelper);

	// minimapCamera helper
	// let minimapCameraHelper = new THREE.CameraHelper(minimapCamera);
	// scene.add(minimapCameraHelper);

	// enables you to visualize the x y and z axes
	// let axesHelper = new THREE.AxesHelper(100);
	// scene.add(axesHelper);

	// enables you to visualize the grid
	// let size = 1000;
	// let divisions = 100;
	// let gridHelper = new THREE.GridHelper(size, divisions);
	// gridHelper.position.y = -1.0;
	// scene.add(gridHelper);

	// add these back in after you add orbit controls (helper to rotate around in scene)
	// orbitControls = new THREE.OrbitControls(perspectiveCamera); //renderer.domElement
	// orbitControls.enableZoom = true;

	// event listeners
	window.addEventListener('resize', onWindowResize, false);

	// set the renderer
	renderer.setSize(sceneWidth, sceneHeight);
	renderer.setClearColor(0x000000, 1);
	renderer.autoClear = false;
}

function animate() {
	requestAnimationFrame(animate); 
	render();
	update();
}

function render() {
	if (gameOverBoolean !== true) {
		let sceneWidth = window.innerWidth;
		let sceneHeight = window.innerHeight;

		// setViewport parameters: lower_left_x, lower_left_y, viewport_width, viewport_height
		renderer.setViewport(0, 0, sceneWidth, sceneHeight);
		renderer.clear();

		// full display
		renderer.render(scene, perspectiveCamera);

		// minimap (overhead orthogonal camera): lower_left_x, lower_left_y, viewport_width, viewport_height
		renderer.setViewport(-75, sceneHeight - minimapHeight - 20, minimapWidth, minimapHeight);
		renderer.render(scene, minimapCamera);
	}
}

function update() {
	if (gameOverBoolean !== true) {
		countdownBall = scene.children[9];
		currentTime = countdownClock.getElapsedTime();

		if (currentTime >= 4 && currentTime < 10.025) {
			startCountdownClock(countdownBall, currentTime);
		} else if (currentTime >= 10.025) {
			checkWinner();
		}

		//perspectiveCamera.rotation.y += 0.001;

		updateCameraPositionZ();
		render();
		scene.simulate();
	}
}

function startCountdownClock(countdownBall, currentTime) {
	
	if (currentTime >= 4 && currentTime < 10.025) {
		// wait for 4 seconds after game loads to make countdown ball appear
		countdownBall.material.color.setHex(0x000000);
		countdownBall.material.opacity = 0.75; 

		if (currentTime >= 7 && currentTime < 8) {
			//stoplight starts at red
			countdownBall.material.color.setHex(0xff0000); 
		} else if (currentTime >= 8 && currentTime < 9) {
			//stoplight changes to yellow
			countdownBall.material.color.setHex(0xffff00); 
		} else if (currentTime >= 9 && currentTime < 10) {
			//stoplight ends at green
			countdownBall.material.color.setHex(0x00ff00); 
		} else if (currentTime >=10 && currentTime < 10.025) {
			// remove countdown timer
			console.log("trying to remove the countdownBall again");
			scene.remove(countdownBall);
			
			// after the countdown timer ends, start the race timer
			startTimer();
		}
	} 
}

function checkWinner() {
	if (cube.position.z <= finishLineDistance) {
		// console.log("you made it to the finish line!");
		gameOver();
	} else {
		// update the time on the race clock
		updateTimer();
		// after the countdown timer ends, you can start to move with the arrow keys
		document.addEventListener('keyup', handler.bind(this), false);
	}
}

function gameOver() {
	gameOverBoolean = true;
	stopTimer();
	cube.setLinearVelocity(new THREE.Vector3(0, 0, 0));
  cube.setAngularVelocity(new THREE.Vector3(0, 0, 0));
  let onAnimationFrame = null;
  //document.removeEventListener('keyup', handler.bind(this), false);
  gameoverHTML.textContent = "GAME OVER!";
  let arrows = document.getElementById("arrows");
  arrows.parentNode.removeChild(arrows);
  console.log(raceClock.getElapsedTime()); 	//timer.textContent);
}

function handler(e) {
	moveCube(e);
}

function startTimer() {
	// after the countdown timer ends, race timer appears in the top right corner
	timerHTML.textContent = "TIME " + startTime;
	raceClock = new THREE.Clock();
}

function updateTimer() {
	let updatedTime;
	let rawTime = raceClock.getElapsedTime();

	if (rawTime >= 60) {
		updatedTime = "'0";
		updatedTime += Math.round(rawTime / 60);
		let seconds = Math.round(rawTime % 60);
		if (seconds >= 10) {
			updatedTime += " \"";
			updatedTime += seconds;
		} else {
			updatedTime += " \"0";
			updatedTime += seconds;
		}
	} else if (Math.round(rawTime) < 60 && Math.round(rawTime) >= 10) {
		updatedTime = "'00 \"";
		updatedTime += Math.round(rawTime);
	} else if (Math.round(rawTime) < 10 && Math.round(rawTime) >= 0) {
		updatedTime = "'00 \"";
		updatedTime += "0";
		updatedTime += Math.round(rawTime);
	}

	timerHTML.textContent = "TIME " + updatedTime;
}

function stopTimer() {
	raceClock.stop();
}

//let moveCube = function(e) {
function moveCube(e) {
	//console.log(e);
	if (gameOverBoolean !== true) {
		cube = scene.children[8];
		// console.log("scene child");
		// console.log(scene.children[8]);
		// console.log("cube");
		// console.log(cube);

		switch(e.keyCode) {
			case 37: //left
				vectorForce = new THREE.Vector3(-5,0,0);
				cube.applyCentralImpulse(vectorForce);
				break;
			case 39: //right
				vectorForce = new THREE.Vector3(5,0,0);
				cube.applyCentralImpulse(vectorForce);
				break;
			case 38: //forward
				// console.log(e);
				// console.log(cube);
				//console.log(Math.round(cube.position.z));
				vectorForce = new THREE.Vector3(0,0,-5);
				cube.applyCentralImpulse(vectorForce);
				break;
		}
	}	
}

function updateCameraPositionZ() {
	perspectiveCamera.position.z = cube.position.z + 10;
	// let lightPosition = cube.position.z + 5;
	// light.position.set(3, 6, lightPosition); 
}

function onWindowResize() {
	// resizes and aligns depending on user screen size
	sceneHeight = window.innerHeight - shrinkScreenSize;
	sceneWidth = window.innerWidth - shrinkScreenSize;
	renderer.setSize(sceneWidth, sceneHeight);
	perspectiveCamera.aspect = sceneWidth / sceneHeight;
	perspectiveCamera.updateProjectionMatrix();
}

///////////////////////////////
////////// GRAVEYARD //////////
///////////////////////////////

// raceClock timer
//"00 '00 \"00";
// rawMilliseconds = Math.round(rawTime * 100) / 100;
// stringMilliseconds = rawMilliseconds.toString();
// milliseconds = stringMilliseconds.substring(stringMilliseconds.indexOf(".") + 1);
// updatedTime = milliseconds;

/*for (var vertexIndex = 0; vertexIndex < MovingCube.geometry.vertices.length; vertexIndex++)
{		
	var localVertex = MovingCube.geometry.vertices[vertexIndex].clone();
	var globalVertex = localVertex.applyMatrix4( MovingCube.matrix );
	var directionVector = globalVertex.sub( MovingCube.position );
	
	var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
	var collisionResults = ray.intersectObjects( collidableMeshList );
	if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
		appendText(" Hit ");
}	*/

/*
// creates starting line and adds to scene
let startingLineMaterial = new THREE.LineBasicMaterial({color: 0xffffff}); // white starting line
let startingLineGeometry = new THREE.Geometry();
	startingLineGeometry.vertices.push(new THREE.Vector3(-5.5, 0, 0)); // x y z
	startingLineGeometry.vertices.push(new THREE.Vector3(5.5, 0, 0)); // x y z
let startingLine = new THREE.LineSegments(startingLineGeometry, startingLineMaterial);
startingLine.position.z = -5;
startingLine.position.y = -1;
scene.add(startingLine);
*/

// let materialFront = new THREE.MeshBasicMaterial({color: 0xff0000});
	// let materialSide = new THREE.MeshBasicMaterial({color: 0x000088});
	// let numberMaterial = [materialFront, materialSide];
	// let numberMaterial = new THREE.MeshFaceMaterial(materialArray);
	// let numberThreeGeometry = new THREE.TextGeometry(
	// 	"3",
	// 	{
	// 		size: 30, 
	// 		height: 4, 
	// 		curveSegments: 3,
	// 		font: "helvetiker", // or gentilis, droid sans, droid serif, optimer
	// 		weight: "bold", // or normal
	// 		style: "normal",
	// 		bevelThickness: 1,
	// 		bevelSize: 2, 
	// 		bevelEnabled: true,
	// 		material: 0,
	// 		extrudeMaterial: 1
	// 	}
	// );

	// let numberThree = new THREE.Mesh(numberThreeGeometry, numberMaterial);
	
	// numberThreeGeometry.computeBoundingBox();
	// let numberWidth = numberThreeGeometry.boundingBox.max.x - numberThreeGeometry.boundingBox.min.x;

	// numberThree.position.set(-0.5 * numberWidth, 50, 100);
	// numberThree.rotation.x = -Math.PI / 4;
	// scene.add(numberThree);

/*
fontLoader.load("public/styles/fonts/helvetiker_regular.typeface.json", function(font) {

		let textGeometry = new THREE.TextGeometry("Hello three.js!", 
			{
				font: 'Helvetiker',
				
				size: 80,
				height: 5,
				curveSegments: 12,
				
				bevelEnabled: true,
				bevelThickness: 10,
				bevelSize: 8,
				bevelSegments: 5
			}
		);

		textGeometry.computeBoundingBox();
		let centerOffset = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);

		let textMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, specular: 0xffffff });

		let text = new THREE.Mesh(textGeometry, textMaterial);
		text.position.x(centerOffset);
		text.position.y = FLOOR + 67;

		text.castShadow = true;
		text.receiveShadow = true;

		scene.add(text);

});
*/

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

// vectorOffset = new THREE.Vector3(-10,0,0);
// cube.applyForce(vectorForce, vectorOffset);	

// adding constraints to try to get car physics logic to work
	/*cube_constraint = new Physijs.DOFConstraint(
		cube, 																// object A - cube
		cube, 																// object B - cube
		new THREE.Vector3(0, 0, 0)						// position - new vector
	);
	scene.addConstraint(cube_constraint);*/

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
// let textureLoader = new THREE.TextureLoader();
// 	textureLoader.crossOrigin = '';
// 	let sky = textureLoader.load("./public/images/sky2.jpeg");
// 	console.log(textureLoader);
// 	sky.wrapS = THREE.RepeatWrapping;
// 	sky.wrapT = THREE.RepeatWrapping;
// 	sky.repeat.set(4, 4);
// 	scene.background = new THREE.Texture(sky);

// point light: alternative to directional light
// let light = new THREE.PointLight(0xffffff);
// light.position.set(10,10,10);
// scene.add(light);
// enables you to see the light cone from the point light
// let pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper);

/*if ( selected_block !== null ) {
					
					_v3.copy( mouse_position ).add( block_offset ).sub( selected_block.position ).multiplyScalar( 5 );
					_v3.y = 0;
					selected_block.setLinearVelocity( _v3 );
					
					// Reactivate all of the blocks
					_v3.set( 0, 0, 0 );
					for ( _i = 0; _i < blocks.length; _i++ ) {
						blocks[_i].applyCentralImpulse( _v3 );
					}
				}*/


