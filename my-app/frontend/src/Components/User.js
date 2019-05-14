import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import UsersTable from './UsersTable';
import GroupsTable from './GroupsTable';

import CreateGroup from './CreateGroup';

class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: '0',
            raz: true,
            users: [],
            groups: []
        };
        this.toggle = this.toggle.bind(this);
        this.zwrocenieSiebie();
        this.zwrocenieGrup();
    }

    toggle(tab) {
        if (this.state.raz === true) {
            document.getElementsByClassName('crud-table__header-cell')[0].click();
            document.getElementsByClassName('crud-table__header-cell')[5].click();
        }

        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
                raz: false
            });
        }
    }

    zwrocenieSiebie = async () => {
        const users = await axios.post('http://localhost:5000/Uzytkownik/Wyswietl/DanyLogin');
        this.setState({
            users: users.data.wyswietl
        });
    }

    zwrocenieGrup = async () => {
        const groups = await axios.post('http://localhost:5000/Grupa/Wyswietl');
        this.setState({
            groups: groups.data.wyswietl
        });
    }

    render() {
        return (
            <div>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}
                        >
                            U¿ytkownicy
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                        >
                            Grupy
                        </NavLink>
                    </NavItem>
                </Nav>

                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="0">
                        <Row>
                            <Col xs={6} md={3} >
                            </Col>
                            <Col xs={6} md={6} >
                                <br /><br /><br /><br /><br /><br /><br /><br />
                                <center><h5><h1>Znajdujesz siê w Panelu U¿ytkownika!</h1><br />W tym miejscu mo¿esz zarz¹dzaæ systemem.<br />Wybierz odpowiedni¹ zak³adkê u góry strony, aby dokonaæ zmian w systemie.</h5></center>
                            </Col>
                            <Col xs={6} md={3} >
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="1">
                        <Row className="show-grid">
                            <Col xs={1} md={3} >
                            </Col>
                            <Col xs={10} md={6} >
                                <br />
                                <UsersTable users={this.state.users} />
                                <br /><br /><br /><br /><br />
                            </Col>
                            <Col xs={1} md={3} >
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row className="show-grid">
                            <Col xs={1} md={3} >
                            </Col>
                            <Col xs={10} md={6} >
                                <br />
                                <GroupsTable groups={this.state.groups} />
                                <br /><br /><br /><br /><br />
                            </Col>
                            <Col xs={1} md={3} >
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </div>
        );
    }
}

export default User;
