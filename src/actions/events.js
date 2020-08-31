import { types } from "../types/types";
import {fetchConToken} from "../helpers/fetch";
import { stringToDate } from "../helpers/stringToDate";
import Swal from "sweetalert2";

/* ACTUALIZA EL ESTADO CON EL EVENTO SELECCIONADO (al dar click sobre) */
export const eventSetActive = (event) => ({
  type:types.eventSetActive,
  payload:event,
})

/* INICIA EL GUARDADO DEL EVENTO EN LA BD */
export const eventStartAddNew = (event) => {
  return async (dispatch, getState) => {
    
    const {uid,name} = getState().auth;
    try {
      
      const resp = await fetchConToken('events', event, 'POST');
      const body = await resp.json();

      console.log(body);

      if (body.ok){
        event.id = body.evento.id;
        event.user = {
          _id:uid,
          name,
        }

        console.log(event);
        dispatch(eventAddNew(event));
      }
    } catch (error) {
      console.log(error);

    }
  }
  
}
/* AGREGA EL EVENTO EN EL CALENDARIO */ 
const eventAddNew = (event) => ({
  type:types.eventAddNew,
  payload: event,
})

/* Cuando borro o le doy al espacio vacio cuando el modal esta abierto, es cuando se dispara esta accion para limpiar el estado de 'activeEvent'*/ 
export const eventClearActiveEvent= () => ({
  type:types.eventClearActiveEvent
})

// Limpiamos redux cuando damos al boton logout.
export const enventLogout= () => ({
  type:types.enventLogout
})


/* VA A ACTUALIZAR LOS EVENTOS EN LA BD*/ 
export const eventStartUpdate = (event) => {
  return async (dispatch) => {
    
    try {

      const resp = await fetchConToken(`events/${event.id}`,event,'PUT');
      const body = await resp.json();

      if (body.ok) {
        // NO tomo el event de la respuesta del fetch, sino del argumentoq ue recibe la funcion, ya que es el mismo que se envio a la BD
        dispatch(eventUpdated(event));
      } else{
        Swal.fire('Error',body.msg,'error');
      }

    } catch (error) {
      console.log(error);

    }
  }
}

/* VA A ACTUALIZAR LOS EVENTOS EN EL CALENDARIO*/ 
const eventUpdated= (event) => ({
  type:types.eventUpdated,
  payload:event,
})


/* VA A ELIMINAR UN EVENTO EN LA BD*/ 
export const eventStartDelete = () => {
  return async (dispatch,getState) => {

    const {id} = getState().calendar.activeEvent;
    
    console.log(id);

    try {

      const resp = await fetchConToken(`events/${id}`,{},'DELETE');
      const body = await resp.json();

      console.log(body);

      if (body.ok) {
        dispatch(eventDeleted());
      } else{
        Swal.fire('Error',body.msg,'error');
      }

    } catch (error) {
      console.log(error);

    }
  }
}

/* ELIMINA EL EVENTO DEL CALENDARIO */
const eventDeleted= () => ({
  type:types.eventDeleted,
});


/* VA A TRAER LOS EVENTOS DE LA BD*/ 
export const eventStartLoading = (event) => {
  return async (dispatch) => {
    
    try {
      
      const resp = await fetchConToken('events');
      const body = await resp.json();

      // Creamos un helper para convertir la fecha a tipo date, ya que cuando lo guardamos en la BD, se guarda en tipo String.
      const eventos = stringToDate(body.eventos);

      dispatch(eventLoaded(eventos));

    } catch (error) {
      console.log(error);

    }
  }
}

/** VA A CARGAR LOS EVENTOS EN EL CALENDARIO */
const eventLoaded = (events) => {
  return ({
    type: types.eventLoaded,
    payload: events,
  })
}


