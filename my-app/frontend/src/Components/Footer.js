import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand} from 'reactstrap';

const Footer = () => (
    <div className="App-footer">
        <footer>
            <SprawdzFooter />
        </footer>
    </div>
);

const SprawdzFooter = () => {

    var a = window.location.pathname;

    if (a !== "/") {
        // <Link to="/"><img src={WrocdoStronyGlownej} alt="" /></Link>
        return (
            <div>
                <Navbar color="light" light expand="md" className="Stopka">
                    <NavbarBrand><Link to="/">Wróć do Strony Głównej</Link></NavbarBrand>

                </Navbar>
            </div>
        );
    }
    else {
        // <img src={StronaGlowna} alt="" />
        return (
            <div>
                <Navbar color="light" light expand="md" className="Stopka">
                <NavbarBrand>Znajdujesz się na Stronie Głównej</NavbarBrand>

                </Navbar>
            </div>
        );
    }
}


export default Footer;
