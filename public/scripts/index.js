// V2 using Physijs engine instead of some Three

Physijs.scripts.worker = '../scripts/controls/physijs_worker.js'; //path relative to index.html
Physijs.scripts.ammo = 'ammo.js'; //path relative to physijs_worker

let sceneHeight, sceneWidth;
let perspectiveCamera;
let scene;
let renderer;
let orbitControls;
let cube, cubeTwo;
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
let map;
let racetrackImage;

selectMap();

//shows the map-select page
function selectMap(){
	// open map-select modal
	let modal = document.getElementById('map-select-modal');
	modal.style.display = 'block';

	// add "map select" title to map-select modal
	mapSelect = document.createElement('div');
	mapSelect.textContent = "MAP SELECT";
	mapSelect.setAttribute("id", "map-select-modal-title");
	modal.appendChild(mapSelect);

	// TODO add this data to a new table in the database and pull it from there
	mapArray = [ 
	{
		direction: 'map-select-left',
		text: 'LUIGI RACEWAY',
		element: 'luigi-raceway',
		src: '/images/luigi-raceway.jpg'
	},
	{
		direction: 'map-select-right',
		text: 'RAINBOW ROAD',
		element: 'rainbow-road',
		src: '/images/rainbow-road.jpg'
	} 
	];

	for (let i = 0; i < mapArray.length; i++) {
		// create new map div
		mapDiv = document.createElement('div');
		mapDiv.setAttribute("id", mapArray[i].direction); 
		mapDiv.setAttribute("class", "animate");
		
		// create new map button
		mapButton = document.createElement("button");
		mapButton.textContent = mapArray[i].text;
		mapButton.setAttribute("class", "map-select-button");
		mapButton.setAttribute("id", mapArray[i].element);
		mapButton.addEventListener("click", setUpMap);
		
		// create new map image
		mapImage = document.createElement("img");
		mapImage.setAttribute("src", mapArray[i].src);
		mapImage.setAttribute("class", "map-select-image");

		// append button and image to div and then to modal
		mapDiv.appendChild(mapButton);
		mapDiv.appendChild(mapImage);
		modal.appendChild(mapDiv);
	}	
}

function setUpMap(event) {
	map = event.target.id;

	// hide map-select modal
	let modal = document.getElementById('map-select-modal');
	modal.style.display = 'none';

	//play intro_music  sound
	audioPlayer.src = "audio/intro_music.mp3";
	audioPlayer.load();
	audioPlayer.play();
	
	if (map === 'luigi-raceway') {
		startGame();
	} else if (map === 'rainbow-road') {
		startGame();
	}
}

