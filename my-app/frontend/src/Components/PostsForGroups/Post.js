import React, { Component } from 'react';
//import { Card, /*Button, CardText,*/ CardBody, CardHeader /*, CardTitle*/} from 'reactstrap';
//import axios from 'axios';
//import history from '../history';


// RCE CSS
import 'react-chat-elements/dist/main.css';
// MessageBox component
import {
    ChatItem //, MessageBox
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

                {/* <MessageBox
                    position={'left'}
                    type={'photo'}
                    text={'react.svg'}
                    data={{
                        uri: 'user_font_awesome.svg.png',
                        status: {
                            click: false,
                            loading: 0,
                        }
                    }} />*/}
                {/*this.props.post.data*/}
                </div>
        );
    }
}

export default Post;
