const fs = require("fs");


var firstStage = new Promise((resolve, reject) => {
	fs.readFile("../database/closed_issues.json", "utf-8", (err, issues_json) => {
		fs.readFile("../database/open_issues.json", "utf-8", (err, open_issues_json) => {
		fs.readFile("../database/Customers.csv", "utf-8", (err, customers_txt) => {

			var issues = JSON.parse(issues_json);
			var open_issues = JSON.parse(open_issues_json);
			var result_closed_issues = [];
			var result_open_issues = [];

			//customer_with_issueId will be converted to csv, code below initiate the firstline or the table-headers
			var customer_with_issueID = (customers_txt.split("\n")[0] + "\n").toString();

			// fixing adding customer_name to closed and open issue; 
			// conversely adding closed and open_issue's id to customer
			customers_txt.split("\n").map((line, index) => { //1000 customers
				if(index === 0) return;
			
				var randomNumber= Math.floor(Math.random() * 10);
				var issue = issues.splice(randomNumber, 1)[0];
				var issueId = (issue) ? issue.id : undefined;
			
				if(issue){
																		//issue,  name              , email
					var issue_with_customer_attached = addCustomerToIssues(issue, line.split(",")[1], line.split(",")[2]);
					result_closed_issues.push(issue_with_customer_attached);
				}

				if(index > 800){
					var open_issue = open_issues.splice(0,1)[0];
					if(!open_issue) return;
					var open_issue_with_customer_attached = addCustomerToIssues(open_issue, line.split(",")[1], line.split(",")[2]);
					result_open_issues.push(open_issue_with_customer_attached)
				}

				customer_with_issueID += (String(line) + String(issueId) + "\n")   
			}).join("\n");


			
			fs.writeFile("../database/customer_Final.csv", customer_with_issueID);

			var stringify = JSON.stringify(result_closed_issues);
			fs.writeFile("../database/closed_issues_with_customer.json", stringify, (err) => console.log("err", err) )

			var open_issues_stringify = JSON.stringify(result_open_issues)
			fs.writeFile("../database/open_issue_Final.json", open_issues_stringify, (err) => console.error(err))

			resolve();
		});
		});
	});
}).then(()=>{

	fs.readFile('../database/closed_issues_with_customer.json', 'utf-8', (err, closed) => {
		fs.readFile("../database/Employee.csv", 'utf-8', (err, Employee_txt) => {
			var closed_issues = JSON.parse(closed);
			var firstline = Employee_txt.split("\n")[0] +"\n";
			var result_closed_issues = [];

			Employee_txt.split("\n").map((line, index) => {
				if(index === 0) return;
				var Employee_name = line.split(",")[1];
				//each employee should handle around 5-7 issues
				var random = Math.floor(Math.random() * 2) + 5;
				var array_issues = [];

				for(var i=0; i<random; i++){
					var issue = closed_issues.splice(random,1)[0];
					var issueId = issue ? issue.id : undefined;
					if(!issueId) return;

					issue.closed_by = Employee_name;
					result_closed_issues.push(issue)

					array_issues.push(issueId)
				} 
				console.log(String(array_issues))
				firstline += String(line) + "["+String(array_issues) +"]\n" 
			});

			fs.writeFile("../database/Employee_Final.csv", firstline);

			var stringify = JSON.stringify(result_closed_issues);
			fs.writeFile("../database/closed_issues_Final.json", stringify, (err) => console.log("err", err) )

		})
	})
})

function addCustomerToIssues(issuesObj, customer_name, customer_email){
	issuesObj["customer_name"] = customer_name;
	issuesObj["customer_email"] = customer_email;
	return issuesObj
}



