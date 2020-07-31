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

  const getIcons = (rating) => {
    let colored = rating ? Number(rating) : 0
    let icons = []
    for(let i = 1; i < 6; i++) {
      let style = {color: "gray"}
      if((colored - i) >= 0) {
        style.color = "#c70039"
      } else {
        if(Math.floor(colored) !== colored) {
          let percent = Math.floor((colored % Math.floor(colored)) * 100)
          style = {
            background: `linear-gradient(90deg, #c70039 0%, #c70039 ${percent}%, gray ${percent}%, gray 100%)`,
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent"
          }
          colored = 0
        } else {
          style.color = "gray"
        }
      }
      icons.push(<i style = {style} className="material-icons">star</i>)
    }
    return icons
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
          <div className = "books-modal-title">{books[i].title}</div>
          <div className = "books-modal-author">{books[i].author} <br /> {books[i].published}</div>
          <div className = "books-modal-rating">
            {getIcons(books[i].rating)}
          </div>
          <div className = "books-modal-img">
            <img src = {books[i].img || "https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png"} alt = "nothing"/>
          </div>
          <div className = "books-modal-description">{books[i].description?.length > 400 ? `${books[i].description.slice(0, 400)}...` : books[i].description}</div>
          <div className = "books-modal-genres books-grid-footer">{books[i].genres && books[i].genres.map(g => <p key = {g}>{g}</p>)}</div>
        </a.div>
        <a.div 
          className = "books-grid-cover"
          style={{ zIndex, transform: scale.interpolate(s => `perspective(600px) scale(${s})`), opacity: opacity.interpolate(o => 1-o) }}
        >
          <button className = "addButton" onClick = {() => onSubmit(books[i])}>ADD BOOK</button>
        </a.div>
      </a.div>
    )}
  </div>  
  </div>
  )
}

export default BookModal