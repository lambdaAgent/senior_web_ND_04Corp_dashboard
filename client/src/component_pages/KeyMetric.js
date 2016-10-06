//library
import React, { Component } from 'react';
import { connect } from "react-redux";
import KeyMetric_action from "../actions/KeyMetric_action";
import $ from "jquery";
var CHART; //will be initialized after component did mounted

//components
import Navbar from "../component_utils/Navbar";
import BarChart from "../component_utils/BarChart";
import LineChart from "../component_utils/LineChart";


const COLOR = {
  bg:['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'],
  border:['rgba(255,99,132,1)',   'rgba(54, 162, 235, 1)',  'rgba(255, 206, 86, 1)'  ,'rgba(75, 192, 192, 1)'  ,'rgba(153, 102, 255, 1)'  ,'rgba(255, 159, 64, 1)']
}


function sumEachMonthPurchases(obj){
  var result = Object.keys(obj).map(year => {
      return Object.keys(obj[year]).map(month => {
          return obj[year][month].reduce((prev, next) => {
            return prev + next
          },0)
      })[0].toFixed(2);
  });
  console.log("result", result)
  return result;
}

function sumIssuesByYear(obj){
  var result = Object.keys(obj).map(year => {
      return Object.keys(obj[year]).reduce((prev, month) => {
            return prev + Number(obj[year][month].length);
      },0)
  });
  return result
}


var previousPurchase = 0;
/*  
    so many configuration with redux.... 
*/
class App extends Component {
  constructor(props){
    super(props);
    this.loopEvery2Second;
    this.state={width:0, barChartReady: false, lineChartReady: false};
  }
  componentWillMount() {
      window.addEventListener("resize", this.setState({width: window.innerWidth}) )
      this.setState({width: window.innerWidth}) 
      CHART = window.Chart;
      //this.loopEvery2Second = setInterval( () => {
          this.props.getDatabaseFromServer();
      //},2000);
  }
  componentWillUnmount() {
      //TODO; clearInterval
  }
  componentWillUpdate(nextProps, nextState) {
    //using redux, React need to load twice before finally initialize the data from server
      if(nextProps.newData){
        previousPurchase = this.props.totalPurchases || 0;
        // console.log("will update", previousPurchase)
        this._LineChart.call(this, nextProps, 'yearly')
        this._BarChart.call(this, nextProps, 'yearly')
      }
  }

  _LineChart(props, time_type, year){
      //time_type = ['yearly'. 'monthly']
      if(time_type==='yearly'){
        const __item = props["purchases"];
        var result = {
          labels: Object.keys(__item),
          data: sumEachMonthPurchases(__item),
          totalPurchases: props.totalPurchases.toFixed(2)
        };
       
        props.renderLineChart(result)
      }
  }

  _BarChart(props, time_type, year){
    //time_type = ['yearly'. 'monthly']
    if(time_type==='yearly'){
      const __item = props["AllIssues"];
      var result= {
        labels: Object.keys(__item),
        data: sumIssuesByYear(__item),
        openIssues: props.totalOpenIssues
      }
      props.renderBarChart(result)
    }
   
  }
  
 
  render() {
    //using redux, all dependent state must be managed within reducer. avoid local state, 
    console.log("didmount", this.props)
    return (
      <div className="container">

          { (this.state.width > 770) 
             ? /*DESKTOP navbar*/
             //TODO, navbar desktop should have header
                <Navbar />
             : /*MOBILE navber*/
                ""
          }

          <div>
            <Desktop 
              BarChartData={this.props.barChartData}
              LineChartData={this.props.lineChartData}
            />
          </div>

      </div>
    );
  }
};

const Desktop = (props) => {
  const BC = props.BarChartData;
  const LC = props.LineChartData
  console.log(BC)
  //TODO: if there is no LC or BC show loading;
  if(!BC || !LC) return <div></div>;
  return(
      <main>
         <BarChart
            Chart={CHART}
            labels={ BC.labels }
            label={"# of issues"}
            data={ BC.data }
            color={COLOR.bg[0]}
            borderColor={COLOR.border[0]} 
            openIssues={BC.openIssues}/>

         <LineChart
            Chart={CHART}
            label={"# of purchases"}
            labels={LC.labels}
            data={ LC.data }
            color={COLOR.bg[0]}
            borderColor={COLOR.border[0]}
            totalPurchases={LC.totalPurchases} />
      </main>
  )
};

const mapStateToProps = ({keyMetric}) => {
  return keyMetric
}

const mapDispatchToProps = KeyMetric_action;


module.exports = connect(mapStateToProps, mapDispatchToProps)(App);
