
const Action = (dispatch) => ({
    searchBar(allIssues, word){
        //matching 6 fields, all except status
        var result = allIssues.filter(issue => {
          return (
            issue.customer_name === word ||
            issue.customer_email === word ||
            issue.closed_by === word ||
            issue.created_at === word ||
            issue.closed_at === word ||
            issue.description === word
          )
        });
        dispatch({type: "DV_FILTER", filtered: result, newData: true});
    },
    showAllCustomer(customer){
        return customer.map(c => c.name)
    },
    showAllEmployee(employee){
        return employee.map(e => e.name)
    },
    filterByEmployeeName(allIssues, name){
      var result = allIssues.filter(issue => issue.closed_by === name)
      dispatch({type: "DV_FILTER", filtered: result, newData: true  })
    },
    filterByCustomerName(allIssues, name){
      var result = allIssues.filter(issue => issue.customer_name === name)
      dispatch({type: "DV_FILTER", filtered: result, newData: true  })
    },
    filterByStatus(allIssues, status){
      var result = allIssues.filter(issue => issue.status === status)
      dispatch({type: "DV_FILTER", filtered: result, newData: true  })
    },
    sortBy(allIssues, field, ASC){
      var result;
      var sortType = ASC ? "A" : "D";

      if(sortType === "A"){
          //if it's time, need to covert string date to datetime object
          if(field === "created_at" || field === "closed_at"){
              result = sortByTime(allIssues, field, sortType);
          } else {
              result = allIssues.sort((a,b) => a[field] > b[field] ? 1 : -1)
          }
      } else if (sortType === "D"){
          if(field === "created_at" || field === "closed_at"){
              result = sortByTime(allIssues, field, sortType);
          } else {
              result = allIssues.sort((a,b) => b[field] > a[field] ? 1 : -1)
          }
      }
      
      dispatch({ type: "DV_newData", data: {allIssues: result, newData:true} })
    },
    getDatabaseFromServer(allIssues, field, ASC){
      fetch("http://localhost:8000/getAll")
        .then(res => res.json() )
        .then(obj => {
          const AllIssues = {allIssues: obj.closedIssue.concat(obj.openIssue) }
          //clean unused data
          delete obj.closedIssue; delete obj.openIssue;

          const newObj = Object.assign({}, obj, AllIssues, {newData: true})
          dispatch({type: "DV_newData", data: newObj})
        })
        .catch(err => console.error(err))
      
    }
})

module.exports = Action;

function sortByTime(arr,field, sortType){
  return arr.sort((a,b) => {
    var a = new Date(a[field]); 
    var b = new Date(b[field]);
    if (sortType === "A"){
        return (a > b) ? 1 : -1;
    } else {
        return (a < b) ? 1 : -1;
    }
  })
}

function doubleDigitize(num){
  if(!Number(num)) return undefined;
  return (Number(num) < 10) ? String("0"+num) : String(num)
}
