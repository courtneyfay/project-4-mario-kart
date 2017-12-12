let db = require('../models');
let Scores = db.models.Scores;

let scores = [
	{
		"id": 1,
		"name": "CFAY",
		"time": 32.21790500000001,
		"score": 28
	},
	{
		"id": 2,
		"name": "Courttt",
		"time": 16.09966500000001,
		"score": 44
	},
	{
		"id": 3,
		"name": "Courtney",
		"time": 50.57282934789999,
		"score": 9
	},
	{
		"id": 4,
		"name": "Big C",
		"time": 32.56929999999991,
		"score": 27
	}
];

homePage = (req, res) => {
	console.log("WORKING: serving up mario kart");
	res.render("index.ejs");  
};

indexScores = (req, res) => {
	console.log("WORKING: serving up high scores");
	Scores.findAll({ order: [['score', 'DESC']]})
		.then(function(scores) {
			res.render("partials/scores.ejs", {scores: scores});
		});
};

showScore = (req, res) => {
	console.log("NOT TESTED: serving up 1 high score");
	id = req.params.id - 1;
	res.json(scores[id]);
};

createScore = (req, res) => {
	console.log("WORKING: creating a new score");
	/*
	~~ WORKED WITH THE ARRAY ~~
	let newScore = {
		id: 5,
		name: "Court",
		time: req.body.time,
		score: req.body.score
	};
	scores.push(newScore);*/

	Scores.create({
		name: req.body.name,
		time: req.body.time,
		score: req.body.score 
	})
	.then(function(score) {
		if(!score) res.send("score not saved");
		res.json(score);
	});
};

updateScore = (req, res) => {
	console.log("NOT TESTED: updating an old score");
	id = req.params.id - 1;
	for (let i = 0; i < scores.length; i++) {
		if(scores[i].id === id) {
			let updatedScore = scores[i];
			console.log(updatedScore);
			res.json(updatedScore);
		}
	}
};

deleteScore = (req, res) => {
	console.log("NOT TESTED: deleting an old score");
	id = req.params.id - 1;
	for (let i = 0; i < scores.length; i++) {
		if(scores[i].id === id) {
			console.log(scores[i]);
			scores.splice(id, 1, null);
			res.json("deleted candy");
		}
	}
};

module.exports.homePage = homePage;
module.exports.indexScores = indexScores;
module.exports.showScore = showScore;
module.exports.createScore = createScore;
module.exports.updateScore = updateScore;
module.exports.deleteScore = deleteScore;
