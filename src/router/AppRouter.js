import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import CalendarScreen from "../components/calendar/CalendarScreen";
import { LoginScreen } from "../components/auth/LoginScreen";
import { useDispatch, useSelector } from "react-redux";
import { startChecking } from "../actions/auth";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";


const AppRouter = () => {

  const dispatch = useDispatch();
  const {checking, uid} = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(startChecking())
    
  }, [dispatch]);

  // Este checking es para saber si el usuario esta logueado o no.
  if (checking) {
    return <h5>Espere ...</h5>;
  }


  return (

    <Router>
      <div>
        <Switch>
          <PublicRoute 
          exact 
          path="/login" 
          component={LoginScreen}
          isAuthenticated={!!uid} // la doble negacion convierte cualquier objeto en un true o false
          />

          <PrivateRoute 
          exact 
          path="/" 
          component={CalendarScreen}
          isAuthenticated={!!uid}
          />

          <Redirect to="/login"/>
        </Switch>
      </div>
    </Router>
  )
}

export default AppRouter
