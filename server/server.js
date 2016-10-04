var express = require('express');
var app = express();
var openIssue = require("./dataAPI.js").openIssue ,
	closedIssue = require("./dataAPI.js").closedIssue,
	employee = require("./dataAPI").employee,
	customer = require("./dataAPI").customer,
	recycleClosedToBeOpenIssue = require("./dataAPI").recycleClosedToBeOpenIssue

app.get("/", (req, res) => {
	
})

app.get('/getAll', function (req, res) {
	//random between 1-3 issue
	var random = Math.floor(Math.random() * 2) + 1;

	recycleClosedToBeOpenIssue(random, closedIssue, openIssue)
	var Response = {
		openIssue: openIssue
		closedIssue: closedIssue
		employee: employee
		customer customer
	}
	res.json(Response)
});


app.listen(8000, function () {
  console.log('Example app listening on port 8000');
});