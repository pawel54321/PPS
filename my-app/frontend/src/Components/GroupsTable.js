import React from 'react';
import CRUDTable, {
    Fields,
    Field,
    DeleteForm,
    Pagination,
    CreateForm
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
    delete: (data) => {
        const task = tasks.find(t => t.id === data.id);
        axios.post('', { // DODAĆ USUWANIE, KIEDY BĘDZIE W BACKENDZIE
            idGroup: data.id
        });
        return Promise.resolve(task);
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
    delete: (data) => {
        const task = tasks.find(t => t.id === data.id);
        axios.post('http://localhost:5000/Grupa/Zablokuj_Grupe', { // DODAĆ USUWANIE, KIEDY BĘDZIE W BACKENDZIE
            id: data.id
        });
        return Promise.resolve(task);
    },

};

//this.state = {
 //   token: []
//};

//getToken = async () => {
   // const token = await axios.post('http://localhost:5000/ReadToken', {
   //     token: localStorage.getItem('token')
  //  });
 //   this.setState({ token: token });
//};

const styles = {
    container: {},
};


function Ustaw(props) {
    tasks = props.groups;
}

const GroupsTable = (props) => (

    <div style={styles.container}>
        {Ustaw(props)}

        <CRUDTable style={{ width: '100%' }}
            caption="Grupy"
            actionsLabel="Akcje"
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

            <DeleteForm
                title="Zablokuj grupę"
                message="Jesteś pewien, że chcesz zablokować wybraną grupę?"
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

GroupsTable.propTypes = {};

export default GroupsTable;
