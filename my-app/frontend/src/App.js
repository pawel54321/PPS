import axios from 'axios';
import React, { Component } from 'react';
import './App.css';
class App extends Component {

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

  render() {
    const { value, counter } = this.state;
    return (
      <div className="App">

        <form onSubmit={this.getValues}>
          <button type="submit">Click getValues()</button>
        </form>

        {value ?
          (<div>
            <p>Wartość testowa: {value} po raz: {counter}</p>
          </div>) :
          null
        }

      </div>
    );
  }
}

export default App;
