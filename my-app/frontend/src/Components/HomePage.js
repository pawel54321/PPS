import React, { Component } from 'react';
import TestingBackend from './TestingBackendInReact/TestingBackend';
import { Col, Row } from 'reactstrap';
//import nazwyGrup from './nazwyGrup';

class HomePage extends Component {

    render() {
        return (
            <div>  
                <Row>
                    <Col md={3}>
                        <div style={{ bgColor: 'red' }}>
                            {/*nazwyGrup*/}
                        </div>
                    </Col>
                    <Col md={9}>
                        {/*zawartoœægrupy*/}
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
