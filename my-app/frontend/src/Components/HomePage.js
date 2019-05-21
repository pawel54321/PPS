import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import GroupList from './PostsForGroups/GroupList';
import Post from './PostsForGroups/Post';

import {Input } from 'react-chat-elements';
import { Button } from 'react-chat-elements'
import axios from 'axios';
import { Link } from 'react-router-dom';

class HomePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            token: null,
        }

       

    }
    componentDidMount() {
        this.zwrocenieCzyZalogowany();    
    }


    zwrocenieCzyZalogowany = async () => {
        const token = await axios.post('http://localhost:5000/ReadToken', {
            token: localStorage.getItem('token')
        });

        this.setState({
            token: token
        });
    }

    render() {

        if (!this.state.token) {

            return (
                <div>
                    <br/>
                    <Col sm='12' md={{ size: 12, offset: 0 }}>
                        <Row>

                            <h4 style={{ textAlign: 'center', width: '100%' }}>
                                <br /> <br /> <br /> <br /> <br />
                                <h1>Witamy!</h1><br />
                                Do prawidłowego korzystania z serwisu wymagane jest posiadanie konta!<br />
                                Zarejestruj się, klikając w odpowiedni przycisk w panelu nawigacyjnym lub <Link to="/register">Tutaj</Link>.<br /><br />
                                <h3>Dziękujemy za korzystanie z serwisu i życzymy udanych integracji!</h3></h4>
                        </Row>
                    </Col>
                </div>
            );

        }
        else
        {


            return (
                <div className={"chat"}>

                    <Row>
                        <Col md={3} style={{ padding: "0px" }}>
                            <GroupList />
                        </Col>
                        <Col md={9} style={{ padding:"0px" }}>
                            {/*zawartość grupy*/}

                            <Post />

                            <Input

                                placeholder="Skomentuj..."
                                multiline={false}
                                rightButtons={
                                    <Button
                                        color='white'
                                        backgroundColor='black'
                                        text='Wyślij' />
                                }

                            /*OnKeyPress={(e) => { this.refs.input.clear() }}*/ />

                            {/* emitonki*/}
                        </Col>
                    </Row>
                    {/*
                 jesli zalogowany to po lewej lista grup (panel) ktore 'ma' i moze w nie klikac i sie pojawia mozliwosc po prawej stronie dodania postu/komentarza do tej grupy
                 */}
                    <br />  <br />  <br /> <br /> <br /> <br /> <br /> <br /> <br />
                </div>
            );
        }
    }
}

export default HomePage;
