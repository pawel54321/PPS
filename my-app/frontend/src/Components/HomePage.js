import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import GroupList from './PostsForGroups/GroupList';
import Post from './PostsForGroups/Post';

import {Input } from 'react-chat-elements';
import { Button } from 'react-chat-elements'

class HomePage extends Component {


    render() {
      
        return (
            <div>
                <Row>
                    <Col md={3}>
                        <GroupList />
                    </Col>
                    <Col md={9}>
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
                <br />  <br />  <br />
            </div>
        );
    }
}

export default HomePage;
