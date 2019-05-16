import React from 'react';
import CRUDTable, {
    Fields,
    Field,
    UpdateForm
} from 'react-crud-table';
import axios from 'axios';
import './style.css';
import Alert from 'react-s-alert';

let tasks = [];

const SORTERS = {
    NUMBER_ASCENDING: mapper => (a, b) => mapper(a) - mapper(b),
    NUMBER_DESCENDING: mapper => (a, b) => mapper(b) - mapper(a),
    STRING_ASCENDING: mapper => (a, b) => mapper(a).localeCompare(mapper(b)),
    STRING_DESCENDING: mapper => (a, b) => mapper(b).localeCompare(mapper(a)),
};

const getSorter = (data) => {
    const mapper = x => x[data.field];
    let sorter = SORTERS.STRING_ASCENDING(mapper);

    if (data.field === 'id') {
        sorter = data.direction === 'ascending' ?
            SORTERS.NUMBER_ASCENDING(mapper) : SORTERS.NUMBER_DESCENDING(mapper);
    } else {
        sorter = data.direction === 'ascending' ?
            SORTERS.STRING_ASCENDING(mapper) : SORTERS.STRING_DESCENDING(mapper);
    }

    return sorter;
};


const service = {
    fetchItems: (payload) => {
        let result = Array.from(tasks);
        result = result.sort(getSorter(payload.sort));
        return Promise.resolve(result);
    },

    update: (data) => {
        const task = tasks.find(t => t.id === data.id);

        task.imie = data.imie;
        task.nazwisko = data.nazwisko;
        task.haslo = data.haslo;

        //console.log(task.kraj);


        axios.post('http://localhost:5000/ReadToken', {
            token: localStorage.getItem('token')
        });

       axios.post('http://localhost:5000/Uzytkownik/Zaaktulizuj/DanyLogin', {
            id: task.id,
            imie: task.imie,
            nazwisko: task.nazwisko,
            /*haslo: task.haslo*/
        });


        Alert.success('Poprawnie zaktualizowano profil!', { position: 'top' });


        return Promise.resolve(task);
    },

};

const styles = {
    container: {},
};

function Ustaw(props) {
    tasks = props.users;
}

const UsersTable = (props) => (

    <div style={styles.container}>
        {Ustaw(props)}

        <CRUDTable style={{ width: '100%' }}
            caption="Dane profilu"
            actionsLabel="Akcje"
            fetchItems={payload => service.fetchItems(payload)}
        >
            <Fields>
                <Field hideInUpdateForm
                    name="id"
                    label="Id"
                />
                <Field hideInUpdateForm
                    name="login"
                    label="Login"
                />
                <Field
                    name="imie"
                    label="Imię"
                />
                <Field
                    name="nazwisko"
                    label="Nazwisko"
                />
            </Fields>

            <UpdateForm
                title="Zaktualizuj dane profilu"
                message="Aktualizacja profilu"
                trigger="Zaktualizuj"
                onSubmit={task => service.update(task)}
                submitText="Zaktualizuj"
                validate={(values) => {
                    const errors = {};

                    if (!values.imie) {
                        errors.imie = 'Proszę wypełnić podane pole!';
                    }

                    if (!values.nazwisko) {
                        errors.nazwisko = 'Proszę wypełnić podane pole!';
                    }

                    return errors;
                }}
            />

        </CRUDTable>
    </div>
);

UsersTable.propTypes = {};

export default UsersTable;
