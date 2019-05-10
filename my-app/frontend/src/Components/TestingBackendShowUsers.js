import React, { Component } from 'react';
//import axios from 'axios';

class TestingBackendShowUsers extends Component {


    render() {
        return (
            <div>
                TestingBackendShowUsers/TestingBackendShowUser:<br />
                {this.props.info.id}
                {this.props.info.imie}
                {this.props.info.nazwisko}
                {this.props.info.login}
                {}
                {this.props.info.prawa}
            </div>
        );
    }
}

export default TestingBackendShowUsers;
