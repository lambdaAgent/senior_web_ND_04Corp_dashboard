import React from 'react';
import { connect } from "react-redux";
import Dataview_action from "../actions/Dataview_action";
import $ from "jquery";

//components
import Navbar from "../component_utils/Navbar";
import BarChart from "../component_utils/BarChart";
import LineChart from "../component_utils/LineChart";


class DataView extends React.Component {
    constructor(props) {
        super(props);
		this.loopEvery2Second;
    	this.state={width:0, barChartReady: false, lineChartReady: false};
    }
  	componentWillMount() {
    	window.addEventListener("resize", this.setState({width: window.innerWidth}) )
      	this.setState({width: window.innerWidth}) 
      	//this.loopEvery2Second = setInterval( () => {
        	this.props.getDatabaseFromServer();
      	//},2000);
  	}
  	componentWillUnmount() {
      //TODO; clearInterval
  	}
  	componentWillUpdate(nextProps, nextState) {
  	 	console.log("will update");
  	}
    render() {
    	const AllIssues = this.props.newData ? this.props.allIssues : undefined;
    	const props = this.props;
    	const submitted = (AllIssues && AllIssues.length > 0) ? 
					    	AllIssues.map((s,index) =>{
								return (
									<tr key={"tablerow"+index}>
										<th scope="row">{s.created_at}</th>
										<td>{s.customer_name}</td>
										<td style={{maxWidth: "10%"}}>{s.customer_email}</td>
										<td>{s.status}</td>
										<td>{s.closed_by}</td>
										<td>{s.closed_at}</td>
										<td>{s.description}</td>
									</tr>
								)
							}) : ""
        return (
        	<div className="container">
        	    <button onClick={() => this.props.getDatabaseFromServer()}> update</button>
        		{(!AllIssues) ? <div>Loading...</div> : 
	        		<table className="table table-hover">
					  <thead className="thead-inverse">
					    <tr>
					      <TableHead content={"Submitted"} PROPS={props} AllIssues={AllIssues} />
					      <TableHead content={"Full Name"} PROPS={props} AllIssues={AllIssues}/>
					      <TableHead content={"Email"} PROPS={props} AllIssues={AllIssues}/>
					      <TableHead content={"Status"} PROPS={props} AllIssues={AllIssues}/>
					      <TableHead content={"Closed By"} PROPS={props} AllIssues={AllIssues}/>
					      <TableHead content={"Closed At"} PROPS={props} AllIssues={AllIssues}/>
					      <TableHead content={"Description"} PROPS={props} AllIssues={AllIssues}/>
					    </tr>
					  </thead>
					  <tbody>
					    	{submitted}
					  </tbody>
					</table>
        		}
        	</div>
        );
    }
}

const mapStateToProps = ( ({Dataview_reducer}) => Dataview_reducer )
const mapDispatchToProps = Dataview_action;

module.exports = connect(mapStateToProps, mapDispatchToProps,null,{pure:false})(DataView);



class TableHead extends React.Component {
	constructor(props){
		super(props);
		this.state={ sortAsc: null, iconClassName: "" }
	}
	_click(field){
		field = reformatField(field);
		var iconClassName = "";
		// iconClassName should be reversed, or what will happen after toggle.
		if (this.state.sortAsc == true) iconClassName = "glyphicon glyphicon-triangle-bottom"; 
		if (this.state.sortAsc == false) iconClassName = "glyphicon glyphicon-triangle-top";

		// if the file is unsorted, sort once
		if (this.state.sortAsc === null) {
			this.setState({sortAsc: true, iconClassName: "glyphicon glyphicon-triangle-top" });
			return this.props.PROPS.sortBy(this.props.AllIssues, field, true)
		}

		// // sort must include the reverse of current state,
		this.setState({ sortAsc: !this.state.sortAsc, iconClassName});
		this.props.PROPS.sortBy(this.props.AllIssues, field, !this.state.sortAsc);
	}
	render(){
		const props = this.props;
		return (
			<th style={Object.assign({}, {cursor:"pointer", userSelect: "none"}, props.style)}
			    onClick={this._click.bind(this, props.content)} >
				{props.content}
				<i style={{display: "inline"}} className={this.state.iconClassName}></i>
			</th>
		)
	}
};

function reformatField(field){
	if(field === "Closed By"){
		return "closed_by"
	} else if (field === "Closed At"){
		return "closed_at"
	} else if ( field === "Submitted"){
		return "created_at"
	} else if (field === "Full Name"){
		return "customer_name"
	} else if ( field === "Email"){
		return "customer_email"
	} else {
		return field.toLowerCase();
	}
}
