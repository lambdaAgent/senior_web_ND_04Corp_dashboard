import React from 'react';

//components
import Navbar from "../component_utils/Navbar";
import Loading from "../component_utils/Loading";

var Map;
class GeoSpatial extends React.Component {
    constructor(props) {
        super(props);
        this.state={ employee: undefined,countryCode: undefined, 
                     showLeftMenu: false, showRightMenu: false,
                     mapHeight:0, width:0
                   };
        this.loopEvery2seconds;
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
    componentWillUnmount() {
       clearInterval(this.loopEvery2seconds);     
    }

    componentDidMount() {
        this.loopEvery2seconds = setInterval( () => {
          fetch("http://localhost:8000/getEmployee")
          .then(res => res.json())
          .then(obj => {
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
             var mapHeight = 5/12 *  this.state.width || 0;
             this.setState({labels:labels, data:colors, mapHeight})
          });
        },2000)

        Map = new window.Datamap(MapOptions(this));
        // Map.labels({'customLabelText': this.state.labels });
        window.addEventListener("resize", () => {
          Map.resize();
          this.setState({width: window.innerWidth}) 
        })
        this.setState({width: window.innerWidth}) 
     
    }
    componentWillUpdate(nextProps, nextState) {
        var mapElement = document.getElementById("map")
        mapElement.innerHTML = ""; 
        Map = new window.Datamap(MapOptions(this));

        Map.updateChoropleth(nextState.data, {reset:true});
        Map.labels();
        Map.labels({'customLabelText': nextState.labels }, {reset:true});
    }
        // Map.labels({'customLabelText': {RUS: 'RUS: 20Employee', USA: "USA: 12employee"}});

    
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

module.exports = GeoSpatial;



const MapOptions=(React) => ({
                    scope:"world",
                    element: document.getElementById("map"),
                    responsive:true,
                    fills: {
                          EMPLOYEE: 'rgba(255,0,100, 0.3)',
                          defaultFill: 'rgb(0,0,0)',
                    },
                    data: React.state.data,
                     geographyConfig: {
                          popupTemplate: function(geo, data) {
                              return ['<div class="hoverinfo"><strong>',
                                      'Number of Employee in ' + geo.properties.name,
                                      ': ' + data.NumberOfEmployee,
                                      '</strong></div>'].join('');
                          }
                      }
                })