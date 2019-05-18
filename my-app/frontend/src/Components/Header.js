import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, //NavbarToggler,
    Collapse, Nav, NavItem, NavLink, Button } from 'reactstrap';


import history from '../history';
import InvitationsComponent from './Invitations/InvitationsComponent';

//import InvitationsComponent from './Invitations/InvitationsComponent';

const ROLES = {
    ADMIN: 'Admin',
    USER: 'User'
}

function Wylogowanie() {
    // this.preventDefault(); //Potrzebne-?? Odswieza-?? - nie powinno odswiezac, ale odswieza
    localStorage.removeItem('token');
   //  this.props.onLoggedUserChange2('');
    //????
    //Alert.success('Pomyślnie wylogowano!', { position: 'top' });
    //????
    history.push('/');
    window.location.reload();
    //this.ROLES.reload();
}


function Visible(props) {

    if (props.rola === ROLES.USER) {

        //<Link to="/uzytkownik"><img src={PanelUzytkownika} alt="" /></Link>

        //<Link to="/" onClick={Wylogowanie}><img src={Wyloguj} alt="" /></Link>

        return (

            <nav>
                <header className="App-header">

                    <Navbar color="light" light expand="md">
                        <NavbarBrand><Link to="/"><i className="fa fa-home" style={{ fontSize: '50px', color: 'light' }} /></Link></NavbarBrand>
                        {/*<NavbarToggler />*/}
                        <Collapse Collapse isOpen={true} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink><Link onClick={InvitationsComponent.prototype.KlikniecieSubmitZaproszenia}><i className="fa fa-bell" /> Zaproszenia</Link></NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink><Link to="/user"><i className="fa fa-user" /> Panel Użytkownika</Link></NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink> <Link to="/" onClick={Wylogowanie}><i className="fa fa-power-off" /> Wyloguj</Link></NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>

                </header>
            </nav>);
    }
    else if (props.rola === ROLES.ADMIN) {
        return (
            <nav>
                <header className="App-header">

                    <Navbar color="light" light expand="md">
                        <NavbarBrand><Link to="/"><i className="fa fa-home" style={{ fontSize: '50px', color: 'light' }} /></Link></NavbarBrand>
                        {/*<NavbarToggler />*/}
                        <Collapse Collapse isOpen={true} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink><Link onClick={InvitationsComponent.prototype.KlikniecieSubmitZaproszenia}><i className="fa fa-bell" /> Zaproszenia</Link></NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink><Link to="/admin"><i className="fa fa-user-secret" /> Panel Admina</Link></NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink> <Link to="/" onClick={Wylogowanie}><i className="fa fa-power-off" /> Wyloguj</Link></NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>

                </header>
            </nav>
        );
    }
    else {
        return (
            <nav>
                <header className="App-header">

                    <Navbar color="light" light expand="md">
                        <NavbarBrand><Link to="/"><i className="fa fa-home" style={{ fontSize: '50px', color: 'light' }} /></Link></NavbarBrand>
                        {/*<NavbarToggler />*/}
                        <Collapse Collapse isOpen={true} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink><Link to="/login"><i className="fa fa-user-circle-o" /> Logowanie</Link></NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink><Link to="/register"><i className="fa fa-users" /> Rejestracja</Link></NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>
                </header>
            </nav>
        );
    }

}
const Header = (props) => (

    Visible(props)
);
export default Header;






