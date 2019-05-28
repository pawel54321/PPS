import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import UsersTable from './Tables/UsersTable';
import GroupsTable from './Tables/GroupsTable';
import UserTable from './Tables/UserTable';

class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: '0',
            raz: true,
            users: [],
            groups: [],
            user: []//,
           // nazwaGrupy: '',
            //groupUsers: []
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

    /*
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
        });
    }
    */


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
                            Wszyscy użytkownicy (Administrator)
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={() => { this.toggle('3'); }}
                        >
                             Szczegóły wszystkich grup (Administrator)
                        </NavLink>
                    </NavItem>
                    
                    {/*<NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '4' })}
                            onClick={() => { this.toggle('4'); }}
                        >
                            Użytkownicy we wszystkich grupach (Administrator)
                        </NavLink>
                    </NavItem>*/}
                </Nav>

                <TabContent activeTab={this.state.activeTab} className={"admin"}>
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
                    <TabPane tabId="4">
                        <Row className="show-grid">
                            <Col xs={1} md={3} >
                            </Col>
                            <Col xs={10} md={6} >
                                <br />
                                <center>
                                    {/*   <DropdownGroup grupa={this.zwrocenieNazwyGrupy} /><br /><br />
                                    <UinGTable groupUsers={this.state.groupUsers} groupName={this.state.nazwaGrupy} />*/}
                                    [ADMIN, MODERATOR GRUPY DANEJ GRUPY]
                                    <h4>Wybierz użytkownika:</h4> [ DLA MODA TO POMIJA SIĘ - WIDZI SIEBIE]
                                   .. kazdego + siebie tez w sumie mozna wyswietlic + kolumne z flagami + wyswetlam tych zbanowanych tez

                                    <h4>Wybierz grupe:</h4>
                                     ... wyswietlam nazwe grupy gdzie jest modem w dropdown +  tabela gdzie jestem userem dolaczylem do grupy - gdzie jestem - tylko select ....

                                    <h4>Użytkownicy w grupie:</h4>

                                  ... 2 tabele obok siebie pokazuje modów obok wszystkich userow pozostalych ... (funkcjonalnosc ustawienia innego moderatora z grupy kiedy zablokuje moda) ...
                                  ....  przy userach w tabeli "Nadaj Prawo Moderatora".... ( dla pozostałych)
                                  ... przy modach nic....

                                  ????  POMYSL JAKIS ZEBY ZROBIC NADAWANIE PRAWA INNEMU USEROWI Z DANEJ GRUPY JESLI ZBANUJE MODA ?????? - ZA DUZO ROBOTY TROCHE
                                </center>
                                <br /><br /><br /><br /><br />
                            </Col>
                            <Col xs={1} md={3} >
                            </Col>
                        </Row>
                    </TabPane>
                    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                </TabContent>
            </div>
        );
    }
}

export default Admin;
