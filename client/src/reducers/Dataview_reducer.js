import {createStore} from "redux";


const keyMetric = (state={}, action) => {
	switch(action.type){
		case "DV_newData":

			return Object.assign({}, state, action.data);
		break;

		case "DV_FILTER":
			state = Object.assign({}, state, action.data)
		console.log("action", state)
		console.log("filtered", action.data);
			return state;
		break;

		default:
			// console.log("DV reducers")
			return state;
		break;
	}
}

module.exports = keyMetric;