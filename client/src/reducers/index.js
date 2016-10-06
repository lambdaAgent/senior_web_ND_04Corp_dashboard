import { combineReducers } from "redux";

//reducers
import keyMetric from "./keyMetric_reducer"
import Dataview_reducer from "./Dataview_reducer"

var Reducers = combineReducers({keyMetric,Dataview_reducer});

module.exports = Reducers;