app.get('/scores', function(req, res) {
	console.log("serving up high scores");
	res.json(scores);
});

app.get('/', function(req, res) {
	console.log("serving up mario kart");
  res.sendFile(__dirname + "/views/index.html");
});