import React, {useState, useRef, useEffect } from 'react'
import { useSprings, animated as a } from 'react-spring'
import { hashCode } from '../utils/hashFunction'
import bookCover from '../bookCover.png'
import _ from 'lodash'

const colorPallette = [
  "rgba(131, 131, 131, 0.5)", 
  "rgba(75, 93, 103, 0.5)", 
  "rgba(240, 236, 227, 0.5)", 
  "rgba(24, 77, 71, 0.5)"
]

const BooksGrid = ({ books, style }) => {
  const [springs, setSprings] = useSprings(books ? books.length : 0, i => ({
    opacity: 1,
    transform: 'rotateY(0deg)', 
    config: { mass: 5, tension: 500, friction: 80 }
  }), [books])
  const [flipped, setFlipped] = useState(false)
  const [backgroundStyle, setBackground] = useState({})

  useEffect(() => {
    const newBackground = _.reduce(
      books, (res, book) => {
        const randomPalletteKey = Math.abs(hashCode(book.id) % colorPallette.length)
        res[book.id] = colorPallette[randomPalletteKey]
        return res
      }, {})
    setBackground(newBackground)
  },[books])

  const currSpringIndex = useRef()
  const handleItemClick = (index) => {
    if(currSpringIndex.current !== index) {
      setSprings(i => ({ 
        opacity: (index === i) ? 0 : 1, 
        transform: (index === i) ? 'rotateY(180deg)': 'rotateY(0deg)',
        delay: (index === i) ? 0 : 350 
      }))
      setFlipped(true);
    } else {
      setSprings(i => ({ 
        opacity: (index === i) ? (!flipped) ? 0 : 1 : 1, 
        transform: (index === i) ? (!flipped) ? 'rotateY(180deg)' : 'rotateY(0deg)' : 'rotateY(0deg)',
        delay: (index === i) ? 0 : 350
      }))
      setFlipped(!flipped)
    }
    currSpringIndex.current = index
  }
  return (
    <div className = "books-grid-container" style = {style}>
    {springs.map(({ opacity, transform }, i) => 
      <a.div onClick = {() => handleItemClick(i)} key = {i} className = 'books-grid-item'>
        <a.div className = "books-grid-cover" style ={{ opacity, transform, backgroundImage: `url(${bookCover})`, backgroundSize: "320px 450px" }}>
          <div className = "books-grid-title">{books[i].title}</div>
          <div className = "books-grid-author">{books[i].author.name}</div>
          <div className = "books-grid-footer">{books[i].published}</div>
        </a.div>
        <a.div 
          className = "books-grid-cover" 
          style ={{ opacity: opacity.interpolate(o => 1 - o), transform: transform.interpolate(t => `${t} rotateY(180deg)`), backgroundColor: backgroundStyle[books[i].id]}}
        >
          {books[i].genres.map(g => <h2 key = {g}>{g}</h2>)}
        </a.div>
      </a.div>
    )}
  </div>  
  )
}

export default BooksGrid