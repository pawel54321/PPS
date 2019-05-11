import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, roles, rola, ...rest }) => (
    <Route {...rest} render={(props) => {
        let currentUser = rola;

        if (!currentUser) {
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        if (roles && roles.indexOf(currentUser) === -1) {
            return <Redirect to={{ pathname: '/'}} />
        }

        return <Component {...props} />
    }} />
)

export default PrivateRoute;
