//library
import React, { Component } from 'react';
import { connect } from "react-redux";
import KeyMetric_action from "../actions/KeyMetric_action";
import $ from "jquery";
var CHART; //will be initialized after component did mounted

//components
import Navbar from "../component_utils/Navbar";
import Loading from "../component_utils/Loading";
// import BarChart from "../component_utils/BarChart";
const LineChart = require("react-chartjs").Line;
const BarChart = require("react-chartjs").Bar;


const COLOR = {
  bg:['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)'],
  border:['rgba(255,99,132,1)',   'rgba(54, 162, 235, 1)',  'rgba(255, 206, 86, 1)'  ,'rgba(75, 192, 192, 1)'  ,'rgba(153, 102, 255, 1)'  ,'rgba(255, 159, 64, 1)']
}
var previousPurchase = 0;


/*  
    so many configuration with redux.... 
*/

class App extends Component {
  constructor(props){
    super(props);
    this.loopEvery4Second;
    this.state={width:0, barChartReady: false, lineChartReady: false, panelWidth:0};
  }
  componentDidMount() {
        window.addEventListener("resize", this.setState({width: window.innerWidth}) )
        CHART = window.Chart;
        this.loopEvery2Second = setInterval( () => {
            this.props.getDatabaseFromServer();
        },4000);
      
        var panel = $("#LoadingPanel");
        if(!panel[0]) return;
        var width = panel[0].offsetWidth-45;
        this.setState({panelWidth: width, width: window.innerWidth, panelHeight: 5/12 * width })        
  }
  componentWillUnmount() {
      clearInterval(this.loopEvery2Second)
  }
  componentWillUpdate(nextProps, nextState) {
    //using redux, React need to load twice before finally initialize the data from server
      if(nextProps.newData){
        previousPurchase = this.props.totalPurchases || 0;
        previousPurchase = previousPurchase.toFixed(2);

        this.props.renderLineChart(nextProps, 'yearly')
        this.props.renderBarChart(nextProps, 'yearly')
      }
  }
  _click(e){
    e.preventDefault();
    this.props.getDatabaseFromServer();
  } 
  _showLeftMenu(){
    this.setState({showLeftMenu: !this.state.showLeftMenu})
  }
  _showRightMenu(){
    this.setState({showRightMenu: !this.state.showRightMenu})
  }
  _closeAllMenu(){
    this.setState({showLeftMenu: false, showRightMenu: false})
  }
  render() {
    //using redux, all dependent state must be managed within reducer. avoid local state, 
    return (
      <div>
         <Navbar 
            NavHeader="Key Metric"
            RBAction={ this._showRightMenu.bind(this)}
            LBAction={ this._showLeftMenu.bind(this) }
            showLeftMenu={this.state.showLeftMenu}
            showRightMenu={this.state.showRightMenu}
          />
          <main className="container" onClick={this._closeAllMenu.bind(this)}>
            <Desktop 
              panelWidth={this.state.panelWidth}
              panelHeight={this.state.panelHeight}
              BarChartData={this.props.barChartData}
              LineChartData={this.props.lineChartData}
            />

          </main>

      </div>
    );
  }
};


const mapStateToProps = ( ({keyMetric}) => keyMetric )
const mapDispatchToProps = KeyMetric_action;


module.exports = connect(mapStateToProps, mapDispatchToProps)(App);




const Desktop = (props) => {
  const BC = props.BarChartData;
  const LC = props.LineChartData
  //TODO: if there is no LC or BC show loading;
  if(!BC || !LC) return <div className="panel chart_VD" id="LoadingPanel"><Loading /></div>;
  return(
      <div>
         {/*<BarChart
                     Chart={CHART}
                     labels={ BC.labels }
                     label={"# of issues"}
                     data={ BC.data }
                     color={COLOR.bg[0]}
                     borderColor={COLOR.border[0]} 
                     openIssues={BC.openIssues}/>*/}
        <br />

        <div className="panel panel-primary chart_VD" id="Panel">
            <div className="panel-heading">
              <h3 className="panel-title">Purchases Chart</h3>
            </div>
            <div className="panel-body">
              <BarChart data={createBC_DATA(BC)} width={props.panelWidth} height={props.panelHeight}/>
            </div>
            <div className="panel-footer">Previous Purchases: $ {separateThousands(props.previousPurchases)} | Total Purchases: $ {separateThousands(props.totalPurchases)}</div>
        </div>
        <div className="panel panel-primary chart_VD" >
            <div className="panel-heading">
              <h3 className="panel-title">Purchases Chart</h3>
            </div>
            <div className="panel-body" id="linePanel">
              <LineChart data={createLC_DATA(LC)} options={ {responsive: true, hover:{mode:"label"}} }width={props.panelWidth} height={props.panelHeight} />
            </div>
            <div className="panel-footer">Previous Purchases: $ {separateThousands(previousPurchase)} | Total Purchases: $ {separateThousands(LC.totalPurchases)}</div>
        </div>      
      </div>
  )
};



function separateThousands(number){
  var decimal = String(number).split(".")[1];
  var num = String(number).split(".")[0].split("");

  //loop from right
  var str = ""
  for(var i=num.length-1; i >= 0; i--){
     if(i % 3 === 0 && i !== 0){ //every 3 digit
         str = "," + num[i] + str;
     } else {
       str = num[i] + str;
     }
  }

  return str + "." + decimal
}


var createLC_DATA = (props) => ({
                  labels: props.labels,
                  datasets: [{
                      label: props.label,
                      data: props.data,
                      fill: false,
                      lineTension: 0.1,
                      backgroundColor: "rgba(75,192,192,0.4)",
                      borderColor: "rgba(75,192,192,1)",
                      borderCapStyle: 'butt',
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: 'miter',
                      pointBorderColor: "rgba(75,192,192,1)",
                      pointBackgroundColor: "#fff",
                      pointBorderWidth: 1,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: "rgba(75,192,192,1)",
                      pointHoverBorderColor: "rgba(220,220,220,1)",
                      pointHoverBorderWidth: 2,
                      pointRadius: 1,
                      pointHitRadius: 10,
                      spanGaps: false,
                  }]
              });

{/*<BarChart
                     Chart={CHART}
                     labels={ BC.labels }
                     label={"# of issues"}
                     data={ BC.data }
                     color={COLOR.bg[0]}
                     borderColor={COLOR.border[0]} 
                     openIssues={BC.openIssues}/>*/}

var createBC_DATA = (props) => ({
    labels: props.labels,
    datasets: [
        {
            label: "# of issues",
            backgroundColor: props.labels.map(l => COLOR.bg[0]),
            borderColor: props.labels.map(l => COLOR.border[0]),
            borderWidth: 1,
            data: props.data,
        }
    ]
});
