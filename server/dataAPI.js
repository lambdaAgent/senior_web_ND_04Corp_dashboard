const fs = require("fs");

const openIssuePath = "../database/open_issue_Final.json"
const closedIssuePath = "../database/closed_issues_Final.json"
const EmployeePath = "../database/Employee_Final.csv"
const CustomerPath = "../database/customer_Final.csv"


module.exports = {
	openIssue: openJsonAndReturnAsArray(openIssuePath).then( arr => arr),
	closedIssue: openJsonAndReturnAsArray(closedIssuePath).then(arr => arr),
	employee: openCSVAndReturnAsArray(EmployeePath).then(arr => arr),
	customer: openCSVAndReturnAsArray(CustomerPath).then(arr => arr),
	recycleClosedToBeOpenIssue: recycleClosedToBeOpenIssue
}




function recycleClosedToBeOpenIssue(amount, closedIssue, openIssue){
	if(closedIssue.length < 50) return;
	var random = Math.floor(Math.random() * 100) + 1;
	var issues = closedIssue.splice(random,amount);
	//change status, closed_at. closed_by
	issues.map(issue => {		
		issue.closed_at = null;
		issue.closed_by = null;
		status = "open";
		openIssue.push(issue);	
	});
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
					fields.map( (field, fieldIdx) => {
						obj[field] = line.split(",")[fieldIdx];
					});
					result_arr.push(obj)
				}

				if(isEmployee){
					var values = line.split("[")[0];
					var issuesId = line.split("[")[1];
					//delete closing square_bracket ]
					var issuesId_ = issuesId.substring(0, issuesId.length-1)

					var array_issues = issuesId_.split(",").map(id => id);

					fields.map( (field, fieldIdx) => {
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
		fs.readFile(path, "utf-8", (err, files) ={
			if(err) reject(err)
			var fileObj = JSON.parse(files)
			resolve(fileObj)
		})
	})
}



