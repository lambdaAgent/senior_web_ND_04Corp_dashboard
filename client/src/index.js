//library
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'
import { createStore } from "redux";
import { Provider } from "react-redux"

//pages
import App from './component_pages/App';
import NoMatch from "./component_pages/NoMatch.js";

//css
import './index.css';

//reducers
import reducers from "./reducers/index";

var store = createStore(reducers)

ReactDOM.render(
	<Provider store={store}>
	   	<Router history={browserHistory} >
		    <Route path="/" component={App}/>
			<Route path="*" component={NoMatch}/>
	  	</Router>
	</Provider>
  , document.getElementById('root')
);

