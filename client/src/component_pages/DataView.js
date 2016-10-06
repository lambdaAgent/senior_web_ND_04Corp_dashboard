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
  	 	console.log("will update", nextProps);
  	}
    render() {
    	//if no newData, wait for nextRender, show loading
    	var shownIssues = this.props.newData ? this.props.allIssues : undefined;
    	//if there is filtered data, show filtered data
    	shownIssues = this.props.filtered ? this.props.filtered : this.props.allIssues;
    	const props = this.props;
    	const submitted = (shownIssues && shownIssues.length > 0) ? 
					    	shownIssues.map((s,index) =>{
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
        	    <Navbar />
        	    <button onClick={() => this.props.getDatabaseFromServer()}> update</button>
        		{(!shownIssues) ? <div>Loading...</div> : 
	        		<table className="table table-hover">
					  <thead className="thead-inverse">
					    <tr>
					      <TableHead content={"Submitted"} PROPS={props}   />
					      <TableHead content={"Full Name"} PROPS={props}  />
					      <TableHead content={"Email"} PROPS={props}  />
					      <TableHead content={"Status"} PROPS={props}  />
					      <TableHead content={"Closed By"} PROPS={props}  />
					      <TableHead content={"Closed At"} PROPS={props}  />
					      <TableHead content={"Description"} PROPS={props}  />
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
		// this is because there is race condition between redux and react, redux wins the race.
		if (this.state.sortAsc == true) iconClassName = "glyphicon glyphicon-triangle-bottom"; 
		if (this.state.sortAsc == false) iconClassName = "glyphicon glyphicon-triangle-top";

		// if the file is unsorted, sort once
		if (this.state.sortAsc === null) {
			this.setState({sortAsc: true, iconClassName: "glyphicon glyphicon-triangle-top" });
			return this.props.PROPS.sortBy(this.props.PROPS.allIssues, field, true)
		}

		// there is race condition, state won't be changed while sortBy runs, 
		// so always include reverse of current state to sortBy
		this.setState({ sortAsc: !this.state.sortAsc, iconClassName});
		this.props.PROPS.sortBy(this.props.PROPS.allIssues, field, !this.state.sortAsc);
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
