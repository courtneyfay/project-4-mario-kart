const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
	console.log("serving up mario kart");
  res.sendFile(__dirname + "/views/index.html");
});

app.listen(process.env.PORT || 3000, function() {
	console.log("listening either at Heroku or at localhost:3000");
});