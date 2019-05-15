import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import UsersTable from './UsersTable';
import GroupsTable from './GroupsTable';
import UserTable from './UserTable';

class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: '0',
            raz: true,
            users: [],
            groups: [],
            user: []
        };
        this.toggle = this.toggle.bind(this);
        this.zwrocenieUzytkownikow();
        this.zwrocenieGrup();
        this.zwrocenieSiebie();
    }

    toggle(tab) {
        if(this.state.raz === true) {
            document.getElementsByClassName('crud-table__header-cell')[0].click();
            document.getElementsByClassName('crud-table__header-cell')[5].click();
            document.getElementsByClassName('crud-table__header-cell')[10].click();
        }

        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
                raz: false
            });
        }
    }

    zwrocenieUzytkownikow = async () => {
        const users = await axios.post('http://localhost:5000/Uzytkownik/Wyswietl');
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

    zwrocenieSiebie = async () => {
        const login = await axios.post('http://localhost:5000/ReadToken', {
            token: localStorage.getItem('token')
        });
        const user = await axios.post('http://localhost:5000/Uzytkownik/Wyswietl/DanyLogin', {
            login: login.data.user.login
        });
        this.setState({
            user: user.data.wyswietl
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
                            Profil
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                        >
                            Wszyscy użytkownicy
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={() => { this.toggle('3'); }}
                        >
                            Wszystkie grupy
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
                                <center><h5><h1>Znajdujesz się w Panelu Administratora!</h1><br />W tym miejscu możesz zarządzać swoim systemem.<br />Wybierz odpowiednią zakładkę u góry strony, aby dokonać zmian w systemie.</h5></center>
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
                                <UserTable users={this.state.user} />
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
                                <UsersTable users={this.state.users} />
                                <br /><br /><br /><br /><br />
                            </Col>
                            <Col xs={1} md={3} >
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="3">
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

export default Admin;
