import React from "react";


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

module.exports = SelectOptions;
