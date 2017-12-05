module.exports = (sequelize, Sequelize) => {
	let model = sequelize.define("scores", {
		name: Sequelize.TEXT,
		time: Sequelize.DECIMAL,
		score: Sequelize.INTEGER
	});
	return model;
};