import React, { Component } from 'react';
//import { Card, /*Button, CardText,*/ CardBody, CardHeader /*, CardTitle*/} from 'reactstrap';
//import axios from 'axios';
//import history from '../history';
import Post from './Post';

class Posts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        }
    }

    componentDidMount() {
        console.log(this.props.posts);
        this.setState({
            posts: this.props.posts
        });
    }

    componentWillReceiveProps(nextProps) {
       if(this.props.posts !== nextProps.posts) {
          this.setState({posts: nextProps.posts});
       }
    }

    render() {
        return (
            <div style={{ "overflow-y": "scroll", "overflow-x": "hidden", "height": "435px", "backgroundColor": "rgba(255,255,255,.8)" }}>
                {this.state.posts.map(post => <Post post={post} />)}
            </div>
        );
    }
}

export default Posts;
