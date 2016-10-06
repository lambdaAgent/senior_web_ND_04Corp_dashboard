import React from "react";
import $ from "jquery";

const BarChart = (props) => {
 const Chart = props.Chart;
 const load = () => {
waitNextTick()
    .then(() => {
        console.log("barchartload")

        var chart = $("#barChart")[0];
        if(!chart) return;

        var ctx = $("#barChart");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: props.labels,
                datasets: [{
                    label: props.label,
                    data: props.data,
                    backgroundColor: props.labels.map(l => props.color) ,
                    borderColor: props.labels.map(l => props.borderColor) ,
                    borderWidth: 0.01
                }]
            },
            options: {
              scales: {
                yAxes: [{
                  ticks: {beginAtZero: true}
                }]
            }
           }
        });
    });//waitNextTick();
 }
  return(
        <div className="panel panel-danger chart_VD">
          <div className="panel-heading">
              <h3 className="panel-title">Issues Chart</h3>
          </div>
          <div className="panel-body">
              <canvas id="barChart"  onLoad={ load() }>
                Your browser does not support canvas, please upgrade to latest browser
              </canvas>
          </div>
          <div className="panel-footer">Open Issue: {props.openIssues}</div>
      </div>      
  )
}


module.exports = BarChart;

function waitNextTick(){
  return Promise.resolve( setTimeout(() => {},0) )
}