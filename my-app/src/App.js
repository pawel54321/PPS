import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//import axios from 'axios';

class App extends Component {

    /*
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }
    }

    getValues = async (event) => {
        event.preventDefault();
        const valueee = await axios.post('/api/value', {
            value: this.state.value,
        });
        console.log(valueee);
        this.setState({
            value: '',
        });
    */

       
    }
    render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
            </header>

            {/*
                <form onSubmit={this.getValues}>
                    <button>Click getValues()</button>
                </form>
            */}
      </div>
    );
  }
}

export default App;