function startGame(){
	// sets up the scene, camera, renderer and 3D objects
	createScene();
	// calls game loop/animations
	animate();
}

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
	scene = new Physijs.Scene(); 
	scene.setGravity(new THREE.Vector3(0, -30, 0));
	scene.addEventListener(
		'update',
		function() {
			scene.simulate(undefined, 2);
		}
	);

	// adds skybox to the scene
	if (map === 'luigi-raceway') {
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
	} else if (map === 'rainbow-road') {
		let path = "images/starskybox/";
		let format = ".png";
		let prefix = 'star';
		let urls = [
			path + prefix + '-xpos' + format, 
			path + prefix + '-xneg' + format, 
			path + prefix + '-ypos' + format, 
			path + prefix + '-yneg' + format, 
			path + prefix + '-zpos' + format, 
			path + prefix + '-zneg' + format
		];
		skyBoxTexture = new THREE.CubeTextureLoader().load(urls);
		skyBoxTexture.minFilter = THREE.LinearFilter;
		scene.background = skyBoxTexture;
	}

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
	minimapCamera.up = new THREE.Vector3(0, 0, -1);
	minimapCamera.lookAt(new THREE.Vector3(0, -1, 0));
	minimapCamera.name = "minimapCamera";
	scene.add(minimapCamera);

	// 1: sets the perspective camera and its position
  let viewAngle = 55;
  let aspect = sceneWidth / sceneHeight;
  let near = 1;
  let far = 1000; //2000
	perspectiveCamera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
	perspectiveCamera.position.set(-1.5, 4, 790); //x = 0, y = 1, z = 780
	perspectiveCamera.lookAt(scene.position);
	perspectiveCamera.name = "perspectiveCamera"; 
	scene.add(perspectiveCamera);

	// 2: sets ambient light
	let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
	ambientLight.name = "ambientLight";
	scene.add(ambientLight);

	// 3: sets sunlight with directional lighting effects
	light = new THREE.DirectionalLight(0xFFFFFF, 0.8); 
	light.position.set(0, 500, 5); // x y z
	light.castShadow = true;
	light.shadow.mapSize.width = 256;
	light.shadow.mapSize.height = 256;
	light.shadow.camera.near = 0.5;
	light.shadow.camera.far = 50;
	light.name = "light"; 
	scene.add(light);

	// 4: countdown ball
	//starts invisible
	let ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
	let ballMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0}); 
	let countdownBall = new THREE.Mesh(ballGeometry, ballMaterial);
	countdownBall.castShadow = true;
	countdownBall.receiveShadow = true;
	countdownBall.position.y = 2;
	countdownBall.position.x = 1;
	countdownBall.position.z = 780;
	countdownBall.name = "countdownBall";
	scene.add(countdownBall);

	// 5: creates green grass color and adds to scene
	if (map === 'luigi-raceway') {
		let grassWidth = 100;
		let grassLength = 1600;
		let grassGeometry = new THREE.PlaneGeometry(grassWidth, grassLength);
		let grassTexture = new THREE.TextureLoader().load('images/grass.jpg');
		grassTexture.wrapT = grassTexture.wrapS = THREE.RepeatWrapping;
		grassTexture.repeat.set(17, 70);
		let grassMaterial = Physijs.createMaterial(
			new THREE.MeshBasicMaterial({map: grassTexture}),
			1.0, // highest friction
			0.4  // lowest restitution
		);
		let grass = new Physijs.BoxMesh(
			grassGeometry, 
			grassMaterial,
			0 	// mass
		);
		grass.rotation.x = -Math.PI/2;
		grass.position.y = -0.75;
		grass.receiveShadow = true;
		grass.name = "grass";
		scene.add(grass);
	} 

	// 6: creates grey racetrack color and adds to scene
	if (map === 'luigi-raceway') {
		racetrackImage = 'images/road.jpg';
	} else if (map === 'rainbow-road') {
		racetrackImage = 'images/rainbow.jpg';
	}

	let racetrackWidth = 11;
	let racetrackHeight = 1600;
	let racetrackGeometry = new THREE.PlaneGeometry(racetrackWidth, racetrackHeight);
	let racetrackTexture = new THREE.TextureLoader().load(racetrackImage);
	racetrackTexture.wrapT = racetrackTexture.wrapS = THREE.RepeatWrapping;
	racetrackTexture.repeat.set(1, 40);
	let racetrackMaterial = Physijs.createMaterial(
		new THREE.MeshBasicMaterial({map: racetrackTexture}),
		0.8,  // high friction
		0.3	// low restitution
	);
	let racetrack = new Physijs.BoxMesh(
		racetrackGeometry, 
		racetrackMaterial,
		0  // mass
	);
	racetrack.receiveShadow = true;
	racetrack.castShadow = false;
	racetrack.rotation.x = -Math.PI/2;
	racetrack.position.y = -0.5;
	racetrack.name = "racetrack";
	scene.add(racetrack);

	// 7: creates startingLine plane and adds to scene
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
	startingLine.rotation.x = -Math.PI/2;
	startingLine.position.y = -0.45;
	startingLine.position.z = 775;
	startingLine.name = "startingLine";
	scene.add(startingLine);

	// 8: creates finishLine plane and adds to scene
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
	finishLine.rotation.x = -Math.PI/2;
	finishLine.position.y = -0.45;
	finishLine.position.z = finishLineDistance;
	finishLine.name = "finishLine";
	scene.add(finishLine);

	// 9: creates Mario and adds to scene
	let objectLoader = new THREE.ObjectLoader();
	objectLoader.load("models/mario-sculpture.json", function(obj){
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
		cube.rotation.x = -1.5;//-1.57;
		cube.rotation.z = -135;

		// set position
		// cube.position.y = -0.51;
		cube.position.y = 0.5;
		cube.position.x = -1.5;
		cube.position.z = 785;

		cube.name = "cube";
		
    scene.add(cube);

    //cube.addEventListener('collision', function(other_object, relative_velocity, relative_rotation, contact_normal){
			// `this` has collided with `other_object` with an impact speed of `relative_velocity` 
			// and a rotational force of `relative_rotation` and at normal `contact_normal`
			// console.log(other_object);
			// console.log(relative_velocity);
			// console.log(relative_rotation);
			// console.log(contact_normal);
		//});

    // enables you to see the bounding box for an object
    //let boxHelper = new THREE.BoxHelper(cube, 0x000000); //black
    //scene.add(boxHelper);
	});

	// 10: create green racecube and adds to scene
	/*let cubeTwoGeometry = new THREE.BoxGeometry(1, 1, 1);
	let cubeTwoMaterial = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({color: 0x00ff00}), // green
		0.8,  // high friction
		0.4		// medium restitution
	);
	let cubeTwo = new Physijs.BoxMesh(
		cubeTwoGeometry, 
		cubeTwoMaterial,
		1000  // mass
	);
	cubeTwo.castShadow = cubeTwo.receiveShadow = true;
	cubeTwo.position.x = -2;
	cubeTwo.position.y = 0.5;
	cubeTwo.position.z = 785;
	cubeTwo.name = "luigi";
	scene.add(cubeTwo);*/
	
	//plane helper
	//let planeHelper = new THREE.PlaneHelper(racetrack.geometry.boundingBox.max, 1, 0x000000); //black
	//scene.add(planeHelper);
	
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
	// let size = 2000;
	// let divisions = 100;
	// let gridHelper = new THREE.GridHelper(size, divisions);
	// gridHelper.position.y = 0;
	// scene.add(gridHelper);

	// add these back in after you add orbit controls (helper to rotate around in scene)
	//orbitControls = new THREE.OrbitControls(perspectiveCamera); //renderer.domElement
	//orbitControls.enableZoom = true;

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
		countdownBall = scene.children[4];
		currentTime = countdownClock.getElapsedTime();

		if (currentTime >= 4 && currentTime < endOfCountdown) {
			startCountdownClock(countdownBall, currentTime);
		} else if (currentTime >= endOfCountdown) {
			checkWinner();
		}

		updateCameraPosition();
		render();
		scene.simulate();
	}
}

