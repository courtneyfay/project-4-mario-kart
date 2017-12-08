function indexScores() {
  // console.log("hitting indexScores ajax route!");
  $.ajax({
    url: "/scores",
    type: "GET",
    // dataType: 'json', //throwing an error when you return rendered HTML
    success: function (data) {   
      $('#game-scores').html(data);  
    },
    error: function(err) {
      console.log(err); 
    } 
  });
}
  
function createScore(raceData) {
  // console.log("hitting createScore ajax route!");
  $.ajax({
    url: "/scores",
    type: "POST",
    data: raceData, 
    success: function (data) {
      console.log(data);
    },
    error: function(err) { 
      console.log(err);
    } 
  });
}