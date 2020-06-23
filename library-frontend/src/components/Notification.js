import React from 'react'

const Notification = ({ message }) => {
  if(!message) {
    return null
  }

  const style = {
    border: '3px solid',
    borderRadius: '16px',
    margin: 5,
    textAlign: 'center',
    borderColor: message.success ? 'green' : 'red'
  }

  return(
    <div style = {style}>
      { message.text }
    </div>
  )
}

export default Notification