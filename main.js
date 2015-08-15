var http = require("http");
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
        console.log(responseData);
        response.statusCode = 201;
        response.end(responseData);
      });
      break;
    case "GET":
      // response.data = [
      //   { description: "lol", timeSpent: 13 },
      //   { description: "hahaha", timeSpent: 4 },
      //   { description: ":D", timeSpent: 3 }
      // ];
      // response.write("<h1>Hello!</h1><p>You asked for <code>" + request.url + "</code></p>");
      // response.statusCode = 200;
      // response.end(responseData);
      break;
    default: break;
  }
});
server.listen(8000);
