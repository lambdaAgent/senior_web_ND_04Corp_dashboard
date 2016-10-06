import {createStore} from "redux";


const keyMetric = (state={}, action) => {
	switch(action.type){
		case "DV_newData":
			return Object.assign({}, state, action.data);
		break;

		default:
			// console.log("DV reducers")
			return state;
		break;
	}
}

module.exports = keyMetric;