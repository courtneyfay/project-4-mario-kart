let scores = [
	{
		"id": 1,
		"name": "CFAY",
		"time": 32.21790500000001,
		"score": 2005
	},
	{
		"id": 2,
		"name": "Courttt",
		"time": 16.09966500000001,
		"score": 3000
	},
	{
		"id": 3,
		"name": "Courtney",
		"time": 50.57282934789999,
		"score": 500
	},
	{
		"id": 4,
		"name": "Big C",
		"time": 32.36929999999991,
		"score": 1995
	}
];

homePage = (req, res) => {
	console.log("serving up mario kart");
	res.render("index.ejs", {scores: scores}); 
};

indexScores = (req, res) => {
	console.log("WORKING: serving up high scores");
	res.json(scores);
};

showScore = (req, res) => {
	console.log("WORKING: serving up 1 high score");
	id = req.params.id - 1;
	res.json(scores[id]);
};

createScore = (req, res) => {
	console.log("creating a new score");
	let newScore = req.body;
	scores.push(newScore);
	res.json(newScore);
};

updateScore = (req, res) => {
	console.log("updating an old score");
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
	console.log("deleting an old score");
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
