import {createStore} from "redux";


const homeReducer = (state={}, action) => {
	switch(action.type){
		case "":
		break;

		default:
			console.log(state)
			return state;
	}
}

module.exports = homeReducer