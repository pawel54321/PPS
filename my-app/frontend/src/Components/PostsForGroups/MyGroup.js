import React, { Component } from 'react';
//import axios from 'axios';
//import Alert from 'react-s-alert';
import { Button, Col, Row, TabContent, ListGroupItem } from 'reactstrap';

class ListGroups extends Component {

    constructor(props) {
        super(props);
        this.KlikniecieSubmit = this.KlikniecieSubmit.bind(this);
    }

    KlikniecieSubmit = (event) => {
        event.preventDefault();
        this.props.grupa(this.props.info.nazwa);
    }

    render() {
        return (
            <ListGroupItem className={this.props.info.nazwa}>
                <TabContent>
                    <Row className="show-grid">
                        <Col xs={1}  >
                        </Col>
                        <Col xs={10}>
                                <center>
                                    <Button onClick={this.KlikniecieSubmit} color="link">{this.props.info.nazwa}</Button>
                                </center>
                        </Col>
                        <Col xs={1}>
                        </Col>
                    </Row>
                </TabContent>
            </ListGroupItem>
        );
    }
}

export default ListGroups;
