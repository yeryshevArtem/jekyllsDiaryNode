var http = require("http");

var activities = [];

for (var i=1; i<=10; i++) {
  activities.push({
    description: "something",
    timeSpent: i
  });
}

var server = http.createServer(function(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Content-Type", "application/json");
  var responseData;

  switch (request.method) {
    case "POST":
      var jsonString = "";
      request.on('data', function (data) {
        jsonString += data;
      });
      request.on('end', function () {
        var activity = JSON.parse(jsonString);
        responseData = JSON.stringify(activity);
        console.log("Going to send this JSON: " + responseData);
        response.statusCode = 201;
        response.end(responseData);
      });
      break;
    case "GET":
      responseData = JSON.stringify({activities: activities});
      console.log("Going to send this JSON: " + responseData);
      response.statusCode = 200;
      response.end(responseData);
      break;
    default: break;
  }
});
server.listen(8000);
