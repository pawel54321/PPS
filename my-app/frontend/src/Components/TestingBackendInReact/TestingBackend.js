import React, { Component } from 'react';
import axios from 'axios';

import Alert from 'react-s-alert';
import { Button, Col, Row } from 'reactstrap';

import TestingBackendShowGroups from './TestingBackendShowGroups';
import TestingBackendShowUsers from './TestingBackendShowUsers';

class TestingBackend extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //123
            dataa: [],
            data2: [],
            data3: [],
            //123

            //4
            nazwa: "",
            opis: "",
            //4
        };

        //4
        this.ZmianaWCzasieRzeczywistynInput = this.ZmianaWCzasieRzeczywistynInput.bind(this);
        //4
    }

    //123
    componentDidMount() {
   
         /*

        fetch('http://localhost:5000/Grupa/Wyswietl')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({ data })
            }
        );


        fetch('http://localhost:5000/Uzytkownik/Wyswietl')
            .then(response => response.json())
            .then(data2 => {
                console.log(data2);
                this.setState({ data2 })
            }
            );

        fetch('http://localhost:5000/Uzytkownik/Wyswietl/DanyLogin')
            .then(response => response.json())
            .then(data3 => {
                console.log(data3);
                this.setState({ data3 })
                }
            );
         
            */

        axios.post('http://localhost:5000/Grupa/Wyswietl')

            .then(dataa => {
                //console.log(response);
               // console.log(dataa.data);
               
                this.setState({ dataa: dataa.data.wyswietl })
                
            })

        axios.post('http://localhost:5000/Uzytkownik/Wyswietl')
            .then(data2 => {
                //console.log(response);
               // console.log(data2.data);
          
                this.setState({ data2: data2.data.wyswietl })
                
            })

 
        axios.post('http://localhost:5000/Uzytkownik/Wyswietl/DanyLogin')
            .then(data3 => {
                //console.log(response);
                //console.log(data3.data);

                this.setState({ data3: data3.data.wyswietl })
                
            })
    }
    //123

  
    //4
    KlikniecieSubmit = async (event) => {
        event.preventDefault();

        const OdpowiedzSerwera = await axios.post('http://localhost:5000/Grupa/Stworz', {
            nazwa: this.state.nazwa,
            opis: this.state.opis
        });

        const OdpowiedzSerwera2 = await axios.post('http://localhost:5000/Grupa/Stworz_Admina', {
            nazwa: this.state.nazwa,
        });

        this.setState({
            nazwa: '',
            opis: '',
        });



        if (OdpowiedzSerwera.data.zwracam_czy_stworzono === true && OdpowiedzSerwera2.data.zwracam_czy_stworzono === true) {
            Alert.success('Poprawnie utworzono grupę!', { position: 'top' });
        }
        else if (OdpowiedzSerwera.data.zwracam_czy_stworzono === false && OdpowiedzSerwera2.data.zwracam_czy_stworzono === false) {
            Alert.error('Podana nazwa grupy istnieje!', { position: 'bottom' });
        }
        else {
            Alert.warning('Coś poszło nie tak!', { position: 'bottom' });
        }
    }

    ZmianaWCzasieRzeczywistynInput(event) {
        const target = event.target;
        const value = target.value;
        const state = { ...this.state }

        state[target.name] = value;

        this.setState(state);
    }
    //4

    render() {


         return (
             <div>

             1<br/>  
                    {this.state.dataa.map(dane => <TestingBackendShowGroups info={dane} />)} { /*ADMIN*/}
             2<br/>  
                    {this.state.data2.map(dane => <TestingBackendShowUsers info={dane} />)} { /*ADMIN*/ }
             3<br/>  
                 {this.state.data3.map(dane => <TestingBackendShowUsers info={dane} />)} { /*JA - KTO JEST TERAZ ZAREJESTROWANY (login)*/}

                 <center>4</center><br />
                 <Row className="show-grid">
                     <Col xs={6} md={5}>
                     </Col>
                     <Col xs={6} md={2} >
                 <form onSubmit={this.KlikniecieSubmit}>
                     <center>
                         <br /> <br /> <br /> <br /> <br />
                         <h5>Stwórz grupe:</h5><br />
                         <label style={{ paddingRight: '140px' }}>Nazwa: </label><br />
                         <input type="text" name="nazwa" value={this.state.nazwa} required onChange={this.ZmianaWCzasieRzeczywistynInput} /><br />
                         <label style={{ paddingRight: '140px' }}>Opis: </label><br />
                         <input type="text" name="opis" value={this.state.opis} required onChange={this.ZmianaWCzasieRzeczywistynInput} /><br /><br />
                                 <Button color="primary">Stwórz!</Button>
                                 <br /><br />
                     </center>
                 </form>
                     </Col>
                     <Col md={5}>
                     </Col>
                 </Row>



                 <br /><br />    <br /><br />    <br /><br />    <br /><br />    <br /><br />    <br /><br />
            </div>
        );
    }
}

export default TestingBackend;
