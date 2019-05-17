import React, { Component } from 'react';
import { render } from 'react-dom';
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

class InvitationsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isPaneOpenLeft: false
        };
    }
    componentDidMount() {
        Modal.setAppElement(this.el);
    
        this.setState({
            isPaneOpenLeft: this.props.info
        });
    }
    
    render() {
        return <div ref={ref => this.el = ref}>         
        
            <SlidingPane
                isOpen={this.state.isPaneOpenLeft}
                title='Zarządzanie zaproszeniami'
                from='left'
                width='370px'
                onRequestClose={() => this.setState({ isPaneOpenLeft: false })}>
                <center>Wysłane zaproszenia:</center>
                <br/>

                <center>Oczekujące zaproszenia:</center>

                <br />
            </SlidingPane>
        </div>;
    }
}

export default InvitationsComponent;
