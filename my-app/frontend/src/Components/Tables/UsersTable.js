import React from 'react';
import CRUDTable, {
    Fields,
    Field,
    DeleteForm,
    Pagination
} from 'react-crud-table';
import axios from 'axios';
import './style.css';

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
        const { activePage, itemsPerPage } = payload.pagination;
        const start = (activePage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        let result = Array.from(tasks);
        result = result.sort(getSorter(payload.sort));
        return Promise.resolve(result.slice(start, end));
    },
    fetchTotal: payload => {
        return Promise.resolve(tasks.length);
    },
    delete: (data) => {
        const task = tasks.find(t => t.id === data.id);
        axios.post('http://localhost:5000/Uzytkownik/Zablokuj_Uzytkownika', { // DODAĆ USUWANIE, KIEDY BĘDZIE W BACKENDZIE
            id: data.id
        });

        tasks = tasks.filter(t => t.id !== task.id);

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
            caption="Użytkownicy"
            actionsLabel="Akcje"
            fetchItems={payload => service.fetchItems(payload)}
        >
            <Fields>
                <Field
                    name="id"
                    label="Id"
                />
                <Field
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

            <DeleteForm
                title="Zablokuj użytkownika"
                message="Jesteś pewien, że chcesz zablokować wybranego użytkownika?"
                trigger="Zablokuj"
                onSubmit={task => service.delete(task)}
                submitText="Zablokuj i nie wyświetlaj"
                validate={(values) => {
                    const errors = {};
                    if (!values.id) {
                        errors.id = 'Brak id';
                    }
                    return errors;
                }}
            />

            <Pagination
                itemsPerPage={5}
                fetchTotalOfItems={payload => service.fetchTotal(payload)}
                activePage={1}
            />
        </CRUDTable>
    </div>
);

UsersTable.propTypes = {};

export default UsersTable;
