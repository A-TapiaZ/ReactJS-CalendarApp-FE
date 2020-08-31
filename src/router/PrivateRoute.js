import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({
  isAuthenticated,
  component:Component,
  ...rest
}) => {

  return (
    <Route {...rest}
      component={ (props) => (
        // Si esta autenticado
        isAuthenticated
        // lo dejo pasar y cargo el componente que pase desde las props, en este caso, el JournalScreen o la pantalla ppal de mi aplicacion.
        ? <Component{...props}/> 
        // de lo contrario lo redirecciono al login
        : <Redirect to="/login"/>

      )}
    />
  )
}

PrivateRoute.prototypes={
  isAuthenticated:PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
}
export default PrivateRoute
