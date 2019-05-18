import React, { Component } from 'react';
//import { render } from 'react-dom';
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import axios from 'axios';
import ListGroups from './ListGroups';
import ModListGroups from './ModListGroups';

import {Col, Row, TabContent, ListGroup, NavLink, ListGroupItem } from 'reactstrap';
//import Alert from 'react-s-alert';
import { Link } from 'react-router-dom';

class InvitationsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isPaneOpenLeft: false,            
            groups: [], 
            modgroups: []
        };
        this.zwrocenieGrup();
        this.zwrocenieModGrup();

    }


    componentDidMount() {
        Modal.setAppElement(this.el);
    }

    


    zwrocenieGrup = async () => {
        const token = await axios.post('http://localhost:5000/ReadToken', {
            token: localStorage.getItem('token')
        });
        const groups = await axios.post('http://localhost:5000/Grupa/Wyswietl/DanyLogin/Grupy_Gdzie_Nie_Jestem', {
            id: token.data.user.id
        });
        console.log(groups);
        this.setState({
            groups: groups.data.wyswietl
        });
    }

    zwrocenieModGrup = async () => {
        const token = await axios.post('http://localhost:5000/ReadToken', {
            token: localStorage.getItem('token')
        });
        const groups = await axios.post('http://localhost:5000/Zaproszenia/Wyswietl/DanyLogin', {
            id: token.data.user.id
        });
        console.log(groups);
        this.setState({
            modgroups: groups.data.wyswietl
        });
    }

    
    //KlikniecieSubmitZaproszenia (event) {
     //   event.preventDefault();

        //this.setState({ isPaneOpenLeft: true });
  //      Alert.error('Ustaw!', { position: 'bottom' });

       // this.setState({
       //     this.state.isPaneOpenLeft: true
      //  });
       
    

  //  }

 
  
    render() {


        return <div ref={ref => this.el = ref}>         


            <NavLink className="zaproszenia" style={{ paddingLeft: "45%" }}><Link onClick={() => this.setState({ isPaneOpenLeft: true })}><i className="fa fa-bell" /> Zaproszenia</Link></NavLink>

            <SlidingPane
                isOpen={this.state.isPaneOpenLeft}
                title='Zarządzanie zaproszeniami'
                from='left'
                width='500px'
                onRequestClose={() => this.setState({ isPaneOpenLeft: false })}>

                {/*<center><b>Wysłane prośby o dołaczenie do grup:</b></center>
                <br/>
                &#8592; Twoje zapytanie do grupy 'AAA' oczekuje na akceptacje... [USER]<br />
                <br />
                <center><b>Otrzymane prośby o dołączenie do grup:</b></center>
                <br />
                &#8592; Zaproszono Cię do grupy 'AAA' [USER]<br />
                &#8594; Użytkownik 'A' chce dołączyć do twojej grupy 'AAA' [MOD]
                <br />
                <br />*/}
                <center><b>Wyślij zaproszenie do podanych grup:</b></center>
                <br /> 
                <ListGroupItem>
                <ListGroup>
                    <TabContent>
                        <Row className="show-grid">
                            <Col xs={1}  >
                            </Col>
                            <Col xs={5}>
                                <div style={{ paddingTop: '5%' }}>
                                    <b> <center>Nazwa Grupy</center></b>
                                </div>
                            </Col>

                            <Col xs={5}>
                                <div style={{ paddingTop: '5%' }}>
                                    <b> <center>Akcje</center></b>
                                </div>
                            </Col>
                            <Col xs={1}>
                            </Col>
                        </Row>
                    </TabContent>
                </ListGroup>
                </ListGroupItem>
                <ListGroup>
                {this.state.groups.map(dane => <ListGroups info={dane} />)} 
                </ListGroup>
                <br />

                <center><b>Otrzymane prośby o dołączenie do twoich grup:</b></center>
                <br />
                <ListGroupItem>
                    <ListGroup>
                        <TabContent>
                            <Row className="show-grid">
                                
                                <Col xs={4}>
                                    <div style={{ paddingTop: '5%' }}>
                                        <b> <center>Nazwa Grupy</center></b>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <div style={{ paddingTop: '5%' }}>
                                        <b> <center>Użytkownik</center></b>
                                    </div>
                                </Col>

                                <Col xs={4}>
                                    <div style={{ paddingTop: '5%' }}>
                                        <b> <center>Akcje</center></b>
                                    </div>
                                </Col>
                                
                            </Row>
                        </TabContent>
                    </ListGroup>
                </ListGroupItem>
                <ListGroup>
                    {this.state.modgroups.map(dane => <ModListGroups info={dane} />)} 
                </ListGroup>
                <br />
            </SlidingPane>
        </div>;
    }
    /*
                <center>Wysłane prośby o dołaczenie do grup:</center>
                <br/>
                Twoje zapytanie do grupy 'AAA' oczekuje na akceptacje... [USER]
                //Twoje zapytanie do grupy 'AAA' zostało odrzucone!
                //Twoje zapytanie do grupy 'AAA' zostało zaakceptowane!
                <br />
                <center>Otrzymane prośby o dołączenie do grup:</center>
                <br />
                Zaproszono Cię do grupy 'AAA' [USER]
                Użytkownik 'A' chce dołączyć do twojej grupy 'AAA' //Dostaje powiadomienie ze ktos chce dolaczy do grupy Akceptacja/Odrzucenie [MOD]

                //Moderator ma tabele kogo moze zaprosic i jak zaprosi to znika z listy AND stan="Oczekujacy" nie pokazuje [MOD]
                <br />


    */
}

export default InvitationsComponent;
