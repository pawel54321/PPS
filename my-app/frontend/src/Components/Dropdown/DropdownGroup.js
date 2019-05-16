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
        const OdpowiedzSerwera = await axios.post('http://localhost:5000/Grupa/Wyswietl');

        //prompt(JSON.stringify(OdpowiedzSerwera5.data.daneMiejscowosc));
        this.setState({
            daneGrupy: OdpowiedzSerwera.data.wyswietl,
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