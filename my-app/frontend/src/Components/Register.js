import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Alert from 'react-s-alert';
import { Button, Col, Row, Input } from 'reactstrap';

class Register extends Component {

    constructor(props) {
        super(props);

        this.ZmianaWCzasieRzeczywistynInput = this.ZmianaWCzasieRzeczywistynInput.bind(this);

        this.state = {
            imie: '',
            nazwisko: '',
            login: '',
            haslo: '',

        }
    }

    KlikniecieSubmit = async (event) => {
        event.preventDefault();

        const OdpowiedzSerwera = await axios.post('http://localhost:5000/Uzytkownik/Rejestracja', {
            imie: this.state.imie,
            nazwisko: this.state.nazwisko,
            login: this.state.login,
            haslo: this.state.haslo
        });

        this.setState({
            imie: '',
            nazwisko: '',
            login: '',
            haslo: '',

        });

        if (OdpowiedzSerwera.data.zwracam_czy_stworzono === true) {
            Alert.success('Rejestracja przebiegła pomyślnie!', { position: 'top' });
                this.props.history.push('/login');
        }
        else if (OdpowiedzSerwera.data.zwracam_czy_stworzono === false) {
            Alert.error('Użytkownik istnieje!', { position: 'bottom' });
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
            <div className={"register"}>
                <Row className="show-grid">
                    <Col xs={6} md={5}>
                    </Col>
                    <Col xs={6} md={2} >
                        <form onSubmit={this.KlikniecieSubmit}>
                            <center>
                            <br/> <br/> <br/>
                                <h5>Rejestracja:</h5><br />
                                <label style={{ paddingRight: '250px' }}>Imię: </label><br />
                                <Input type="text" name="imie" value={this.state.imie} required onChange={this.ZmianaWCzasieRzeczywistynInput} /><br />
                                <label style={{ paddingRight: '210px' }}>Nazwisko: </label><br />
                                <Input type="text" name="nazwisko" value={this.state.nazwisko} required onChange={this.ZmianaWCzasieRzeczywistynInput} /><br />
                                <label style={{ paddingRight: '240px' }}>Login: </label><br />
                                <Input type="text" name="login" value={this.state.login} required onChange={this.ZmianaWCzasieRzeczywistynInput} /><br />
                                <label style={{ paddingRight: '240px' }}>Hasło: </label><br />
                                <Input type="password" name="haslo" value={this.state.haslo} required onChange={this.ZmianaWCzasieRzeczywistynInput} /><br /><br />
                                <Button color="primary">Zarejestruj się!</Button>
                                <br /><br />
                                Masz konto?<br /><Link to="/login">Zaloguj się!</Link>
                                <br /><br />    <br /><br />    <br /><br />
                            </center>
                        </form>
                    </Col>
                    <Col xs="hidden" md={5}>
                    </Col>
                </Row>
            </div >
        );
    }
}

export default Register;
