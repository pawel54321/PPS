import React, { Component } from 'react';
//import { Card, /*Button, CardText,*/ CardBody, CardHeader /*, CardTitle*/} from 'reactstrap';
//import axios from 'axios';
//import history from '../history';


// RCE CSS
import 'react-chat-elements/dist/main.css';
// MessageBox component
import {
    ChatItem//, MessageBox
} from 'react-chat-elements';
//import Alert from 'react-s-alert';

import Av from './User_font_awesome.svg.png';

class Post extends Component {
    /*
    constructor(props) {
        super(props);
    }
    */

    componentDidMount() {

        // pobierz ile ma lajkow kazdy post dla Cb i ustaw
    }

    dodaj = async (event) => {
        event.preventDefault();
/*
        if (this.state.likes === 0) {
            Alert.info('Polubiono post!', { position: 'bottom' });
            this.setState(
                {
                    likes: 1
                })
        }
        else {
            Alert.error('Ten post został już polubiony!', { position: 'bottom' });
        }
*/
    }

    render() {
        return (
            <div>
                <ChatItem
                
                avatar={Av}
                alt={'Komentarz'}
                title={this.props.post.login}
                subtitle={this.props.post.zawartosc}
                date={new Date(this.props.post.data)}
                unread={/*this.state.likes*/0}
                onClick={this.dodaj}
                />

                
                {this.props.post.zalacznik ? <img alt="obrazek" height="100px" src={this.props.post.zalacznik} /> : <div></div>}

                {/*  <img alt="" height="100%" width="100%" src="C:/Projekt PPS/PPS/my-app/frontend/b.jpg"></img>*/}

                {/*<MessageBox
                    position={'right'}
                    type={'photo'}
                    text={this.props.post.zalacznik}
                    data={{
                        uri: "C:/Projekt PPS/PPS/my-app/backend/Upload/b.jpg",
                        status: {
                            click: true//,
                           //loading: 100,
                        }
                    }} />*/}
                {/*this.props.post.data*/}
                </div>
        );
    }
}

export default Post;
