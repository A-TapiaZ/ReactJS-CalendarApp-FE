import React from 'react'

const CalendarEvent = ({event}) => {

  const  {title, user:{name}}= event;

  return (
    <div>
      <span>{title}</span>
      <strong>- {name}</strong>
    </div>
  )
}

export default CalendarEvent
