import React, { Component } from 'react';
import axios from 'axios';
import Alert from 'react-s-alert';
import { Button, Col, Row, TabContent, ListGroupItem } from 'reactstrap';

class ModListGroups extends Component {


    KlikniecieSubmit = async (event) => {
        event.preventDefault();

        // console.log(token.data.user.id);
        //console.log(this.props.info.id);
        const OdpowiedzSerwera2 = await axios.post('http://localhost:5000/Zaproszenia/Akceptacja_Lub_Odrzucenie_Zaproszenie_Uzytkownika_Do_Grupy', {
            login: this.props.info.login,
            grupa: this.props.info.nazwa,
            coZrobic: 'Zaakceptowane'
        });

        if (OdpowiedzSerwera2.data.zwracam_czy_zablokowano === true) {
            Alert.success('Zaakceptowano prośbe o dołączenie do podanej grupy!', { position: 'bottom' });

            document.getElementsByClassName(this.props.info.login)[0].style.display = 'none';
        }
        else if (OdpowiedzSerwera2.data.zwracam_czy_zablokowano === false) {
            Alert.error('Wystąpił błąd podczas zaakceptowania!', { position: 'bottom' });

        }
    }

    KlikniecieSubmit2 = async (event) => {
        event.preventDefault();

        // console.log(token.data.user.id);
        //console.log(this.props.info.id);
        const OdpowiedzSerwera2 = await axios.post('http://localhost:5000/Zaproszenia/Akceptacja_Lub_Odrzucenie_Zaproszenie_Uzytkownika_Do_Grupy', {
            login: this.props.info.login,
            grupa: this.props.info.nazwa,
            coZrobic: 'Odrzucone'
        });

        if (OdpowiedzSerwera2.data.zwracam_czy_zablokowano === true) {
            Alert.info('Odrzucono prośbe o dołączenie do podanej grupy!', { position: 'bottom' });

            document.getElementsByClassName(this.props.info.login)[0].style.display = 'none';
        }
        else if (OdpowiedzSerwera2.data.zwracam_czy_zablokowano === false) {
            Alert.error('Wystąpił błąd podczas odrzucenia!', { position: 'bottom' });

        }

    }

    render() {
        return (
            <ListGroupItem className={this.props.info.login}>
                <TabContent>
                    <Row className="show-grid">

                        <Col xs={4}>
                            <div style={{ paddingTop: '30%' }}>
                                <b> <center>{this.props.info.nazwa}</center></b>
                            </div>
                        </Col>
                        <Col xs={4}>
                            <div style={{ paddingTop: '30%' }}>
                                <b> <center>{this.props.info.login}</center></b>
                            </div>
                        </Col>

                        <Col xs={4}>
                            <div>
                                <form onSubmit={this.KlikniecieSubmit}>

                                        <Button color="success">Zaakceptuj!</Button>

                                </form>
                                <div style={{ padding: '1%' }}> </div>
                                <div style={{ paddingLeft: '13%' }}>
                                <form onSubmit={this.KlikniecieSubmit2}>

                                        <Button color="info">Odrzuć!</Button>

                                    </form>
                                </div>
                            </div>
                        </Col>

                    </Row>
                </TabContent>
            </ListGroupItem>
        );
    }
}

export default ModListGroups;
