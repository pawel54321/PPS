import React, { Component } from 'react';
import TestingBackend from './TestingBackendInReact/TestingBackend';
import { Col, Row } from 'reactstrap';
import GroupList from './GroupList';

class HomePage extends Component {

    render() {
        return (
            <div>
                <Row>
                    <Col md={2}>
                        <GroupList />
                    </Col>
                    <Col md={10}>
                        {/*zawarto��grupy*/}
                    </Col>
                </Row>
                {/*<TestingBackend />

                 if zalogowany to po lewej lista grup (panel) ktore 'ma' i moze w nie klikac i sie pojawia mozliwosc po prawej stronie dodania postu/komentarza do tej grupy


                 */}
            </div>
        );
    }
}

export default HomePage;
