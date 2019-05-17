import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import UserTable from './Tables/UserTable';
import MyGroupsTable from './Tables/MyGroupsTable';

import DropdownGroup from './Dropdown/DropdownGroup';
import UinGTable from './Tables/UinGTable';
import ModinGTable from './Tables/ModinGTable';


class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: '0',
            raz: true,
            users: [],
            groups: [],
            nazwaGrupy: '',
            groupUsers: [],
            groupUsersMod: []
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
        const login = await axios.post('http://localhost:5000/ReadToken', {
            token: localStorage.getItem('token')
        });
        const users = await axios.post('http://localhost:5000/Uzytkownik/Wyswietl/DanyLogin', {
            login: login.data.user.login
        });
        this.setState({
            users: users.data.wyswietl
        });
    }

    zwrocenieGrup = async () => {
        const id = await axios.post('http://localhost:5000/ReadToken', {
            token: localStorage.getItem('token')
        });
        const groups = await axios.post('http://localhost:5000/Grupa/Wyswietl/DanyLogin', {
            id: id.data.user.id
        });
        console.log(groups);
        this.setState({
            groups: groups.data.wyswietl
        });
    }

    zwrocenieUzytkownikow = async () => {
        const gUsers = await axios.post('http://localhost:5000/Grupa/Wyswietl/DanyLogin/Uzytkownicy', {
            nazwaGrupy: this.state.nazwaGrupy
        });
        this.setState({
            groupUsers: gUsers.data.wyswietl
        }, () => {
            document.getElementsByClassName('crud-table__header-cell')[8].click();
        });
    }

    zwrocenieNazwyGrupy = (Grupa) => {
        this.setState({
            nazwaGrupy: Grupa
        }, () => {
            this.zwrocenieGrup();
            this.zwrocenieUzytkownikow();
            this.zwrocenieUzytkownikowMod();
        });
    }
    zwrocenieUzytkownikowMod = async () => {
        const gUsersMod = await axios.post('http://localhost:5000/Grupa/Wyswietl/DanyLogin/Uzytkownicy/Mod', {
            nazwaGrupy: this.state.nazwaGrupy
        });
        this.setState({
            groupUsersMod: gUsersMod.data.wyswietl
        }, () => {
            document.getElementsByClassName('crud-table__header-cell')[13].click();
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
                            Szczegóły moich grup (Moderator)
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={() => { this.toggle('3'); }}
                        >
                            Użytkownicy/Moderatorzy w moich grupach (Moderator)
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
                                <center><h5><h1>Znajdujesz się w Panelu Użytkownika!</h1><br />W tym miejscu możesz zarządzać swoimi grupami.<br />Wybierz odpowiednią zakładkę u góry strony, aby dokonać zmian.</h5></center>
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
                                <UserTable users={this.state.users} />
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
                                <MyGroupsTable groups={this.state.groups} />
                                <br /><br /><br /><br /><br />
                            </Col>
                            <Col xs={1} md={3} >
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="3">
                        <Row className="show-grid">
                                <Col xs={12} md={12} >
                                <br />
                                <center>
                                    <h4>Wybierz nazwę swojej grupy:</h4>
                                    <DropdownGroup grupa={this.zwrocenieNazwyGrupy} /><br /><br />
                                    </center>
                                </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={1}  >
                            </Col>
                                    <Col xs={5}>                                      
                                        <UinGTable groupUsers={this.state.groupUsers} groupName={this.state.nazwaGrupy} />                                   
                                    </Col>

                                    <Col xs={5}>                               
                                        <ModinGTable groupUsers={this.state.groupUsersMod} groupName={this.state.nazwaGrupy} />                                       
                                    </Col>      
                            <Col xs={1}>
                            </Col>
                            <br /><br /><br /><br /><br />                  
                        </Row>
                    </TabPane>
                </TabContent>
            </div>
        );
    }
}

export default User;
