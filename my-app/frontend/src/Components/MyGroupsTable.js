import React from 'react';
import CRUDTable, {
    Fields,
    Field,
    CreateForm,
    Pagination
} from 'react-crud-table';
import axios from 'axios';
import '../index.css';

var tasks = [];

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
    create: async (task) => {
        //console.log(task.nazwa);

        // this.getToken();
        const token = await axios.post('http://localhost:5000/ReadToken', {
            token: localStorage.getItem('token')
        });

        await axios.post('http://localhost:5000/Grupa/Stworz', {
            nazwa: task.nazwa,
            opis: task.opis,
        });

        await axios.post('http://localhost:5000/Grupa/Stworz_Moderatora', {
            nazwa: task.nazwa,
            id: token.data.user.id,
        });

        let count = tasks.length + 1;
        tasks.push({
            ...task,
            id: count,
        });

        console.log(token.data.user.id);

        return Promise.resolve(task);
    },

};

const styles = {
    container: {},
};

function Ustaw(props) {
    tasks = props.groups;
}

const MyGroupsTable = (props) => (

    <div style={styles.container}>
        {Ustaw(props)}

        <CRUDTable style={{ width: '100%' }}
            caption="Moje Grupy"
            fetchItems={payload => service.fetchItems(payload)}
        >
            <Fields>
                <Field hideInCreateForm
                    name="id"
                    label="Id"
                />
                <Field
                    name="nazwa"
                    label="Nawa grupy"
                />
                <Field
                    name="opis"
                    label="Opis"
                />
            </Fields>

            <CreateForm
                title="Tworzenie grupy"
                message="Tworzenie nowej grupy"
                trigger="Stwórz nową grupę!"
                onSubmit={task => service.create(task)}
                submitText="Stwórz"
                validate={(values) => {
                    const errors = {};

                    if (!values.nazwa) {
                        errors.nazwa = 'Proszę wypełnić podane pole!';
                    }
                    if (!values.opis) {
                        errors.opis = 'Proszę wypełnić podane pole!';
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

MyGroupsTable.propTypes = {};

export default MyGroupsTable;
