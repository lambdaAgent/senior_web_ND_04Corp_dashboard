import React from "react";
import $ from "jquery";

import SelectOptions from "./SelectOptions"

class LineChart extends React.Component {
    
    render(){
      const props = this.props;
      const Chart = props.Chart;
      const datasets = [{
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
      const labels = props.labels;
      const load = () => {
          waitNextTick()
          .then(() => {

              var chart = $("#lineChart")[0];
              if(!chart) return;

              var ctx = $("#lineChart");
              if(myChart) {
                myChart.labels = labels
                myChart.datasets = datasets
                myChart.update();
                return;
              }
              var myChart = new Chart(ctx, {
                  type: 'line',
                  data: {
                      labels: labels,
                      datasets: datasets
                  },
                  options: {
                    animation:false,
                    scales: {
                      yAxes: [{
                        ticks: {beginAtZero: true}
                      }]
                  }
                 }
              });
          });//waitNextTick();
      }//load();
      return(
          <div className="panel panel-primary chart_VD" autofocus="false">
              <div className="panel-heading">
                  <h3 className="panel-title">Purchases Chart</h3>
              </div>
              <div className="panel-body">
                
                  <canvas id="lineChart"  onLoad={ load() } autofocus="false">
                    Your browser does not support canvas, please upgrade to latest browser
                  </canvas>
              </div>
              <div className="panel-footer">Previous Purchases: $ {separateThousands(props.previousPurchases)} | Total Purchases: $ {separateThousands(props.totalPurchases)}</div>
          </div>      
      );
    }
}


module.exports = LineChart;

function waitNextTick(){
  return Promise.resolve( setTimeout(() => {},0) )
}
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
