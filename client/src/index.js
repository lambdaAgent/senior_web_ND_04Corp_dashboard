//library
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'
import { createStore } from "redux";
import { Provider } from "react-redux"

//pages
import KeyMetric from './component_pages/KeyMetric';
import NoMatch from "./component_pages/NoMatch.js";
import DataView from "./component_pages/DataView"

//css
import './index.css';

//reducers
import reducers from "./reducers/index";

var store = createStore(reducers)

ReactDOM.render(
	<Provider store={store}>
	   	<Router history={browserHistory} >
		    <Route path="/" component={KeyMetric}/>
  		    <Route path="/dataview" component={DataView}/>
			<Route path="*" component={NoMatch}/>
	  	</Router>
	</Provider>
  , document.getElementById('root')
);

