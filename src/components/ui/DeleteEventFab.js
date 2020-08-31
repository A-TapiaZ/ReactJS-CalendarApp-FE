// Fab: floating action button

import React from 'react'
import { useDispatch } from 'react-redux'
import { eventStartDelete } from '../../actions/events';

const DeleteEventFab = () => {

  const dispatch = useDispatch();

  const handleClick =() => {
    dispatch(eventStartDelete());
  }
  


  return (
    <button
      className="btn btn-danger fab-danger"
      onClick={handleClick}
      >
      <i className="fas fa-trash"></i>
      <span> Borrar evento</span>            
    </button>
  )
}

export default DeleteEventFab
