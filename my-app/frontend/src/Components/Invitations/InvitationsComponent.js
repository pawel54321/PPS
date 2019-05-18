import React, { Component } from 'react';
import { render } from 'react-dom';
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import axios from 'axios';
import ListGroups from './ListGroups';

class InvitationsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isPaneOpenLeft: false,            
            groups: [], 

        };
        this.zwrocenieGrup();
    }



    componentDidMount() {
        Modal.setAppElement(this.el);
    
        this.setState({
            isPaneOpenLeft: this.props.info
        });
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
    
    render() {
        return <div ref={ref => this.el = ref}>         
        
            <SlidingPane
                isOpen={this.state.isPaneOpenLeft}
                title='Zarządzanie zaproszeniami'
                from='left'
                width='400px'
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
                {this.state.groups.map(dane => <ListGroups info={dane} />)} { /*ADMIN*/}

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
