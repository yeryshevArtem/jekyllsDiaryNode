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
            response.setHeader("Allow", "*");
            response.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
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
                        if (activity.activity.description && activity.activity.hours) {
                            var data = {description: activity.activity.description, hours: activity.activity.hours};
                            var query = connection.query('INSERT INTO activities SET ?', data, function (err, result) {
                                if (!err) {
                                    activity.activity["id"] = result.insertId;
                                    responseData = JSON.stringify(activity);
                                    responseData = activity;
                                    response.statusCode = 201;
                                }
                            });
                        } else {
                            responseData = JSON.stringify({error: "Bad request motherfucker"});
                            response.statusCode = 400;
                        }

                        response.end(responseData);
                    });
                    break;
                case "GET":
                    var query = connection.query('SELECT * FROM activities', null, function (err, result) {
                        responseData = JSON.stringify({activities: result});
                        response.statusCode = 200;

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
                        if (activity.activity.description && activity.activity.hours) {
                            var data = [activity.activity.description, activity.activity.hours, activity.activity.id ];
                            var query = connection.query('UPDATE activities SET description=?, hours=? WHERE id=?', data, function (err, result) {
                                if (!err) {
                                    response.statusCode = 204;
                                }
                            });
                        } else {
                            response.statusCode = 400;
                        }
                        response.end();
                    });
                    break;
                case "DELETE":
                    var jsonString = "";
                    request.on('data', function (data) {
                        jsonString += data;
                    });
                    request.on('end', function () {
                        var activity = JSON.parse(jsonString);
                        if (activity.activity.id) {
                            var data = [activity.activity.id];
                            var query = connection.query('DELETE FROM activities WHERE id=?', data, function (err, result) {
                                if (!err) {
                                    response.statusCode = 204;
                                }
                            });
                        } else {
                            response.statusCode = 400;
                        }
                        response.end();
                    });
                    break;
                case "OPTIONS":
                    response.statusCode = 200;
                    response.setHeader("Allow", "*");
                    response.end();

                    break;
                default:
                    break;
            }
        });
        server.listen(8000);
    }
});
