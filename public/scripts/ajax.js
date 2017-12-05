// $(document).ready(function(){

function indexScores() {
  console.log("hitting index Scores ajax route!");
  $.ajax({
    url: "/scores",
    type: "GET",
    dataType: 'json',
    success: function (data) {            
      console.log(data);
    },
    error: function(err) {
      console.log(err);
    } 
  });
}
  
// });