function startCountdownClock(countdownBall, currentTime) {
	
	if (currentTime >= 4 && currentTime < endOfCountdown) {
		// wait for 4 seconds after game loads to make countdown ball appear as a black ball
		countdownBall.material.color.setHex(0x000000);
		countdownBall.material.opacity = 0.75; 

		// console.log(countdownBall);

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

			// let the mario have velocity again
			//cube.setLinearFactor(new THREE.Vector3(0.5, 1.9, 1)); 

			// change the music so that it plays the race sounds
			audioPlayer.src = "audio/race_music_1.mp3";
			audioPlayer.load();
			audioPlayer.loop = true;
			audioPlayer.play();
		}
	} 
}

function checkWinner() {
	if (cube.position.z <= finishLineDistance && cube.position.y >= 0 && 
		cube.position.x >= -5 && cube.position.x <= 5) {
		gameOver();
	} else if (cube.position.y <= -100) {
		stopTimer();
		stopGame();
		stopMusic();
		getGameOverScreen();
		} else {
		
		// update the time on the race clock	
		updateTimer();
		// after the countdown timer ends, you can start to move with the arrow keys
		document.addEventListener('keydown', handler.bind(this), false);
	}
}

function gameOver() {
	gameOverBoolean = true;
	
	stopMusic();
	stopTimer();
	stopGame();
	showNameModal();
}

