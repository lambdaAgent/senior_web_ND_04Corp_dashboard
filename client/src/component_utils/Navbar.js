import React from 'react';
const $ = require("jquery");

import { Link , browserHistory} from 'react-router';
import Signup from "./SignUpbutton";

var currentUrl=""
class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {width: 0, url: "", showRightMenu: false, showLeftMenu: false};
    }
    _showRightMenu(e){
      this.setState({showRightMenu: !this.state.showRightMenu, showLeftMenu: false})
    }

    _showLeftMenu(e){
      this.setState({showLeftMenu: !this.state.showLeftMenu, showRightMenu: false})
    }
    _closeAllMenu(e){
      this.setState({showLeftMenu: false, showRightMenu: false})
    }
    render() {
        const self = this; //don't Delete this
        const showBackButton = this.props.showBackButton;
        const brand = "Corporate Dashboard";
        const aria_home = 'link to home';
       
        return(
        	<nav className="navbar navbar-inverse navbar-fixed-top">
            <div className="container">

                <CustomNavbar 
                    NavHeader={self.props.NavHeader}
                    RBSymbol={<Hamburger onClick={self._showRightMenu.bind(this)}/>}
                    RBAria={self.props.RBAria}
                    RBStyle={self.props.RBStyle}
                    LBSymbol={<Menu onClick={self._showLeftMenu.bind(this)}/>}
                    LBAria={self.props.LBAria}
                    LBStyle={self.props.LBStyle}
                  />
                  <CollapsedMenuRight 
                      showRightMenu={this.state.showRightMenu}
                  />
                   <CollapsedMenuLeft 
                      showLeftMenu={this.state.showLeftMenu}
                      content={this.props.CollapsedMenuLeftContent}
                  />
            </div>        
			    </nav>
        )
    }
}


export default Navbar;






const CustomNavbar = (props) => {
    return(
        <ul className="nav nav-tabs nav-justified"style={{width: "100%", color: "white", marginTop: 10}}>
          <div className="text-left"style={{width: "30%", display: "inline-block", float:"left"}}>
            <li onClick={props.LBAction}>{props.LBSymbol}</li>
          </div>
          <div className="text-center" style={{width: "30%", display: "inline-block"}}>
            <li style={{fontSize: 25, marginTop: 1}}>{props.NavHeader}</li>
          </div>
          <div className="text-right" style={{width: "30%", display: "inline-block", float: "right"}}>
            <li onClick={props.RBAction}>{props.RBSymbol}</li> 
          </div>
        </ul>
    )
}
  // <li aria-label={props.RBAria}
  //     tabIndex={0}
  //     onClick={props.RBAction}
  //     style={Object.assign({}, {fontSize: "25px"}, props.RBStyle)}
  //     >{props.RBSymbol} right</li>

const Menu = (props) => (
      <button type="button" className="btn btn-lg btn-default" 
              style={{background: "none", border:"none", color:"white"}} 
              aria-label="toggle menu"
              onClick={props.onClick}>
        <i className="glyphicon glyphicon-cog" style={{fontSize: 25}}></i>
      </button>     
)

const Hamburger = (props) => (
      <button type="button" className="btn btn-lg btn-default" 
              style={{background: "none", border:"none", color:"white"}} 
              aria-label="toggle menu"
              onClick={props.onClick}>
        <i className="glyphicon glyphicon-menu-hamburger" style={{fontSize: 25}}></i>
      </button>     
)

var CollapsedMenuRight = (props) => (
  <div className="navbar-inverse" id="Hamburger-Menu" 
         style={Object.assign({}, {marginTop: 0, display: props.showRightMenu ? "inherit" :"none"})}>
      <ul className="dropdown">
          <li><Link style={dropdownStyle} to="/">Geospatial</Link></li>
          <li><Link style={dropdownStyle} to="/keymetric">KeyMetric</Link></li>
          <li><Link style={dropdownStyle} to="/dataview">DataView</Link></li>
      </ul>
    </div>    
)

CollapsedMenuRight.props = {
    aria_signup: React.PropTypes.string.isRequired  
}
const dropdownStyle={
  color: "white", cursor: "pointer", display:"block", 
  fontSize:20, margin:10, textAlign:"left", marginLeft:10
}




var CollapsedMenuLeft = (props) => (
  <div className="navbar-inverse" id="Hamburger-Menu" 
         style={Object.assign({}, {marginTop: 0, display: props.showLeftMenu ? "inherit" :"none"})}>
      <ul className="dropdown" style={dropdownStyle}>
          {props.content}
      </ul>
    </div>    
)