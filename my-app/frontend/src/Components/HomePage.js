import React, { Component } from 'react';
import { Col, Row, Input, Button} from 'reactstrap';
import GroupList from './PostsForGroups/GroupList';
import Posts from './PostsForGroups/Posts';
import Alert from 'react-s-alert';
//import { Input } from 'react-chat-elements';
//import { Button } from 'react-chat-elements'
import axios from 'axios';
import { Link } from 'react-router-dom';
//import { read } from 'fs';

class HomePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            token: null,
            posts: [],
            grupa: '',
            danePliku:''
        }
    }

    componentDidMount() {
        this.zwrocenieCzyZalogowany();
    }

    zwrocenieCzyZalogowany = async () => {
        const token = await axios.post('http://localhost:5000/ReadToken', {
            token: localStorage.getItem('token')
        });

        this.setState({
            token: token
        });
    }

    zwroceniePostow = async () => {
        const posts = await axios.post('http://localhost:5000/Post/Wyswietl/Grupa', {
            grupa: this.state.grupa
        });
        this.setState({
            posts: posts.data.wyswietl
        });

        console.log(posts.data.wyswietl);
    }

    KlikniecieSubmit = async (event) => {
        event.preventDefault();

       

        if (this.state.grupa === "") {
            Alert.info('Proszę wybrać grupę!', { position: 'bottom' });
            return;
        }

        if (document.getElementsByName("zawartosc")[0].value === "") {
            Alert.error('Pole nie może być puste!', { position: 'bottom' });
            return;
        }


        if (this.state.danePliku !== "") {

            console.log(this.state.danePliku);
            // wrzucanie pliku (dane i plik)

        }
        
        const OdpowiedzSerwera2 = await axios.post('http://localhost:5000/Post/Stworz', {
            id_uzytkownik: this.state.token.data.user.id,
            grupa: this.state.grupa,
            zawartosc: document.getElementsByName("zawartosc")[0].value,
            data: new Date() 
        });


        if (OdpowiedzSerwera2.data.zwracam_czy_stworzono === true) {
            Alert.success('Wiadomość została wysłana!', { position: 'bottom' });
            document.getElementsByName("zawartosc")[0].value = "";
            this.zwroceniePostow();
             // + zwrocenie plików (dane i plik)
        }
        else if (OdpowiedzSerwera2.data.zwracam_czy_stworzono === false) {
            Alert.error('Wystąpił błąd podczas wysyłania wiadomości!', { position: 'bottom' });
        }

 
        //this.refs.input.clear();
    }

    nazwaGrupy = (grupa) => {
        this.setState({
            grupa: grupa
        }, () => {
            this.zwroceniePostow();
        });
    }


    onChange (event) {
        let files = event.target.files;

        let reader = new FileReader();
        reader.readAsDataURL(files[0]);

        reader.onload = (event) => {

            this.setState({
                danePliku: event.target.result
            });
        }
    }


    render() {

        if (!this.state.token) {

            return (
                <div className={"chat"}>
                    <br />
                    <Col sm='12' md={{ size: 12, offset: 0 }}>
                        <Row>

                            <p style={{ textAlign: 'center', width: '100%', color: "black" }}> <h4 >
                                <br /> <br /> <br /> <br /> <br />
                                <h1>Witamy!</h1><br />
                                Do prawidłowego korzystania z serwisu wymagane jest posiadanie konta!<br />
                                Zarejestruj się, klikając w odpowiedni przycisk w panelu nawigacyjnym lub <Link to="/register">Tutaj</Link>.<br /><br />
                                <h3>Dziękujemy za korzystanie z serwisu i życzymy udanych integracji!</h3></h4></p>
                        </Row>
                    </Col>
                   <br /> <br /><br /> <br /> <br /> <br /> <br /><br /> <br /> <br />
                </div>
            );

        }
        else
        {


            return (
                <div className={"chat"}>

                    <Row>
                        <Col md={3} style={{ padding: "0px" }}>
                            <GroupList grupa={this.nazwaGrupy}/>
                        </Col>
                        <Col md={9} style={{ padding:"0px" }}>
                            {/*zawartość grupy*/}
                            <br />
                            <center><b>{this.state.grupa ? 'Wybrałeś grupę: '+this.state.grupa : 'Aby wyświetlić posty należy wybrać grupę!'}</b></center>
                            <br />
                            <Posts posts={this.state.posts}/>

                            <form onSubmit={this.KlikniecieSubmit}>
                                <Row style={{ paddingLeft: "14px" }}>
                                    <Col md={11} style={{ padding: "0px" }}>
                                        <Input type="text" name="zawartosc" placeholder="Skomentuj..." />
                                        <Input type="file" name="plik" onChange={(e) => this.onChange(e)} />
                                    </Col>
                                    <Col md={1} style={{ padding: "0px" }}>
                                        <Button color="primary">Wyślij!</Button>
                                    </Col>
                                 </Row>  
                            </form>
                            

                            {/* emitonki*/}
                        </Col>
                    </Row>
                    {/*
                 jesli zalogowany to po lewej lista grup (panel) ktore 'ma' i moze w nie klikac i sie pojawia mozliwosc po prawej stronie dodania postu/komentarza do tej grupy
                 */}
                   
                </div>
            );
        }
    }
}

export default HomePage;
