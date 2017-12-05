const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./back-end/config/routes.js');

// MIDDLEWARE
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

//SET UP EJS
app.set('views', __dirname + '/views');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use('/', routes);

app.listen(process.env.PORT || 3000, function() {
	console.log("listening either at Heroku or at localhost:3000");
});