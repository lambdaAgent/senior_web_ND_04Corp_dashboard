import React from 'react';
import { connect } from "react-redux";
import Dataview_action from "../actions/Dataview_action";
import $ from "jquery";

//components
import Navbar from "../component_utils/Navbar";
import BarChart from "../component_utils/BarChart";
import LineChart from "../component_utils/LineChart";
import SearchBar from "../component_utils/SearchBar"
import Loading from "../component_utils/Loading";

class DataView extends React.Component {
    constructor(props) {
        super(props);
		this.loopEvery4Second;
    	this.state={width:0, barChartReady: false, lineChartReady: false, showLeftMenu: false, showRightMenu: false};
    }
  	componentWillMount() {
    	window.addEventListener("resize", this.setState({width: window.innerWidth}) )
      	this.setState({width: window.innerWidth}) 
      	this.loopEvery4Second = setInterval( () => {
        	this.props.getDatabaseFromServer();
      	},2000);
  	}
  	componentWillUnmount() {
      clearInterval(this.loopEvery4Second)
  	}
  	_filterSearch(word){
  		this.props.filterBySearch(this.props.allIssues, word)
  	}	
  	_showLeftMenu(){
  		this.setState({showLeftMenu: !this.state.showLeftMenu})
  	}
  	_showRightMenu(){
  		this.setState({showRightMenu: !this.state.showRightMenu})
  	}
  	_closeAllMenu(){
  		this.setState({showLeftMenu: false, showRightMenu: false})
  	}
    render() {
    	//if no newData, wait for nextRender, show loading
    	var shownIssues = this.props.newData ? this.props.allIssues : undefined;
    	//if there is filtered data, show filtered data
    	shownIssues = this.props.filtered ? this.props.filtered : this.props.allIssues;
    	// console.log(shownIssues.length)
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
							}) : "";
        
		const submittedMobile = (shownIssues && shownIssues.length > 0) ?
								  shownIssues.map((s, index) => {
								  	return(
 						<article className="card card-block">
						    <h4 className="card-title"><b>Name:</b> {s.customer_name} | {s.created_at}</h4>
						    <p className="card-text"><b>email:</b> {s.customer_email}</p>
						    <p className="card-text"><b>status:</b> {s.status}</p>    
						    <p className="card-text"><b>closed_by:</b> {s.closed_by}</p>    
							<p className="card-text"><b>closed_at:</b> {s.closed_at}</p>
							<p className="card-text"><b>description:</b> {s.description}</p>     
							<hr style={{border: "1px solid black"}}/>
						</article>
								  	);
								  }) : "";
        return (
        	<div>
        	    <Navbar 
        	    	NavHeader="Dataview"
        	    	RBAction={ this._showRightMenu.bind(this)}
        	    	LBAction={ this._showLeftMenu.bind(this) }
        	    	showLeftMenu={this.state.showLeftMenu}
        	    	showRightMenu={this.state.showRightMenu}
        	    	CollapsedMenuLeftContent={
        	    		<div>
	        	    		<FilterMenu 
	        	    			listOfCustomerName={props.listOfCustomerName}
								listOfEmployeeName={props.listOfEmployeeName}
								allIssues={props.allIssues}
							    showAllCustomer={props.showAllCustomer}
							    filterByCustomerName={props.filterByCustomerName}
							    showAllEmployee={props.showAllCustomer}
							    filterByEmployeeName={props.filterByEmployeeName}
	        	    		/>
	        	    		<Sort 
	        	    			PROPS={props}
	        	    			shownIssues={shownIssues}
	        	    		/>
        	    		</div>
        	    	}
        	    />
        	    <main className="container" onClick={this._closeAllMenu.bind(this)}>
	        	    <label htmlFor="searchbar" >Search: </label>
			        <div style={{position:"relative"}}>
			            <SearchBar 
			              style={{width: "100%", textIndent: 30, borderRadius: 5}}
			              onEnterPress={this._filterSearch.bind(this)}
			              onChange={this._filterSearch.bind(this)}
			            />
			            <i className="glyphicon glyphicon-search" style={{top:3, left:5, position:"absolute", fontSize:"20px"}}></i>
			        </div>
			     	<hr/>
	        		{(!shownIssues) ? 
	        			/* show loading if no data exists*/
	        			<div><Loading /></div> 
	        			: 
	        		    (this.state.width > 720) ?
			        	 	<table className="table table-hover">
							  <thead className="thead-inverse">
							    <tr>
							    {  
							    	[ "Submitted", "Full Name", "Email", "Status", 
							    	  "Closed By", "Closed At", "Description"
							    	].map((content, index) => {
							    	  return	<TableHead key={index} content={content} PROPS={props}  shownIssues={shownIssues} />
							       })
							    }
							    </tr>
							  </thead>
							  <tbody>
							    	{submitted}
							  </tbody>
							</table>
							:
							<div className="list-group">
							  {submittedMobile}
							</div>
					    
	        		}
	        	</main>
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
			return this.props.PROPS.sortBy(this.props.shownIssues, field, true)
		}

		// there is race condition, state won't be changed while sortBy:Redux runs, 
		// so always include reverse of current state to sortBy:Redux
		this.setState({ sortAsc: !this.state.sortAsc, iconClassName});
		this.props.PROPS.sortBy(this.props.shownIssues, field, !this.state.sortAsc);
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

var FilterMenu = (props) => {
	return(
		<div className="row" style={{marginLeft: 20}}>
        	<div className="row">
	   			<h3>Filter</h3>
	   			<label>Customer Name: </label>
	   			<SelectOptions 
	   				defaultValue={"none"}
	   				options={props.showAllCustomer(props.listOfCustomerName || [])}
	   				onChange={(e) => props.filterByCustomerName(props.allIssues, e.target.value)}
	   				/>
	   			<div className="row" > 
		   			<label style={{marginLeft: 15}}>Employee Name: </label>
		   			<SelectOptions 
		   				defaultValue={"none"}
		   				options={props.showAllEmployee(props.listOfEmployeeName || [])}
		   				onChange={(e) => props.filterByEmployeeName(props.allIssues, e.target.value)}
		   				/>
	   			</div>
        	</div>
        </div>
	)
}
FilterMenu.propTypes = {
	listOfCustomerName: React.PropTypes.array,
	listOfEmployeeName: React.PropTypes.array,
	allIssues: React.PropTypes.array,
    showAllCustomer: React.PropTypes.func.isRequired,
    filterByCustomerName: React.PropTypes.func.isRequired,
    showAllEmployee: React.PropTypes.func.isRequired,
    filterByEmployeeName: React.PropTypes.func.isRequired
}


const SelectOptions = (props) => {
	const options = (props.options && props.length > 0) ? "" : props.options.map((o, index) => {
		return <option style={{color: "black"}} key={index} value={o}>{o}</option>
	})
	return(
		<select name={props.name} 
              defaultValue={props.defaultValue} 
              style={{marginLeft: 20, color: "black"}}
              onChange={props.onChange}>
        <option value={props.defaultValue}>{props.defaultValue}</option> 
     	{options}
      </select>
	)
};


const Sort = (props) => {
	return(
		<div>
			<h3>Sort</h3>
			<label>sort by: </label>
			<SelectOptions 
				defaultValue={"none"}
   				options={[ "Submitted", "Full Name", "Email", "Status", 
						    "Closed By", "Closed At", "Description"]}
   				onChange={(e) => {
   					var field = reformatField(e.target.value)
   					props.PROPS.sortBy(props.shownIssues, field, true)
   				}}
			/>
		</div>
	)
}



