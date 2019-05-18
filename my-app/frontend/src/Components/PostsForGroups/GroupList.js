import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

class GroupList extends Component {

    constructor(props) {
        super(props);
        this.state ={
            groups: [],
            user: null
        }
    }



    render() {
        return (
            <ListGroup>
                <ListGroupItem></ListGroupItem>
            </ListGroup>
        );
    }
}

export default GroupList;
