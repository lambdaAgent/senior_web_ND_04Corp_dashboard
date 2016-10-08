import React from 'react';
import $ from "jquery";

//components
import Navbar from "../component_utils/Navbar";

var Map, DataConfiguration;
class GeoSpatial extends React.Component {
    constructor(props) {
        super(props);
        this.state={ employee: undefined,countryCode: undefined, 
                     showLeftMenu: false, showRightMenu: false,
                     mapHeight:0, width:0
                   }
    }
    componentDidMount() {
        window.addEventListener("resize", this.setState({width: window.innerWidth}) )
        this.setState({width: window.innerWidth}) 
        fetch("http://localhost:8000/getAll")
        .then(res => res.json())
        .then(obj => {
          // labels = {USA: 'USA = 2 employee'}
          console.log(obj)
          var labels = {}, counts = {}, colors={};
           obj.employee.map(employee => {
              obj.countryCode.map(c => {
                 if(c.countryName.indexOf(employee.country) >= 0 ){
                     counts[c.countryCode] = (counts[c.countryCode] ? counts[c.countryCode]+=1 : 1); 
                     labels[c.countryCode] = `${c.countryCode}: ${counts[c.countryCode]} `;
                     colors[c.countryCode] = {fillKey: "EMPLOYEE", NumberOfEmployee: counts[c.countryCode]}
                 }
              })
           });
           var mapHeight =5/12 *  this.state.width || 0;
           this.setState({labels:labels, data:colors, mapHeight})
        })
    }
    componentDidUpdate(nextProps, nextState) {
        Map = new window.Datamap({
                    element: document.getElementById("map"),
                    fills: {
                          EMPLOYEE: 'rgba(255,0,100, 0.3)',
                          defaultFill: 'rgb(0,0,0)',
                    },
                    data: this.state.data,
                     geographyConfig: {
                          popupTemplate: function(geo, data) {
                              return ['<div class="hoverinfo"><strong>',
                                      'Number of Employee in ' + geo.properties.name,
                                      ': ' + data.NumberOfEmployee,
                                      '</strong></div>'].join('');
                          }
                      }
                });
        Map.legend();
        Map.labels({'customLabelText': this.state.labels });
     
    }
        // Map.labels({'customLabelText': {RUS: 'RUS: 20Employee', USA: "USA: 12employee"}});

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
        return(
          <div>
            <Navbar
              NavHeader="GeoSpatial"
              RBAction={ this._showRightMenu.bind(this)}
              LBAction={ this._showLeftMenu.bind(this) }
              showLeftMenu={this.state.showLeftMenu}
              showRightMenu={this.state.showRightMenu}
            />
            <main onClick={this._closeAllMenu.bind(this)}>
              <h1 className="text-center"></h1>
              <div className="panel panel-primary " style={{position:"relative", width:"100%"}}>
                <div className="panel-heading">
                  <h2 className="panel-title text-center">Employee Distribution</h2>
                </div>
                <div className="panel-body">
                    <div id="map" 
                         style={{position:"relative", width:this.state.width - 75, 
                                 height:this.state.mapHeight
                                }}
                    ></div>
                </div>
              </div>
            </main>
          </div>
        );
    }
}

export default GeoSpatial;
