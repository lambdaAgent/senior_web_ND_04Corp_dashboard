const fs = require("fs");
const Promise = require('bluebird');
const moment = require("moment");

const openIssuePath = "../database/open_issue_Final.json"
const closedIssuePath = "../database/closed_issues_Final.json"
const EmployeePath = "../database/Employee_Final.csv"
const CustomerPath = "../database/customer_Final.csv"
const countryCodePath = "../database/3letterCountryCode.txt";

var	openIssue = openJsonAndReturnAsArray(openIssuePath);
var	closedIssue = openJsonAndReturnAsArray(closedIssuePath);
var	employee = openCSVAndReturnAsArray(EmployeePath, true);
var	customer = openCSVAndReturnAsArray(CustomerPath);
var countryCode = countryNameAndCountryCode(countryCodePath)
var init = function(){
	return Promise.all([openIssue,closedIssue,employee,customer, countryCode])
}

module.exports = {
	init,
	recycleClosedToBeOpenIssue,
	simulatePurchases
}

function simulatePurchases(customer_arr){
	return new Promise((resolve, reject) => {
		var amount = Math.floor(Math.random() * 1) + 1; //1-4 purchases 
		var random = Math.floor(Math.random() * 1) * 100; //pick from 1 to 700
		var customers = customer_arr.slice(random, amount).map(c => {
			c.purchased_at = moment().format("L");
			c.submitIssue_id = "undefined"
			customer_arr.push(c)
		});

		resolve(customer_arr)
	})
}

// function simulateUnsubscribeCustomer()


function recycleClosedToBeOpenIssue(closedIssue, openIssue){
	return new Promise((resolve, reject) => {
		if(closedIssue.length < 50) return;

		var amount = Math.floor(Math.random() * 2) + 1; //1-3 recycled submitted issues
		var random = Math.floor(Math.random() * 100) + 1;

		var spliced_issues = closedIssue.splice(random,amount);

		//change status, closed_at. closed_by
		spliced_issues.map(issue => {		
			issue.closed_at = null;
			issue.closed_by = null;
			issue.status = "open";
			openIssue.push(issue);	
		});

		resolve({openIssue, closedIssue});
	})
}


function openCSVAndReturnAsArray(path, isEmployee){
	return new Promise((resolve, reject) => {
		fs.readFile(path, "utf-8", (err, files) => {
			if(err) reject(err);
			var result_arr = [];
			var fields = files.split("\n")[0];
			files.split("\n").map((line, index) => {
				if(index === 0) return;
				var obj = {};
				
				if(!isEmployee){
					fields.split(",").map( (field, fieldIdx) => {
						obj[field] = line.split(",")[fieldIdx];
					});
					result_arr.push(obj)
				}

				if(isEmployee){
					var values = line.split("[")[0];
					var issuesId = line.split("[")[1];
					//delete closing square_bracket ];
					if(!issuesId) return;
					var issuesId_ = issuesId.substring(0, issuesId.length-1)

					var array_issues = issuesId_.split(",").map(id => id);

					fields.split(",").map( (field, fieldIdx) => {
						obj[field] = line.split(",")[fieldIdx];
					});

					obj["issue"] = array_issues;
					result_arr.push(obj)
				}
			});


			resolve(result_arr)
		})
	})
}




function openJsonAndReturnAsArray(path){
	return new Promise((resolve, reject) => {
		fs.readFile(path, "utf-8", (err, files) => {
			if(err) reject(err)
			var fileObj = JSON.parse(files)
			resolve(fileObj)
		})
	})
}



function countryNameAndCountryCode(path){
	return new Promise((resolve) => {
		fs.readFile(path, "utf-8", (err, files) => {
			var arr = [];
			files.split("\n").map(line => {
				var key_value = splitByFirstSpace(line);
				var key = key_value[0];
				var value = key_value[1];
				arr.push({countryCode: key, countryName:value})
			});
			resolve(arr)
		})
	})
}

function splitByFirstSpace(file){
	var idx = file.indexOf(" ")
	//miss tuple
	var letter_name = file.split("	");
	var letterCode = letter_name[0];
	var countryName = letter_name[1];
	return [letterCode, countryName]
}
