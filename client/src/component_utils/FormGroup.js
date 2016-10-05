import React from 'react';

class FormGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state={
        	showError: false
        }
        this.displayName = 'FormGroup';
    }
    render() {
      const props = this.props;
      const style = props.style || {};
      const helpId = props.id || props.label
      return(
	 		<div className="form-group" style={style}>
	    		<label htmlFor={props.for || props.label}>{props.label}</label>
	    		<input 
                 aria-label={props.ariaLabel}
                 className={props.className || "form-control" }
                 name={props.name || props.label} 
                 id={props.id || props.label} 
	    		 type={props.type || "text"}
	    		 placeholder={props.placeholder || props.label} 
	    		 required={ props.required || false}
                 onBlur={props.offFocus}
                 autoComplete={props.autocomplete}
                 autoFocus={props.autofocus}
                 pattern={props.pattern}
                 title={props.title || props.label}/>
               
	    		<p id={"help-"+ helpId} 
             className="help-block" role="alert"
             style={Object.assign({}, props.helpStyle, {color:"red"})}>
             { this.state.showError ? props.errorMessage : "" }
          </p>
	    	</div>   
		)
    }
}


export default FormGroup;
