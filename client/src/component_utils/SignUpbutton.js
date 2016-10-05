import React from "react"
import { Link,browserHistory } from 'react-router';


        

const Signup = (props) => {
	const aria_signup = "link to signup";
	const link_signup = "/signup"
	const signup_content = "signup"
	const signup_click = () => {}
	return(
		<Link to={link_signup} 
		      onClick={signup_click}
		      aria-label={aria_signup}
		      tabIndex={0}
		      style={props.style}
		      >
		      {signup_content}
		</Link>
	)
}

Signup.props = {
	link: React.PropTypes.string.isRequired,
	click: React.PropTypes.func.isRequired,
	aria: React.PropTypes.string.isRequired,
	content: React.PropTypes.string.isRequired
}


module.exports = Signup;