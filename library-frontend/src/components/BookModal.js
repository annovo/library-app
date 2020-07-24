import React, {useMemo} from 'react'
import {animated as a, useSprings} from 'react-spring'

const BookModal = ({ books, onSubmit }) => {
  const [springs, setSprings] = useSprings(books.length, i => ({
    opacity: 1,
    scale: 1,
    zIndex: 0,
    config: { mass: 5, tension: 350, friction: 40 }
  }))
  const style = useMemo(() => {
    if(books){
      const length = books.length
      const columnCount = 3
      const rowCount = length % columnCount 
        ? Math.floor(length/columnCount) + 1 
        : length/columnCount
      return {"--row-count": rowCount}
    }
  }, [books])

  const handleMouseMove = (index) => {
    setSprings( i => ({
      scale: (i === index) ? 1.1 : 1,
      opacity: (i === index) ? 0 : 1,
      zIndex: (i === index) ? 1 : 0
    }))
  }

  return(
    <div>
      <h2>Did you mean</h2>
      <div className = "books-grid-container" style = {style}>
    {springs.map(({ opacity, scale, zIndex }, i) => 
      <a.div
        key = {i} 
        className = 'books-grid-item'
        onMouseMove={() => handleMouseMove(i)}
        onMouseLeave={() => setSprings({ scale: 1, opacity: 1, zIndex: 0 })}
      >
        <a.div 
          className = "books-grid-cover"
          style={{ zIndex, transform: scale.interpolate(s => `perspective(600px) scale(${s})`), opacity: opacity }}
        >
          <div className = "books-grid-img">
            <img src = "https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png" alt = "nothing"/>
          </div>
          <div className = "books-grid-title">{books[i].title} - {books[i].author}</div>
          <div className = "books-grid-footer">{books[i].published}</div>
          {books[i].genres && books[i].genres.map(g => <h2 key = {g}>{g}</h2>)}
        </a.div>
        <a.div 
          className = "books-grid-cover"
          style={{ zIndex, transform: scale.interpolate(s => `perspective(600px) scale(${s})`), opacity: opacity.interpolate(o => 1-o) }}
        >
          <button className = "addButton" onClick = {() => onSubmit(books[i])}>ADD</button>
        </a.div>
      </a.div>
    )}
  </div>  
  </div>
  )
}

export default BookModal