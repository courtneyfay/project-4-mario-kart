let DB = require('../models').models;

let scores = [
	{
		name: "CFAY",
		time: 32.21790500000001,
		score: 28
	},
	{
		name: "Courttt",
		time: 16.09966500000001,
		score: 44
	},
	{
		name: "Courtney",
		time: 50.57282934789999,
		score: 9
	},
	{
		name: "Big C",
		time: 32.56929999999991,
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