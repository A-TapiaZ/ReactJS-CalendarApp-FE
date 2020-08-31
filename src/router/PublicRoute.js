import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({
  isAuthenticated,
  component:Component,
  ...rest
}) => {

  return (
    <Route {...rest}
      component={ (props) => (
        // Si esta autenticado
        isAuthenticated
        // lo dejo pasar y lo llevo a raiz que es la ruta privada
        ?  <Redirect to="/"/>
        // de lo contrario lo mando al componente que le estoy enviando desde los props, en este caso , que contiene las paginas de registro y login.
        : <Component{...props}/>
        
      )}
    />
  )
}

PublicRoute.prototypes={
  isAuthenticated:PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
}
export default PublicRoute
