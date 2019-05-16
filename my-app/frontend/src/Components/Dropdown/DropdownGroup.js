import React, { Component } from 'react';
import axios from 'axios';

export default class DropdownGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            daneGrupy: [],
            Grupa: ''
        };

        this.handleChange = this.handleChange.bind(this);

        this.ZwrocenieTabeliGrupa();
    }

    ZwrocenieTabeliGrupa = async () => {

        const id = await axios.post('http://localhost:5000/ReadToken', {
            token: localStorage.getItem('token')
        });
        const groups = await axios.post('http://localhost:5000/Grupa/Wyswietl/DanyLogin', {
            id: id.data.user.id
        });
        console.log(groups);
        this.setState({
            daneGrupy: groups.data.wyswietl
        });
    }

    handleChange(event) {
        this.props.grupa(event.target.value);
        this.setState({
            Grupa: event.target.value
        });
    }

    render() {
        let grupy = this.state.daneGrupy.map(grupa => {
            return (
                <option id={grupa.id}>{grupa.nazwa}</option>
            )
        });

        return (
            <select value={this.state.Grupa} onChange={this.handleChange}>
                <option>-</option>
                {grupy}
            </select>
        );
    }
}