function stopMusic() {
	// change the music so that it plays the game-over sounds
	audioPlayer.src = "audio/end_of_race.mp3";
	audioPlayer.loop = false;
	audioPlayer.load();
	audioPlayer.play();
}

function stopTimer() {
	raceClock.stop();
}

function stopGame() {
	cube.setLinearVelocity(new THREE.Vector3(0, 0, 0));
  cube.setAngularVelocity(new THREE.Vector3(0, 0, 0));
  //cubeTwo.setLinearVelocity(new THREE.Vector3(0, 0, 0));
  //cubeTwo.setAngularVelocity(new THREE.Vector3(0, 0, 0));
  let onAnimationFrame = null;
  let arrows = document.getElementById("arrows");
  arrows.parentNode.removeChild(arrows);
}

function showNameModal() {
	// open modal
	let modal = document.getElementById('game-over-modal');
	modal.style.display = 'block';

	// add event listener to form submit
	let form = document.getElementById('username-form');
	form.addEventListener("submit", getUsername);
}

function getUsername() {
	event.preventDefault();

	//grab value of input field and send to saveScore() function
	let username = document.getElementById('game-over-input').value;
	saveScore(username);

	//close modal
	let modal = document.getElementById('game-over-modal');
	modal.style.display = 'none';
}

function getHighScores() {
	$.getScript('/scripts/ajax.js', function() {
		indexScores();
	});
}

function getGameOverScreen() {
	gameoverHTML.textContent = "GAME OVER!";
}

function saveScore(username) {
	/*
	Points system:
	10 seconds - 50 points
	20 seconds - 40 points
	30 seconds - 30 points
	40 seconds - 20 points
	50 seconds - 10 points
	*/
	let finalTime = Math.round(raceClock.getElapsedTime() * 100) / 100;

	let finalScore = 60 - (Math.round(finalTime) * 1);

	let finalData = {
		name: username,
		time: finalTime,
		score: finalScore
	};

	console.log(finalData);

	$.getScript('/scripts/ajax.js', function() {
		createScore(finalData);
	});

	getGameOverScreen();
	getHighScores();
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

function moveCube(e) {
	if (gameOverBoolean !== true) {

		if (map === 'luigi-raceway') {
			cube = scene.children[8];
		} else if (map === 'rainbow-road') {
			cube = scene.children[7];
		} 
		// cubeTwo = scene.children[8];

		switch(e.keyCode) {
			//Mario's keys
			case 37: //left
				vectorForce = new THREE.Vector3(-5,0,0);
				cube.applyCentralImpulse(vectorForce);
				break;
			case 39: //right
				vectorForce = new THREE.Vector3(5,0,0);
				cube.applyCentralImpulse(vectorForce);
				break;
			case 38: //forward
				vectorForce = new THREE.Vector3(0,0,-5);
				cube.applyCentralImpulse(vectorForce);
				break;
			// HOW TO JUMP
			// case 40: //back
			// 	vectorForce = new THREE.Vector3(0,10,0);
			// 	cube.applyCentralImpulse(vectorForce);
			// 	break;

			//Luigi's keys
			/*case 65: //A -- left (65)
				vectorForce = new THREE.Vector3(-5,0,0);
				cubeTwo.applyCentralImpulse(vectorForce);
				break;
			case 68: //D -- right (68)
				vectorForce = new THREE.Vector3(5,0,0);
				cubeTwo.applyCentralImpulse(vectorForce);
				break;
			case 87: //W -- forward (87)
				vectorForce = new THREE.Vector3(0,0,-5);
				cubeTwo.applyCentralImpulse(vectorForce);
				break;*/
		}
	}	
}

function updateCameraPosition() {
	if (cube) {
		perspectiveCamera.position.z = cube.position.z + 10; 
		perspectiveCamera.position.x = -1.5; 
		perspectiveCamera.position.y = 4; //0; 
		perspectiveCamera.lookAt(cube.position);

		cube.setAngularFactor(new THREE.Vector3(0, 0, 0));
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