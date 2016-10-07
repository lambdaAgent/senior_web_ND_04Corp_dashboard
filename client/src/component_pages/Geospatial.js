import React from 'react';
import $ from "jquery";

//components
import Navbar from "../component_utils/Navbar";

var Map, DataConfiguration;
class GeoSpatial extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        Map = new window.Datamap({
                    element: document.getElementById("map"),
                    fills: {
                          EMPLOYEE: 'rgba(255,0,100, 0.3)',
                          defaultFill: 'rgb(0,0,0)',
                    },
                    data: {
                        'RUS':  {fillKey: 'LOW'},
                        'PRC': {},
                        'USA': {fillKey: 'MEDIUM'},
                        'GBR':  {fillKey: 'UNKNOWN'},
                        'FRA':  {fillKey: 'HIGH'},
                        'PAK':  {fillKey: 'HIGH'},
                        'USA': {numberOfThings: 10381}
                    },
                     geographyConfig: {
                          popupTemplate: function(geo, data) {
                              return ['<div class="hoverinfo"><strong>',
                                      'Number of Employee in ' + geo.properties.name,
                                      ': ' + data.numberOfThings,
                                      '</strong></div>'].join('');
                          }
                      }
                });
        Map.legend();
        Map.labels({'customLabelText': {RUS: 'RUS: 20Employee'}});

    }
    render() {
        return(
          <div>
            <Navbar
              NavHeader="GeoSpatial"
            />
            <main>
              <div id="map" style={{position:"relative", width:1500, height:1300}}></div>

            </main>
          </div>
        );
    }
}

export default GeoSpatial;
