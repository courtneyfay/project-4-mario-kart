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
let audioPlayer = document.getElementsByTagName('audio')[0];
let endOfCountdown = 11.775;

// sets up the scene, camera, renderer and 3D objects
createScene();
// calls game loop/animations
animate();
// adds audio
audioPlayer.play();

function createScene(){

	// remove scores from div
	// document.getElementById('game-scores').textContent = "";

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
			scene.simulate(undefined, 2);
		}
	);

	// adds skybox to the scene
	let path = "images/skybox/";
	let format = ".png";
	let urls = [
		path + 'sky-xpos' + format, 
		path + 'sky-xneg' + format, 
		path + 'sky-ypos' + format, 
		path + 'sky-yneg' + format, 
		path + 'sky-zpos' + format, 
		path + 'sky-zneg' + format
	];
	skyBoxTexture = new THREE.CubeTextureLoader().load(urls);
	skyBoxTexture.minFilter = THREE.LinearFilter;
	scene.background = skyBoxTexture;

	// sets up a game clock to start the countdown
	countdownClock = new THREE.Clock();

	// 0: orthographic camera
	minimapCamera = new THREE.OrthographicCamera(
    window.innerWidth / -2,			// Left
    window.innerWidth / 2,			// Right
    window.innerHeight / 2,			// Top
    window.innerHeight / -2,		// Bottom
    -5000,            					// Near 
    10000												// Far 
  );           					
	minimapCamera.up = new THREE.Vector3(0,0,-1);
	minimapCamera.lookAt(new THREE.Vector3(0,-1,0));
	minimapCamera.name = "minimapCamera";
	scene.add(minimapCamera);

	// 1: sets the perspective camera and its position
  let viewAngle = 55;
  let aspect = sceneWidth / sceneHeight;
  let near = 1;
  let far = 1000; //2000
	perspectiveCamera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
	perspectiveCamera.position.set(0, 0, 790); //x = 0, y = 2 //(0, 0, 100); // x y z
	perspectiveCamera.lookAt(scene.position);
	perspectiveCamera.name = "perspectiveCamera"; 
	scene.add(perspectiveCamera);

	// 2: sets ambient light
	let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
	ambientLight.name = "ambientLight";
	scene.add(ambientLight);

	// 3: sets sunlight with directional lighting effects
	light = new THREE.DirectionalLight(0xFFFFFF, 0.8); 
	light.position.set(0,500,5); // x y z
	light.castShadow = true;
	light.shadow.mapSize.width = 256;
	light.shadow.mapSize.height = 256;
	light.shadow.camera.near = 0.5;
	light.shadow.camera.far = 50;
	light.name = "light"; 
	scene.add(light);

	// 4: creates green grass color and adds to scene
	let grassWidth = 100;
	let grassLength = 1600;
	let grassGeometry = new THREE.PlaneGeometry(grassWidth, grassLength);
	let grassTexture = new THREE.TextureLoader().load('images/grass.jpg');
	grassTexture.wrapT = grassTexture.wrapS = THREE.RepeatWrapping;
	grassTexture.repeat.set(17, 70);
	let grassMaterial = Physijs.createMaterial(
		new THREE.MeshBasicMaterial({map: grassTexture}),
		//new THREE.MeshStandardMaterial({color: 'green'}),
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
	grass.name = "grass";
	scene.add(grass);

	// 5: creates grey racetrack color and adds to scene
	let racetrackWidth = 11;
	let racetrackHeight = 1600;
	let racetrackGeometry = new THREE.PlaneGeometry(racetrackWidth, racetrackHeight);
	let racetrackTexture = new THREE.TextureLoader().load('images/road.jpg');
	racetrackTexture.wrapT = racetrackTexture.wrapS = THREE.RepeatWrapping;
	racetrackTexture.repeat.set(1, 40);
	let racetrackMaterial = Physijs.createMaterial(
		new THREE.MeshBasicMaterial({map: racetrackTexture}),
		//new THREE.MeshLambertMaterial({color: 0x576259}), //asphalt grey
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
	racetrack.name = "racetrack";
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
	startingLine.name = "startingLine";
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
	finishLine.name = "finishLine";
	scene.add(finishLine);

	// 8: countdown ball
	//starts invisible
	// let ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
	// let ballMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0}); 
	// let countdownBall = new THREE.Mesh(ballGeometry, ballMaterial);
	// countdownBall.castShadow = true;
	// countdownBall.receiveShadow = true;
	// countdownBall.position.y = 1;
	// countdownBall.position.x = 1;
	// countdownBall.position.z = 780;
	// countdownBall.name = "countdownBall";
	// scene.add(countdownBall);

	// 9: creates racecube and adds to scene
	let objectLoader = new THREE.ObjectLoader();
	objectLoader.load("models/mario.json", function(obj){
		cubeObject = obj.children[2];
		cubeGeometry = cubeObject.geometry;
		let cubeMaterial = Physijs.createMaterial(
	    cubeObject.material,
	    0.8, //high friction
	    0.3 // medium restitution
		);

		cube = new Physijs.BoxMesh(
			cubeGeometry,
			cubeMaterial,
			1000 	// mass
		);
		cube.scale.set(0.015, 0.015, 0.015);
		cube.castShadow = true;
		cube.receiveShadow = true;
		
		// set rotation
		cube.rotation.x = -Math.PI / 2;
		cube.rotation.z = -135;

		// set position
		cube.position.y = -0.5;
		cube.position.x = -Math.PI/2;
		cube.position.z = 780;

		cube.name = "cube";

    scene.add(cube);

    // enables you to see the bounding box for an object
    let boxHelper = new THREE.BoxHelper(cube, 0x000000); //black
    scene.add(boxHelper);
	});

	// boxHelper.setFromObject();
	// boxHelper.update();
	
	// enables you to see the light cone from the directional light
	// let helper = new THREE.CameraHelper(light.shadow.camera);
	// scene.add(helper); 

	// camera helper
	// let perspectiveCameraHelper = new THREE.CameraHelper(perspectiveCamera);
	// scene.add(perspectiveCameraHelper);

	// minimapCamera helper
	//let minimapCameraHelper = new THREE.CameraHelper(minimapCamera);
	//scene.add(minimapCameraHelper);

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
	orbitControls = new THREE.OrbitControls(perspectiveCamera); //renderer.domElement
	orbitControls.enableZoom = true;

	// event listeners
	window.addEventListener('resize', onWindowResize, false);

	// set the renderer
	renderer.setSize(sceneWidth, sceneHeight);
	renderer.setClearColor(0x000000, 1);
	renderer.autoClear = false;
}

function addModelToScene( geometry, materials ) 
{
	var cubeMaterial = new THREE.MeshFaceMaterial( materials );
	cube = new THREE.Mesh( geometry, material );
	cube.scale.set(10,10,10);
	cube.castShadow = true;
	cube.receiveShadow = true;
	cube.position.y = -0.5;
	cube.position.z = 780;
	scene.add(cube);
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
		countdownBall;
		// countdownBall = scene.children[7];
		currentTime = countdownClock.getElapsedTime();

		if (currentTime >= 4 && currentTime < endOfCountdown) {
			startCountdownClock(countdownBall, currentTime);
		} else if (currentTime >= endOfCountdown) {
			checkWinner();
		}

		//perspectiveCamera.rotation.y += 0.001;

		updateCameraPosition();
		render();
		scene.simulate();
	}
}

