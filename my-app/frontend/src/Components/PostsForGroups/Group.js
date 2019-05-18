import React, { Component } from 'react';
import Post from './Post';
import {Row, Col} from 'reactstrap';

class Group extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posty: [],
            grupa: ''
        }
    }

    render() {
        let posty = this.state.posty.map(post => {
            return (
                <Col xl='4' lg='6' xs='12'>
                    <Post post = {post} />
                </Col>
            )
        });
        return (
            <div>
                <Col sm='12' md={{ size: 6, offset: 3 }}>
                    <Row>
                        {posty}
                    </Row>
                </Col>
            </div>
        );
    }
}

export default Group;
