import React, { Component } from 'react';
import './App.css';
import { Router, Route } from 'react-router-dom';
import history from './history';
import PrivateRoute from './PrivateRoute'
import {token} from './Token';

import HomePage from './Components/HomePage';
import Login from './Components/Login';
import Register from './Components/Register';
import Header from './Components/Header';
import Footer from './Components/Footer';
//import CreateGroup from './Components/CreateGroup';
import Group from './Components/Group';
import User from './Components/User';
import Admin from './Components/Admin';

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

import InvitationsComponent from './Components/Invitations/InvitationsComponent';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            rola: null        
        };

   
    }

    componentDidMount() {
        token()
        .then((data) => {
            this.setState({
                user: data.data.user.login,
                rola: data.data.user.jaki_user
            });
        });
    }

  


    render() {
       // let createGroup;
        let group;
        let admin;
        let user;
        if(this.state.rola !== null) {
         //   createGroup = <PrivateRoute rola={this.state.rola} roles={['User']} path='/create' component={CreateGroup} />
            group = <PrivateRoute rola={this.state.rola} roles={['User','Admin']} path='/group' component={Group} />
            admin = <PrivateRoute rola={this.state.rola} roles={['Admin']} path='/admin' component={Admin} />
            user = <PrivateRoute rola={this.state.rola} roles={['User']} path='/user' component={User} />
        } else {
         //   createGroup = null;
            group = null;
            user = null;
            admin = null;
        }
    
        return (
            <Router history={history}>
                <div className="App">
                    <InvitationsComponent />
                    <Header rola={this.state.rola} />
                    <main>
                        {this.props.children}
                        <center><Alert stack={{ limit: 1 }} html={false} timeout={2000} effect='bouncyflip' offset={65} /></center>
                        <Route exact path='/' component={HomePage} />
                        <Route path='/login' component={Login} />
                        <Route path='/register' component={Register} />
                        {/*createGroup*/}
                        {group}
                        {admin}
                        {user}

                        
                    </main>
                    <Footer />
                </div>
            </Router>
        );
    }
}

export default App;
