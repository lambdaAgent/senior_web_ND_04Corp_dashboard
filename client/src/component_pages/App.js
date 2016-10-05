import React, { Component } from 'react';
import { connect } from "react-redux";

//components
import Navbar from "../component_utils/Navbar";



class App extends Component {
  constructor(props){
    super(props);

  }

  componentDidMount() {
      this.props.getDatabaseFromServer();
  }
  render() {
    return (
      <div className="">
        <Navbar />
        <div className="container">
          <img className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
       
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
      </div>
    );
  }
}



const mapStateToProps = (state) => {
    console.log(state);
    return state
}

// ----------------
//     ACTIONS
// ----------------

const mapDispatchToProps = (dispatch) => ({
    getDatabaseFromServer(){
        fetch("localhost:8000/getAll")
          .then(res => res.json() )
          .then(obj => {
              console.log("obj", obj)
              dispatch({type: "GET_DB", database: obj})
          })
          .catch(err => console.error(err))
    }
})



module.exports = connect(mapStateToProps, mapDispatchToProps)(App)