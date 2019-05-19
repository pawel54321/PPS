import React, { Component } from 'react';
//import { Card, /*Button, CardText,*/ CardBody, CardHeader /*, CardTitle*/} from 'reactstrap';
//import axios from 'axios';
//import history from '../history';


// RCE CSS
import 'react-chat-elements/dist/main.css';
// MessageBox component
import { ChatItem } from 'react-chat-elements';
import Alert from 'react-s-alert';

import Av from './User_font_awesome.svg.png';

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {

            likes: 0
        }
        //this.handleClick = this.handleClick.bind(this);
    }

    dodaj = async (event) => {
        event.preventDefault();

        this.setState(
            {
                likes: this.state.likes + 1
            }) 

        Alert.info('Polubiono post!', { position: 'bottom' });
    }

    render() {
        return (

            <div style={{ "overflow-y": "scroll", "overflow-x": "hidden", "height": "450px" }}>
              
                    {/*            <Card style={{marginBottom: '20px', boxShadow: '0 .5rem 1rem rgba(0,0,0,.15)'}}>
                <CardHeader className='text-center' style={{backgroundColor: '#ddd'}}><b><i>*/}{/*this.props.atrakcja.nazwa*/}
                    {/*</i></b ></CardHeader >
                <CardBody className='text-center'>*/}

           
                    <ChatItem
                    avatar={Av}
                    alt={'Komentarz'}
                    title={'Login'}
                    subtitle={'Tekst'}
                    date={new Date(2019, 1, 1, 10, 20, 20)}
                    unread={this.state.likes}
                    onClick={this.dodaj}

                    />
                <ChatItem
                    avatar={Av}
                    alt={'Komentarz'}
                    title={'Login'}
                    subtitle={'Tekst'}
                    date={new Date(2019, 1, 1, 10, 20, 20)}
                    unread={this.state.likes}
                    onClick={this.dodaj}

                />
                <ChatItem
                    avatar={Av}
                    alt={'Komentarz'}
                    title={'Login'}
                    subtitle={'Tekst'}
                    date={new Date(2019, 1, 1, 10, 20, 20)}
                    unread={this.state.likes}
                    onClick={this.dodaj}

                />
                <ChatItem
                    avatar={Av}
                    alt={'Komentarz'}
                    title={'Login'}
                    subtitle={'Tekst'}
                    date={new Date(2019, 1, 1, 10, 20, 20)}
                    unread={this.state.likes}
                    onClick={this.dodaj}

                />
                <ChatItem
                    avatar={Av}
                    alt={'Komentarz'}
                    title={'Login'}
                    subtitle={'Tekst'}
                    date={new Date(2019, 1, 1, 10, 20, 20)}
                    unread={this.state.likes}
                    onClick={this.dodaj}

                />
                <ChatItem
                    avatar={Av}
                    alt={'Komentarz'}
                    title={'Login'}
                    subtitle={'Tekst'}
                    date={new Date(2019, 1, 1, 10, 20, 20)}
                    unread={this.state.likes}
                    onClick={this.dodaj}

                />
                <ChatItem
                    avatar={Av}
                    alt={'Komentarz'}
                    title={'Login'}
                    subtitle={'Tekst'}
                    date={new Date(2019, 1, 1, 10, 20, 20)}
                    unread={this.state.likes}
                    onClick={this.dodaj}

                />
                <ChatItem
                    avatar={Av}
                    alt={'Komentarz'}
                    title={'Login'}
                    subtitle={'Tekst'}
                    date={new Date(2019, 1, 1, 10, 20, 20)}
                    unread={this.state.likes}
                    onClick={this.dodaj}

                />

                    {/*     </CardBody>
            </Card >*/}

                    {/*<CardText>{this.props.text}</CardText>
                    <CardText><b>Godz. otwarcia:</b> {this.props.atrakcja.godzina_otwarcia}</CardText>
                    <CardText><b>Godz. zamknięcia:</b> {this.props.atrakcja.godzina_zamkniecia}</CardText>
                    <CardTitle><b>Cena: </b> {this.props.atrakcja.cena}</CardTitle>
                    <Button color='primary' onClick={this.handleClick}>Wybierz</Button>*/}
                </div>
       
        );
    }
}

export default Post;
