import React from 'react';
const $ = require("jquery");

import { Link , browserHistory} from 'react-router';
import Signup from "./SignUpbutton";

var currentUrl=""
class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {width: 0, url: "" };
    }
    render() {
        const self = this; //don't Delete this
        const showBackButton = this.props.showBackButton;
        const brand = "Corporate Dashboard";
        const aria_home = 'link to home';
        return(
        	<nav className="navbar navbar-inverse navbar-fixed-top">
				{ (!showBackButton) /*cannot use if, use ternary instead*/
                    
                    ? /*show bellow if backButton is OFF*/
           <div className="container">

                {/* MOBILE ONLY*/}
                <div className="mobile"> 
          					<div className="navbar-header" style={{marginRight: 8}}>
          						<Link to="/" className="navbar-brand" 
                                    aria-label={aria_home}>
                                    {brand}
                      </Link>
                      <ul className="nav navbar-nav" style={{float: "right"}}>
                          <li><Signup /> </li>
                      </ul>
                		</div>
                </div>

        					{/* DESKTOP ONLY*/}
                <div className="desktop">
                    <div className="navbar-header">
                        <Link to="/" 
                              className="navbar-brand"
                              aria-label={aria_home}
                              >{brand}</Link>
                    </div> 
            				<div className="navbar-collapes" >
            						<ul className="nav navbar-nav navbar-right">
            							<li><Signup /> </li>
            						</ul>
            				</div>
                </div>
              </div>
                    
                    : /*show below only if back button is ON*/ 
                        <TwoFunctionHeader 
                           RBSymbol={self.props.RBSymbol}
                           RBAria={self.props.RBAria}
                           RBAction={self.props.RBAction}
                           RBStyle={self.props.RBStyle}/>
                }
			</nav>
        )
    }
}


export default Navbar;






const TwoFunctionHeader = (props) => {
    return(
        <div className="navbar-header" style={{width: "100%"}}>
                <Link className="navbar-brand" 
                  style={{cursor: "pointer"}}
                  tabIndex={0}
                  onClick={ browserHistory.goBack }> {"< Back"}</Link>
                <ul className="navbar-brand" style={{float: "right", paddingTop:12, cursor:"pointer"}}>
                    <span aria-label={props.RBAria}
                          tabIndex={0}
                          onClick={props.RBAction}
                          style={Object.assign({}, {fontSize: "25px"}, props.RBStyle)}
                          >{props.RBSymbol}</span>
                </ul>
        </div>
    )
}


const Hamburger = (props) => (
      <button type="button" className="navbar-toggle collapsed" 
              aria-expanded="false" aria-label="toggle menu"
              onClick={props.onClick}>
        <span className="sr-only">Toggle navigation</span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
      </button>
     
)


var CollapsedMenu = (props) => (
  <div className="collapse navbar-collapse" id="Hamburger-Menu" 
         style={Object.assign({}, {marginTop: 0})}>
      <ul className="nav navbar-nav">
        <li id="Signup-hamburger">
          <Signup />
        </li>
      </ul>
    </div>    
)

CollapsedMenu.props = {
    aria_signup: React.PropTypes.string.isRequired  
}
