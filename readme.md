# Racecube

-----------------------------

## An embedded screenshot of the app

![alt text](public/images/racecube.png "Racecube game")

-----------------------------
## Explanations of the technologies used

### Front end: 
three.js (WebGL), physijs, EJS, html, css, javascript, jquery 

### Routing: 
Ajax, Express

### Back end: 
Node js, Sequelize, SQL

-----------------------------
## A couple paragraphs about the general approach you took

* Experimental, really bare bones just to start
* Talked to Alex Creighton and Mark Klein from previous WDI cohorts, asked them for resources
* Did some demos and fork and clone some existing repos to practice (three.js and physijs)
* Figured out how to architect the three.js app using Node

-----------------------------
## Installation instructions for any dependencies

### To play now
https://racecube.herokuapp.com/

### To fork and clone from GitHub and run locally
```
npm install at the package.json level
node back-end/db/dbSetup.js
node back-end/db.seed.js
nodemon server.js
open up http://localhost:3000
```

-----------------------------
## Link to your user stories – who are your users, what do they want, and why?

* A user will see a racecube on a racetrack behind a starting line
* A user will user the arrow keys (up, left, right) to move the racecube forward along the track
* A user will see the shape of the racetrack in the bottom left corner during the entirety of the race
* A user will see which arrow keys to use in the bottom right corner during the entirety of the race
* A user will see a 3-2-1 countdown to when the race begins and then they can start to drive
* A user will have the camera follow the racecube around the track
* A user will see the amount of time that has passed at the top of the screen during the entirety of the race
* A user will see that they have completed the race
* A user will see the points that they earned during the race based on completion time
* A user will see the site live on Heroku
* A user will know how to play or recreate the game because of the readme file details


-----------------------------
## Descriptions of any unsolved problems or major hurdles you had to overcome

- [ ] for example 1
- [ ] for example 2
- [ ] for example 3