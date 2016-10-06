import React from 'react';
import {browserHistory} from "react-router";
/*
	name: Back button
	function: click to previous page
	props:
	onClick: func.isRequired,
	style: object

*/

const BackButton = (props) => (
	<button className="btn btn-primary" 
	        style={Object.assign({}, {marginBottom: 40 }, props.style)  }
	        onClick={ () => browserHistory.goBack() }
	        onKeyDown={(e) => {
	        	if(e.keyCode === 13 || e.keyCode ===32){
	        		browserHistory.goBack()
	        	}
	        }}
	        >{"< Back"}
	        </button>
)

export default BackButton;
