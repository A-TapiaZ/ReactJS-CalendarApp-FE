import React, { useState, useEffect } from 'react';
import NavBar from '../ui/NavBar';
// Este modo de importacion esta obsoleto. 
// import BigCalendar from 'react-big-calendar';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/es'
import { messages } from '../../helpers/calendar-messages-es';
import CalendarEvent from './CalendarEvent';
import CalendarModal from './CalendarModal';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import { eventSetActive, eventClearActiveEvent, eventStartLoading } from '../../actions/events';
import AddNewFab from '../ui/AddNewFab';
import DeleteEventFab from '../ui/DeleteEventFab';

// Para pasar moments a español
moment.locale('es');
const localizer = momentLocalizer(moment); // or globalizeLocalizer

// const myEventsList = [{
  //   title: 'titulo evento 2',
  //   start: moment().toDate(),//Sinonimo a hacer un new Date pero en moment.
  //   end:  moment().add(2,'h').toDate(),
  //   notes: 'Comprar el evento 2',
  //   user:{
    //     _id:'9876454',
    //     name:'Pachitu'
    //   }
    // }]
    

/**DEFINICION DEL COMPONENTE */
const CalendarScreen = () => {
  
  const dispatch = useDispatch();
  const {events,activeEvent} = useSelector(state => state.calendar)
  const {uid} = useSelector(state => state.auth)

  // Revisa a ver si en el localstorage hay informacion del lastview, si no la encuentra la establece en month por defecto
  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month')

  useEffect(() => {
    dispatch(eventStartLoading())

  }, [dispatch])


  const onDoubleClick= (e) => {
    dispatch(uiOpenModal());
  }

  const onSelectEvent= (e) => {
    dispatch(eventSetActive(e))
  }

  const onViewChange= (e) => {
    setLastView(e);
    localStorage.setItem('lastView', e)
  }
  
  const eventStyleGetter = (event, start, end, isSelected) => {
    
    const style={
      backgroundColor:(uid === event.user._id ? '#367CF7' : '#465660'),
      borderRadius: '0px',
      opacity:0.7,
      display:'block',
      color:'white',
    }

    return {
      style
    }
  }
  
  // Si hacemos click afuera del evento, el boton de borrar evento tiene que desaparacer.
  const onSelectSlot = (e) => {
    dispatch(eventClearActiveEvent());
  }
  
  return (
    <div className="calendar-screen">
      <NavBar />


      <Calendar 
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      messages={messages}
      eventPropGetter={eventStyleGetter}
      onDoubleClickEvent={onDoubleClick}
      onSelectEvent={onSelectEvent}
      onView={onViewChange}
      onSelectSlot={onSelectSlot}
      selectable={true}
      view={lastView}
      components={{
        event:CalendarEvent 
      }}
      />

      <AddNewFab/>

      {
        activeEvent &&
        <DeleteEventFab/>
      }



      <CalendarModal/>

    </div>
  )
}

export default CalendarScreen
