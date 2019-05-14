import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import axios from 'axios';
import Alert from 'react-s-alert';

class CreateGroup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nazwa: "",
            opis: "",
        };

        this.ZmianaWCzasieRzeczywistynInput = this.ZmianaWCzasieRzeczywistynInput.bind(this);
    }

    KlikniecieSubmit = async (event) => {
        event.preventDefault();

        const token = await axios.post('http://localhost:5000/ReadToken', {
            token: localStorage.getItem('token')
        });

        const OdpowiedzSerwera = await axios.post('http://localhost:5000/Grupa/Stworz', {
            nazwa: this.state.nazwa,
            opis: this.state.opis
        });

        const OdpowiedzSerwera2 = await axios.post('http://localhost:5000/Grupa/Stworz_Moderatora', {
            id:  token.data.user.id,
            nazwa: this.state.nazwa,
        });

        this.setState({
            nazwa: "",
            opis: "",
        });



        if (OdpowiedzSerwera.data.zwracam_czy_stworzono === true && OdpowiedzSerwera2.data.zwracam_czy_stworzono === true) {
            Alert.success('Poprawnie utworzono grupę!', { position: 'top' });
        }
        else if (OdpowiedzSerwera.data.zwracam_czy_stworzono === false && OdpowiedzSerwera2.data.zwracam_czy_stworzono === false) {
            Alert.error('Podana nazwa grupy istnieje!', { position: 'bottom' });
        }
        else {
            Alert.warning('Coś poszło nie tak!', { position: 'bottom' });
        }
    }

    ZmianaWCzasieRzeczywistynInput(event) {
        const target = event.target;
        const value = target.value;
        const state = { ...this.state }

        state[target.name] = value;

        this.setState(state);
    }

    render() {
        return (
            <div>
                <Row className="show-grid">
                    <Col xs={6} md={5}>
                    </Col>
                    <Col xs={6} md={2} >
                        <form onSubmit={this.KlikniecieSubmit}>
                       
                                <br /> <br /> <br /> <br /> <br />
                                <h5 >{/*Stwórz grupę:*/}</h5><br />
                                <label style={{ paddingRight: '140px' }}>Nazwa: </label><br />
                                <input type="text" name="nazwa" value={this.state.nazwa} required onChange={this.ZmianaWCzasieRzeczywistynInput} /><br />
                                <label style={{ paddingRight: '140px' }}>Opis: </label><br />
                                <input type="text" name="opis" value={this.state.opis} required onChange={this.ZmianaWCzasieRzeczywistynInput} /><br /><br />
                                        <Button color="primary">Stwórz!</Button>
                                        <br /><br />
                            
                        </form>
                    </Col>
                    <Col md={5}>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default CreateGroup;﻿
