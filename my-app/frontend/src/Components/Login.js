import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Alert from 'react-s-alert';
import { Button, Col, Row } from 'reactstrap';
import history from '../history';

class Login extends Component {

    constructor(props) {
        super(props);

        this.ZmianaWCzasieRzeczywistynInput2 = this.ZmianaWCzasieRzeczywistynInput2.bind(this);

        this.state = {
            login: '',
            haslo: '',
            login2: ''
        }
    }

    KlikniecieSubmit2 = async (event) => {
        event.preventDefault();

        const OdpowiedzSerwera2 = await axios.post('http://localhost:5000/Uzytkownik/Logowanie', {
            login: this.state.login,
            haslo: this.state.haslo
        });

        this.setState({
            login: '',
            haslo: '',
        });

        if (OdpowiedzSerwera2.data.zwracam_czy_poprawne === true) {
            localStorage.setItem('token', OdpowiedzSerwera2.data.token);
            //this.props.onLoggedUserChange(OdpowiedzSerwera2.data.jaki_user);
            //Alert.success('Logowanie przebiegło pomyślnie!', { position: 'top' });
            history.push('/');
            window.location.reload();
           //this.state.reload();
        }
        else if (OdpowiedzSerwera2.data.zwracam_czy_poprawne === false) {
            Alert.error('Niepoprawne dane!', { position: 'bottom' });
        }
    }

    ZmianaWCzasieRzeczywistynInput2(event) {
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
                        <form onSubmit={this.KlikniecieSubmit2}>
                            <center>
                            <br/> <br/> <br/> <br/> <br/>
                                <h5>Logowanie:</h5><br />
                                <label style={{ paddingRight: '140px' }}>Login: </label><br />
                                <input type="text" name="login" value={this.state.login} required onChange={this.ZmianaWCzasieRzeczywistynInput2} /><br />
                                <label style={{ paddingRight: '140px' }}>Hasło: </label><br />
                                <input type="password" name="haslo" value={this.state.haslo} required onChange={this.ZmianaWCzasieRzeczywistynInput2} /><br /><br />
                                <Button color="primary">Zaloguj się!</Button>
                                <br /><br />
                                Nie masz konta?<br /><Link to="/register">Zarejestruj się!</Link>
                            </center>
                        </form>
                    </Col>
                    <Col md={5}>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Login;
