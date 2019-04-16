import React, { Component } from 'react';
import './App.css';
import { Router, Route } from 'react-router-dom';
import history from './history';

import HomePage from './Components/HomePage';
import Login from './Components/Login';
import Register from './Components/Register';

class App extends Component {

/*
//test
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      counter: 0
    }
    this.getValues = this.getValues.bind(this);
  }

  getValues = async (event) => {
    event.preventDefault();
    const response = await axios.post('http://localhost:5000/api/value', {
      value: this.state.value,
    });
    if (response) {
      const value = response.data.value;
      this.setState((prevState, props) => {
        return {
          value,
          counter: prevState.counter + 1
        };
      });
    }
  }
//test
*/

  render() {
    //test
    //const { value, counter } = this.state;
    //test
    return (
      <Router history={history}>
        <div className="App">
          {/*
           * test
          <form onSubmit={this.getValues}>
            <button type="submit">Click getValues()</button>
          </form>

          {value ?
            (<div>
              <p>Wartość testowa: {value}, po raz: {counter}</p>
            </div>) :
            null
          }
          * test
          */}
          <Route exact path="/" component={HomePage} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
        </div>
      </Router>
    );
  }
}

export default App;
