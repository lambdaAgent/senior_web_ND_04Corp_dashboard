import {createStore} from "redux";


const keyMetric = (state={}, action) => {
	switch(action.type){
		case "KM_GET_from_DB":
			state = action.cleansedData;
			return state;
		break;

		case "RENDER_BAR_CHART":
			return  Object.assign({},state, {barChartData: action.data, newData:false});
		break;
		case "RENDER_LINE_CHART":
			return  Object.assign({},state, {lineChartData: action.data, newData:false});
		break;
		default:
			// console.log("KM reducers")
			return state;
		break;
	}
}

module.exports = keyMetric;