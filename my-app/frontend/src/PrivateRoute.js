import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Alert from 'react-s-alert';

const PrivateRoute = ({ component: Component, roles, rola, ...rest }) => (
    <Route {...rest} render={(props) => {
        let currentUser = rola;

        if (!currentUser) {
            Alert.error('Musisz być zalogowany, by wejść na tę stronę', { position: 'bottom' });
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        if (roles && roles.indexOf(currentUser) === -1) {
            Alert.error('Nie masz uprawnień, by wejść na tę stronę', { position: 'bottom' });
            return <Redirect to={{ pathname: '/'}} />
        }

        return <Component {...props} />
    }} />
)

export default PrivateRoute;
