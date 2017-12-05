const Sequelize = require('sequelize');
const user_name = 'cfay';
const sequelize = new Sequelize(process.env.DATABASE_URL || `postgres://${user_name}@localhost:5432/mario_kart`);

// EXPORT MODELS AND SEQUELIZE FOR DB SETUP
module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;

// IMPORT DB MODELS
const Scores = sequelize.import('./scores');

module.exports.models = {
	Scores: Scores
};