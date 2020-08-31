import { fetchSinToken, fetchConToken } from "../helpers/fetch"
import { types } from "../types/types";
import Swal from "sweetalert2";

/**INGRESO CON CORREO Y CONTRASEÑA, GUARDO TOKEN EN LS */
export const startLogin = (email, password) => {
  return async (dispatch) => {
   
    const resp= await fetchSinToken('auth', {email, password}, 'POST');
    const body= await resp.json();

    if (body.ok) {
      localStorage.setItem('token', body.token);
      localStorage.setItem('token-init-date', new Date().getTime());
      
      dispatch(login({
        uid:body.uid,
        name:body.name,
      }))
    } else {
      Swal.fire('Error', body.msg,'error');
    }
  }  
}

/* REGISTRO USUARIO NUEVO  */
export const startRegister = (name ,email, password) => {
  return async (dispatch) => {
   
    const resp= await fetchSinToken('auth/new', {name, email, password}, 'POST');
    const body= await resp.json();

    console.log(body);

    if (body.ok) {
      localStorage.setItem('token', body.token);
      localStorage.setItem('token-init-date', new Date().getTime());
      
      dispatch(login({
        uid:body.uid,
        name:body.name,
      }))
    } else {
      Swal.fire('Error', body.msg,'error');
    }
  }  
}

// DISPARO LA ACCION PARA ACTUALIZAR EL ESTADO CON LA INFORMACION DEL USER
const login = (user) => ({
  type:types.authLogin,
  payload: user
})


/* Chequear de que el usuario tenga un token valido */
export const startChecking = ( ) => {
  return async (dispatch) => {
    const resp= await fetchConToken('auth/renew');
    const body= await resp.json();

    if (body.ok) {
      localStorage.setItem('token', body.token);
      localStorage.setItem('token-init-date', new Date().getTime());
      
      dispatch(login({
        uid:body.uid,
        name:body.name,
      }))
    } else {
      dispatch(checkingFinish());
    }
  }
}

// Cambia el valor del checking a false, ya que no se ha verificado el token 
const checkingFinish = () => ({type: types.authCheckingFinish})


//Limpiamos todo antes de salir del navegador
export const startLogout = () => {
  return (dispatch) => {
    
    localStorage.clear();
    dispatch(logout());
  }
  
}

const logout = () => ({type:types.authLogout})

