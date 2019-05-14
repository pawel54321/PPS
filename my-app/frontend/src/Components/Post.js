import React, { Component } from 'react';
import { Card, Button, CardText, CardBody, CardHeader, CardTitle} from 'reactstrap';
//import axios from 'axios';
//import history from '../history';

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
        //this.handleClick = this.handleClick.bind(this);
    }

    render() {
        return (
            <Card style={{marginBottom: '20px', boxShadow: '0 .5rem 1rem rgba(0,0,0,.15)'}}>
                <CardHeader className='text-center' style={{backgroundColor: '#ddd'}}><b><i>{/*this.props.atrakcja.nazwa*/}</i></b></CardHeader>
                <CardBody className='text-center'>
                    {/*<CardText>{this.props.text}</CardText>
                    <CardText><b>Godz. otwarcia:</b> {this.props.atrakcja.godzina_otwarcia}</CardText>
                    <CardText><b>Godz. zamknięcia:</b> {this.props.atrakcja.godzina_zamkniecia}</CardText>
                    <CardTitle><b>Cena: </b> {this.props.atrakcja.cena}</CardTitle>
                    <Button color='primary' onClick={this.handleClick}>Wybierz</Button>*/}
                </CardBody>
            </Card>
        );
    }
}

export default Post;
