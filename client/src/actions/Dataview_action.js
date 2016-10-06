
const Action = (dispatch) => ({
    searchBar(allIssues, word){

    },
    showAllCustomer(allIssues){

    },
    showAllEmployee(allIssues){

    },
    filterByEmployeeName(allIssues, name){

    },
    filterByCustomerName(allIssues, name){

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
      
      dispatch({ type: "DV_GET_FROM_DB", data: {allIssues: result, newData:true} })
    },
    getDatabaseFromServer(allIssues, field, ASC){
      fetch("http://localhost:8000/getAll")
        .then(res => res.json() )
        .then(obj => {
          var arr = [];
          const AllIssues = {allIssues: obj.closedIssue.concat(obj.openIssue) }
          const newObj = Object.assign({}, AllIssues, {newData: true})
          dispatch({type: "DV_GET_FROM_DB", data: newObj})
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
