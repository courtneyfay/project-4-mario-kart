const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes.js');

let scores = [
	{
		name: "CFAY",
		time: 32.21790500000001,
		score: 1200
	},
	{
		name: "Court",
		time: 16.099,
		score: 1600
	}
];

// MIDDLEWARE
app.use(express.static('public'));

app.use('/', routes);

app.listen(process.env.PORT || 3000, function() {
	console.log("listening either at Heroku or at localhost:3000");
});