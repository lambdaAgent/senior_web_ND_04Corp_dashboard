const Action = (dispatch) => ({
    renderBarChart(props, time_type){
        //time_type = ['yearly', 'monthly']
        var result , __item;
        if(time_type === "yearly"){
          __item = props["AllIssues"];
          result = {
            labels: Object.keys(__item),
            data: sumIssuesByYear(__item),
            openIssues: props.totalOpenIssues
          }
        }
        dispatch({type: "RENDER_BAR_CHART", data: result})
    },
    renderLineChart(props, time_type){
          //time_type = ['yearly', 'monthly']
        var result , __item;
        if(time_type === "yearly"){
          __item = props["purchases"];
          result = {
            labels: Object.keys(__item),
            data: sumEachMonthPurchases(__item),
            totalPurchases: props.totalPurchases.toFixed(2)
          }
        }
        dispatch({type: "RENDER_LINE_CHART", data: result})
    },
    filtereLineChart(props, time_type){
      var result, __item;
      if(time_type === "All year"){
        __item = props["purchases"];
        result = {
          labels: Object.keys(__item),
          data: sumEachMonthPurchases(__item),
          totalPurchases: props.totalPurchases.toFixed(2)
        }
      } else {
        __item = props["purchases"][time_type];
        result = {
          labels: Object.keys(__item),
          data: monthlyPurchases(__item),
          // totalPurchases: monthlyPurchases(__item).reduce((prev, next) => {return prev+next},0)
        }
        console.log("result",result)
      }
    },
    getDatabaseFromServer(){
        fetch("http://localhost:8000/getKeyMetric")
          .then(res => res.json() )
          .then(obj => {
            const AllIssue = obj.closedIssue.concat(obj.openIssue );
              const PurchasesGroupByMonth = groupObjectByMonth(obj.customer, "purchased_at", true);
              const OpenIssueGroupByMonth = groupObjectByMonth( obj.openIssue, "created_at");
              const CloseIssueGroupByMonth = groupObjectByMonth( obj.closedIssue, "created_at");
              const AllIssueGroupByMonth = groupObjectByMonth( AllIssue, "created_at")
              
              //use filtered data, don't use raw data from server;
              const totalPurchases = findTotalPurchase(PurchasesGroupByMonth);
              const totalAllIssues = findTotalIssues(AllIssueGroupByMonth);
              const totalOpenIssues = findTotalIssues(OpenIssueGroupByMonth)
              const totalClosedIssues = findTotalIssues(CloseIssueGroupByMonth)
              var result = {
                purchases: PurchasesGroupByMonth, 
                openIssues: OpenIssueGroupByMonth, 
                closeIssues: CloseIssueGroupByMonth, 
                AllIssues: AllIssueGroupByMonth,
                totalAllIssues, 
                totalOpenIssues, 
                totalClosedIssues, 
                totalPurchases,
                newData: true
              }
              dispatch({type: "KM_GET_from_DB", cleansedData: result})
          })
          .catch(err => console.error(err))
    }
})

module.exports = Action;

// ----------------
//    HELPER
// ----------------


function sumEachMonthPurchases(obj){
  var result = Object.keys(obj).map(year => {
      return Object.keys(obj[year]).map(month => {
          return obj[year][month].reduce((prev, next) => {
            return prev + next
          },0)
      })[0].toFixed(2);
  });
  return result;
}

function monthlyPurchases(obj){
  var result = Object.keys(obj).map(month => {
    return obj[month].reduce((prev, next) => {
      return prev + next
    }, 0)
  })
}

function monthlyIssues(obj){
  var result = Object.keys(obj).map(month => {
    return obj[month].length;
  })
}

function sumIssuesByYear(obj){
  var result = Object.keys(obj).map(year => {
      return Object.keys(obj[year]).reduce((prev, month) => {
            return prev + Number(obj[year][month].length);
      },0)
  });
  return result
}

function findTotalIssues(obj){
  var total_issues = 0
  Object.keys(obj).map(year => {
      Object.keys(obj[year]).map(month => {
          total_issues += Number(obj[year][month].length);
      })
  });
  return total_issues;
}


function findTotalPurchase (obj){
    //obj is grouped by year then by month
    var total_purchase = 0;
    Object.keys(obj).map(year => {
        Object.keys(obj[year]).map(month => {
          obj[year][month].map(purchase => {
              //it's a $12.12 has dollar sign and decimal
              total_purchase += Number(purchase)
          })
        })
    });
    return total_purchase
}


function groupObjectByMonth(arr, key, purchase){
   /* schema of the return object of this function
   result = { 
      2012: {
        01: [],
        02: [],
      }, 
      2013: {
        03: [],
        04:[]
      }, ....
    }
    */
    return  groupByMonth( groupByYear(arr ,key), key, purchase)
}

function groupByYear(customer_arr, date_key){
  var group={}
  customer_arr.map((c,index) => {
    if(!c[date_key]) {
      return;
    }

    var year = extractYear(c[date_key])
    
    if (!(year in group)) {
      group[year] = [];
    }

    for(var key in group){
        if(key === year) group[key].push(c)
    }

  });
  return group
}

function groupByMonth(obj, date_key, purchase){
    /*group = { schema
      2012: {
        01: [],
        02: [],
      }, 
      2013: {
        03: [],
        04:[]
      }, ....
    }
    */

    var group = {}
    Object.keys(obj).map(year => {
        //initiate  group to match the schema above, 
        group[year]={};
        for(var i = 1; i < 13; i++){
          group[year][doubleDigitize(i)] = [];
        }
    });

    //grouped it
    Object.keys(obj).map(__year => {
        obj[__year].map(customer => {
            var __month = doubleDigitize(extractMonth(customer[date_key]));

            Object.keys(group[__year]).map((Gmonth, index) => { //Gmonth = group month
                if( String(__month) === String(Gmonth) ){
                  //if customer's month === group's month

                  if(purchase){//for purchase, I only need the purchase amount
                    var numberWithoutDollar = Number(customer.purchase.slice(1))
                    return group[__year][Gmonth].push( numberWithoutDollar )
                  }
                  //for issues, I only need the total number
                  return group[__year][Gmonth].push(customer)
                  
                }
            });

        })
    });

    return group;
}



function doubleDigitize(num){
  if(!Number(num)) return undefined;
  return (Number(num) < 10) ? String("0"+num) : String(num)
}

function extractMonth(str){
  return str.split("/")[0];
}

function extractYear(str){
    return str.split("/")[2];
}

function totalLength(obj){
  return Object.keys(obj).reduce( (prev, next) => {
    return prev + next.length
  },0)
}

