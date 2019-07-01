// var express = require("express");
// var path = require("path");
//
// // Static Asset Routing
// // ===========================================================
// module.exports = function (app) {
// 	app.use(express.static("public"));
//
// 	app.get("/checkers", function(request, result) {
// 		result.sendFile(path.join(__dirname + "/../checkers.html"));
// 	});
//
// 	app.get("/lobby", function(request, result) {
// 		result.sendFile(path.join(__dirname + "/../index.html"));
// 	});
//
// 	app.use(function(request, result) {
// 		result.sendFile(path.join(__dirname + "/../index.html"));
// 	});
// }
