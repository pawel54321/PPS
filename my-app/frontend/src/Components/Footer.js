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
    /*
    let a = window.location.pathname;
    console.log(a);
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
  
    else {  */
        // <img src={StronaGlowna} alt="" />
        return (
            <div>
                <Navbar color="light" light expand="md" className="Stopka">
                    <NavbarBrand>Wszelkie prawa zastrzeżone, Copyright ©2019</NavbarBrand>

                </Navbar>
            </div>
        );
   // }
}


export default Footer;
