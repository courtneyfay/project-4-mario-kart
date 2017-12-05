const express = require('express');
const bodyParser = require('body-parser');
router = express.Router();
const controller = require('../controllers/controller.js');

// game page -- get the three.js homepage
router.get('/', controller.homePage);

// SCORE routes
router.route('/scores')
	// INDEX route - get all scores
	.get(controller.indexScores)
	// CREATE route - make 1 score
	.post(controller.createScore);
router.route('/scores/:id')
	// SHOW route - get 1 score
	.get(controller.showScore)
	// UPDATE route - update 1 score
	.put(controller.updateScore)
	// DELETE route - delete 1 score
	.delete(controller.deleteScore);

module.exports = router;