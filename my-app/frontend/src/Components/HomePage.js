import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import GroupList from './PostsForGroups/GroupList';

class HomePage extends Component {

    render() {

        return (
            <div>
                <Row>
                    <Col md={2}>
                        <GroupList />
                    </Col>
                    <Col md={10}>
                        {/*zawartość grupy*/}
                    </Col>
                </Row>
                {/*
                 jesli zalogowany to po lewej lista grup (panel) ktore 'ma' i moze w nie klikac i sie pojawia mozliwosc po prawej stronie dodania postu/komentarza do tej grupy
                 */}
            </div>
        );
    }
}

export default HomePage;
