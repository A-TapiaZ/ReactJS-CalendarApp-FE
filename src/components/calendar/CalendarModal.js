import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { eventClearActiveEvent,eventStartAddNew,eventStartUpdate } from '../../actions/events';


// Se puede poner en un helper, pero no lo haremos . 
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

// yourAppElement: es el elemento que se encuentra en el index.html de la carpeta public
// Modal.setAppElement('#yourAppElement')
Modal.setAppElement('#root')

const now= moment().minutes(0).seconds(0).add(1,'h');

const initEvent={
  title: '',
  notes: '',
  start: now.toDate(),
  end:now.add(1,'h').toDate(),
}

/**EMPIEZA EL CODIGO DEL COMPONENTE */
const CalendarModal = () => {

  // Obtengo el estado del REDUX storage
  const {modalOpen} = useSelector(state => state.ui)
  const {activeEvent} = useSelector(state => state.calendar)

  const dispatch = useDispatch();

  // Definimos useState, porque este estado solo se implementara en esta pagina. 
  const [dateStart, setDateStart] = useState(now.toDate())
  const [dateEnd, setDateEnd] = useState(now.add(1,'h').toDate())

  // Un estado para saber si ingresaron un titulo
  const [titleValid, setTitleValid] = useState(true);

  const [formValues, setFormValues] = useState(initEvent)
  
  const {title,notes,start,end}=formValues;  

  useEffect(() => {
    if (activeEvent) {
      setFormValues(activeEvent)
    } else {
      setFormValues(initEvent)
    }
  }, [activeEvent,setFormValues])


  const handleInputChange= ({target}) => {
    setFormValues({
      ...formValues,
      [target.name]:target.value,
    })
  }

  const closeModal = () => {
    dispatch(uiCloseModal());
    dispatch(eventClearActiveEvent());
    setFormValues(initEvent);
  } 
  
  const handleStartDateChange= (e) => {
    setDateStart(e);
    setFormValues({
      ...formValues,
      start:e,
    })
  }

  const handleEndDateChange= (e) => {
    setDateEnd(e);
    setFormValues({
      ...formValues,
      end:e,
    })
  };

  const handleSubmitForm= (e) => {
    e.preventDefault();

    const momentStart = moment(start);
    const momentEnd = moment(end);

    if (momentStart.isSameOrAfter(momentEnd)) {
      return Swal.fire('Error','Fecha 2 debe ser mayor','error');
    }

    if (title.trim().length < 2) {
      return setTitleValid(false);
    }

    // Si existe un evento activo (estado en redux), es porque lo estamos actulizando, si no, seria un evento nuevo.
    if (activeEvent) {
      dispatch(eventStartUpdate(formValues));
    }else{
      dispatch(eventStartAddNew(formValues));
    }

    setTitleValid(true)
    closeModal();
  };
  


  return (
    <Modal
      isOpen={modalOpen}
      // onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      closeTimeoutMS={200}
      className="modal"
      overlayClassName="modal-fondo"
    > 
      <h1> {activeEvent? 'Editar evento' : 'Nuevo evento' } </h1>
      <hr />
      <form 
        className="container"
        onSubmit={handleSubmitForm}
        >

        <div className="form-group">
          <label>Fecha y hora inicio</label>
          <DateTimePicker
          className="form-control"
          onChange={handleStartDateChange}
          value={dateStart}
          />
        </div>

        <div className="form-group">
          <label>Fecha y hora fin</label>
          <DateTimePicker
          className="form-control"
          onChange={handleEndDateChange}
          value={dateEnd}
          minDate={dateStart}
          />
        </div>

        <hr />
        <div className="form-group">
          <label>Titulo y notas</label>
          <input 
            type="text" 
            className={`form-control ${!titleValid && 'is-invalid'}`}
            placeholder="Título del evento"
            name="title"
            autoComplete="off"
            value={title}
            onChange={handleInputChange}
          />  
          <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
        </div>

        <div className="form-group">
          <textarea 
            type="text" 
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={notes}
            onChange={handleInputChange}
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">Información adicional</small>
        </div>

        <button
          type="submit"
          className="btn btn-outline-primary btn-block"
        >
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>

      </form>
    </Modal>
  )
}

export default CalendarModal
