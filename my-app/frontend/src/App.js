import React, { Component } from 'react';
import './App.css';
import { Router, Route } from 'react-router-dom';
import history from './history';
import axios from 'axios';

import HomePage from './Components/HomePage';
import Login from './Components/Login';
import Register from './Components/Register';
import Header from './Components/Header';
import Footer from './Components/Footer';

import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
// optional - you can choose the effect you want
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/scale.css';
import 'react-s-alert/dist/s-alert-css-effects/bouncyflip.css';
import 'react-s-alert/dist/s-alert-css-effects/flip.css';
import 'react-s-alert/dist/s-alert-css-effects/genie.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loggedAs: '',
            jaki_user: ''
        }
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.getUser);
    }

    handleUserLoggedChange = (loggedAs, jaki_user) => {
        // debugger
        //localStorage.setItem('loggedAs',loggedAs);
        //alert(localStorage.getItem('loggedAs'));

        this.setState({
            loggedAs: loggedAs,
            jaki_user: jaki_user
        });
    }

    LoginComponent = () => {
        return (<Login onLoggedUserChange={this.handleUserLoggedChange} />);
    }

    getUser = () => {
        const user = axios.post('http://localhost:5000/ReadToken', {
            token: sessionStorage.getItem('token')
        });
        this.setState({
            loggedAs: user.data.user.login,
            jaki_user: user.data.user.jaki_user
        });
    };

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
        return (
            <Router history={history}>
                <div className="App">
                    <Header loggedAs={this.state.loggedAs} />
                    <main>
                        {this.props.children}
                        <center><Alert stack={{ limit: 1 }} html={false} timeout={2000} effect='bouncyflip' offset={65} /></center>
                        {this.Ruty()}
                    </main>
                    <Footer />
                </div>
            </Router>
        );
    }

    Ruty = () => {
        if (this.state.jaki_user === 'Admin') {
            return (
                <div>
                    <Route exact path="/" component={HomePage} />
                </div>
            );
        }

        else if (this.state.jaki_user === 'User') {
            return (
                <div>
                    <Route exact path="/" component={HomePage} />
                </div>
            );
        }
        else {
            return (
                <div>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/login" component={this.LoginComponent} />
                    <Route exact path="/register" component={Register} />
                </div>
            );
        }

    }
}

export default App;
