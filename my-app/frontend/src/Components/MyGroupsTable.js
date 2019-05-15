import React from 'react';
import CRUDTable, {
    Fields,
    Field,
    DeleteForm,
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
                <Field
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
