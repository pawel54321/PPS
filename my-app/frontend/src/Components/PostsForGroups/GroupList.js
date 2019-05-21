import React, { Component } from 'react';
import {Col, Row, TabContent, ListGroup, NavLink, ListGroupItem } from 'reactstrap';
import MyGroup from './MyGroup';
import axios from 'axios';

class GroupList extends Component {

    constructor(props) {
        super(props);
        this.state ={
            groups: [],
            user: null
        }
        this.zwrocenieGrup();
    }

    zwrocenieGrup = async () => {
        const token = await axios.post('http://localhost:5000/ReadToken', {
            token: localStorage.getItem('token')
        });
        const groups = await axios.post('http://localhost:5000/Grupa/Wyswietl/DanyLogin/User', {
            id: token.data.user.id
        });
        //console.log(groups);
        this.setState({
            groups: groups.data.wyswietl
        });
    }

    render() {
        return (
            <div>
                <br />
                <center><b>Moje grupy</b></center>
                <br />
                <div style={{ "overflow-y": "auto", "overflow-x": "hidden", "height": "700px", "scrollbar-width": "none" }}>
                    <ListGroup>
                        {this.state.groups.map(dane => <MyGroup info={dane} />)}
                    </ListGroup>
                </div>
            </div>
        );
    }
}

export default GroupList;
