import React, { Component } from 'react';
//import axios from 'axios';

class TestingBackendShowGroups extends Component {


    render() {
        return (
            <div>
                TestingBackendShowGroups:<br />
                {this.props.info.id}
                {this.props.info.nazwa}
                {this.props.info.opis}
            </div>
        );
    }
}

export default TestingBackendShowGroups;
