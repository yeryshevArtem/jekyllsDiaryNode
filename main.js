var http = require("http");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    port: '3306',
    database: 'diary'
});

connection.connect(function (err) {
    if (!err) {
        var server = http.createServer(function (request, response) {
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
                        if (activity.method && activity.method === "DELETE") {
                            responseData = "";
                            response.statusCode = 204;
                        }
                        else {
                            if (activity.activity.description && activity.activity.hours) {
                                responseData = JSON.stringify(activity);
                                var data = {description: activity.activity.description, hours: activity.activity.hours};
                                var query = connection.query('INSERT INTO activities SET ?', data, function (err, result) {
                                    if (!err) {
                                        responseData = activity;
                                        response.statusCode = 201;
                                    }
                                });
                            } else {
                                responseData = JSON.stringify({error: "Bad request motherfucker"});
                                response.statusCode = 400;
                            }
                        }
                        response.end(responseData);
                    });
                    break;
                case "GET":
                    var query = connection.query('SELECT * FROM activities', null, function (err, result) {
                        responseData = JSON.stringify({activities: result});
                        response.statusCode = 200;
                        console.log(responseData);
                        response.end(responseData);
                    });
                    break;
                case "PUT":
                    var jsonString = "";
                    request.on('data', function (data) {
                        jsonString += data;
                    });
                    request.on('end', function () {
                        var activity = JSON.parse(jsonString);
                        responseData = JSON.stringify(activity);
                        response.statusCode = 201;
                        response.end(responseData);
                    });
                    break;
                case "DELETE":
                    var jsonString = "";
                    request.on('data', function (data) {
                        jsonString += data;
                    });
                    request.on('end', function () {
                        response.statusCode = 204;
                        response.end(jsonString);
                    });
                    break;
                default:
                    break;
            }
        });
        server.listen(8000);
    }
});
