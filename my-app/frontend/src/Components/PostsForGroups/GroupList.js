import React, { Component } from 'react';
import {
    Col, Row, //TabContent, 
    ListGroup//, NavLink, ListGroupItem
} from 'reactstrap';
import MyGroup from './MyGroup';
import axios from 'axios';

class GroupList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            grupa: ''
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

    grupa = (nazwa) => {
        this.setState({
            grupa: nazwa
        }, () => {
            this.props.grupa(this.state.grupa);
        });
    }

    render() {
        return (
            <div>
                <Row>
                    <Col xs={12} style={{ padding:0 }}>
                        <br />
                        <center><b>Moje grupy</b></center>
                        <br />

                        <div style={{ "overflow-y": "scroll", "overflow-x": "hidden", "height": "484px", "backgroundColor": "rgba(255,255,255,.8)", padding:"0px" }}>
                            <ListGroup>
                                {this.state.groups.map(dane => <MyGroup info={dane} grupa={this.grupa}/>)}
                            </ListGroup>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default GroupList;

//style={{ "overflow-y": "scroll", "overflow-x": "hidden", "height": "450px", "backgroundColor": "rgba(255,255,255,.8)" }}