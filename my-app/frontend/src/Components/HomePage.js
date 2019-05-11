import React, { Component } from 'react';
import TestingBackend from './TestingBackendInReact/TestingBackend';

class HomePage extends Component {

    render() {
        return (
            <div>
                <p>TestingBackend</p>
                <TestingBackend/>
            </div>
        );
    }
}

export default HomePage;
