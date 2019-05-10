import React, { Component } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import TestingBackend from './TestingBackend';

class HomePage extends Component {

    tokenTest = async (event) => {
        event.preventDefault();

        const token = sessionStorage.getItem('token');
        console.log(token);
        const odp = await axios.post('http://localhost:5000/ReadToken', {
            token: token
        });

        console.log(odp.data.user);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.tokenTest}>
                  <Button color='primary'>TokenTest</Button>
                </form>

                <br/>
                <p>TestingBackend</p>
                <TestingBackend/>


            </div>
        );
    }
}

export default HomePage;
