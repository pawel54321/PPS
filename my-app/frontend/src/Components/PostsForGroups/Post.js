import React, { Component } from 'react';
//import { Card, /*Button, CardText,*/ CardBody, CardHeader /*, CardTitle*/} from 'reactstrap';
//import axios from 'axios';
//import history from '../history';


// RCE CSS
import 'react-chat-elements/dist/main.css';
// MessageBox component
import { ChatItem  } from 'react-chat-elements';

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
        //this.handleClick = this.handleClick.bind(this);
    }

    render() {
        return (
           <div>
                {/*            <Card style={{marginBottom: '20px', boxShadow: '0 .5rem 1rem rgba(0,0,0,.15)'}}>
                <CardHeader className='text-center' style={{backgroundColor: '#ddd'}}><b><i>*/}{/*this.props.atrakcja.nazwa*/}
                {/*</i></b ></CardHeader >
                <CardBody className='text-center'>*/}
                    <ChatItem
                        avatar={'https://facebook.github.io/react/img/logo.svg'}
                        alt={'Reactjs'}
                        title={'Facebook'}
                        subtitle={'What are you doing?'}
                        date={new Date()}
                        unread={0} />
                    <ChatItem
                        avatar={'https://facebook.github.io/react/img/logo.svg'}
                        alt={'Reactjs'}
                        title={'Facebook'}
                        subtitle={'What are you doing?'}
                        date={new Date()}
                        unread={0} />
                    <ChatItem
                        avatar={'https://facebook.github.io/react/img/logo.svg'}
                        alt={'Reactjs'}
                        title={'Facebook'}
                        subtitle={'What are you doing?'}
                        date={new Date()}
                        unread={0} />
                    <ChatItem
                        avatar={'https://facebook.github.io/react/img/logo.svg'}
                        alt={'Reactjs'}
                        title={'Facebook'}
                        subtitle={'What are you doing?'}
                        date={new Date()}
                        unread={0} />
                    <ChatItem
                        avatar={'https://facebook.github.io/react/img/logo.svg'}
                        alt={'Reactjs'}
                        title={'Facebook'}
                        subtitle={'What are you doing?'}
                        date={new Date()}
                        unread={0} />
                    <ChatItem
                        avatar={'https://facebook.github.io/react/img/logo.svg'}
                        alt={'Reactjs'}
                        title={'Facebook'}
                        subtitle={'What are you doing?'}
                        date={new Date()}
                        unread={0} />
                    <ChatItem
                        avatar={'https://facebook.github.io/react/img/logo.svg'}
                        alt={'Reactjs'}
                        title={'Facebook'}
                        subtitle={'What are you doing?'}
                        date={new Date()}
                        unread={0} />
                    <ChatItem
                        avatar={'https://facebook.github.io/react/img/logo.svg'}
                        alt={'Reactjs'}
                        title={'Facebook'}
                        subtitle={'What are you doing?'}
                        date={new Date()}
                        unread={0} />
                    <ChatItem
                        avatar={'https://facebook.github.io/react/img/logo.svg'}
                        alt={'Reactjs'}
                        title={'Facebook'}
                        subtitle={'What are you doing?'}
                        date={new Date()}
                        unread={0} />

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
