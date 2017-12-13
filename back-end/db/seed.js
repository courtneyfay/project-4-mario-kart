let DB = require('../models').models;

let scores = [
	{
		name: "CFAY",
		time: 32.22,
		score: 28
	},
	{
		name: "Courttt",
		time: 16.10,
		score: 44
	},
	{
		name: "Courtney",
		time: 50.57,
		score: 9
	},
	{
		name: "Big C",
		time: 32.57,
		score: 27
	}
];

let scoresDelete = function() {
	return DB.Scores.destroy({
		where: {}
	});
};

let scoresCreate = function() {
	return DB.Scores.bulkCreate(scores);
};

scoresDelete()
.then(scoresCreate)
.then(function() {
	process.exit();
});