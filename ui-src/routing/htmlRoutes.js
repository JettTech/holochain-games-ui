var express = require("express");
var path = require("path");

// Static Asset Routing
// ===========================================================
module.exports = function (app) {
	// app.use(express.static("assets"));

	app.get("/lobby", function(request, result) {
		result.sendFile(path.join(__dirname + "/../public/index.html"));

	app.get("/checkers", function(request, result) {
		result.sendFile(path.join(__dirname + "/../public/checkers.html"));
	});

	app.use(function(request, result) {
		result.sendFile(path.join(__dirname + "/../public/index.html"));
	});

}