function startCountdownClock(countdownBall, currentTime) {
	
	if (currentTime >= 4 && currentTime < endOfCountdown) {
		// wait for 4 seconds after game loads to make countdown ball appear
		countdownBall.material.color.setHex(0x000000);
		countdownBall.material.opacity = 0.75; 

		if (currentTime >= 8 && currentTime < 9.25) {
			//stoplight starts at red
			countdownBall.material.color.setHex(0xff0000); 
		} else if (currentTime >= 9.25 && currentTime < 10.5) {
			//stoplight changes to yellow
			countdownBall.material.color.setHex(0xffff00); 
		} else if (currentTime >= 10.5 && currentTime < 11.75) {
			//stoplight ends at green
			countdownBall.material.color.setHex(0x00ff00); 
		} else if (currentTime >= 11.75 && currentTime < endOfCountdown) {
			// remove countdown timer
			console.log("trying to remove the countdownBall again");
			scene.remove(countdownBall);
			
			// after the countdown timer ends, start the race timer
			startTimer();

			// change the music so that it plays the race sounds
			audioPlayer.src = "audio/race_music_1.mp3";
			audioPlayer.load();
			audioPlayer.loop = true;
			audioPlayer.play();
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
		document.addEventListener('keydown', handler.bind(this), false);
	}
}

function gameOver() {
	gameOverBoolean = true;
	// change the music so that it plays the game-over sounds
	audioPlayer.src = "audio/end_of_race.mp3";
	audioPlayer.loop = false;
	audioPlayer.load();
	audioPlayer.play();

	stopTimer();
	stopGame();
  saveScore();
  getHighScores();
}

function stopGame() {
	cube.setLinearVelocity(new THREE.Vector3(0, 0, 0));
  cube.setAngularVelocity(new THREE.Vector3(0, 0, 0));
  let onAnimationFrame = null;
  //document.removeEventListener('keydown', handler.bind(this), false);
  let arrows = document.getElementById("arrows");
  arrows.parentNode.removeChild(arrows);
}

function getHighScores() {
	gameoverHTML.textContent = "GAME OVER!";
	$.getScript('/scripts/ajax.js', function() {
		indexScores();
	});
}

function saveScore() {
	/*
	Points system:
	10 seconds - 50 points
	20 seconds - 40 points
	30 seconds - 30 points
	40 seconds - 20 points
	50 seconds - 10 points
	*/
	let finalTime = raceClock.getElapsedTime();

	let finalScore = 60 - (Math.round(finalTime) * 1);

	let finalData = {
		time: finalTime,
		score: finalScore
	};

	$.getScript('/scripts/ajax.js', function() {
		createScore(finalData);
	});
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

function updateCameraPosition() {
	// console.log(cube.position.z);
	if (cube) {
		perspectiveCamera.position.z = cube.position.z + 10; //+ 10
		perspectiveCamera.position.x = cube.position.x; // + 10; //+ 0
		perspectiveCamera.position.y = 0; //cube.position.y; 

		// console.log(cube.position.y);
		// if (cube.position.y === -1) {
		// 	console.log("they're the same");
		// }
	} 
}

function onWindowResize() {
	// resizes and aligns depending on user screen size
	sceneHeight = window.innerHeight - shrinkScreenSize;
	sceneWidth = window.innerWidth - shrinkScreenSize;
	renderer.setSize(sceneWidth, sceneHeight);
	perspectiveCamera.aspect = sceneWidth / sceneHeight;
	perspectiveCamera.updateProjectionMatrix();
}