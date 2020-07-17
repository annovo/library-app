import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSprings, animated as a } from 'react-spring'
import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { hashCode } from '../utils/hashFunction'
import _ from 'lodash'

const colorPallette = [
  "rgba(252, 130, 16, 0.5)", 
  "rgba(116, 212, 192, 0.5)", 
  "rgba(217, 69, 95, 0.5)", 
  "rgba(222, 244, 240, 0.5)"
]

const BooksSort = ({ genres, genre, onChange }) => 
(
    <div>
      <select value = {genre} onChange = {onChange} >
          <option key = '00' value = 'all'>all books</option>
          {genres.map((g, i) =>
            <option key = {i} value = {g}>{g}</option>
          )}
      </select>
    </div>
)

const Books = (props) => {
  const [getBook, { loading, data }] = useLazyQuery(ALL_BOOKS)
  const [bookToShow, setBooks] = useState()
  const [genres, setGenres] = useState([])
  const [genre, setGenre] = useState('all')
  const [backgroundStyle, setBackground] = useState({})
  const style = useMemo(() => {
    if(data && data.allBooks){
      const length = data.allBooks.length
      const columnCount = 3
      const rowCount = length % columnCount 
        ? Math.floor(length/columnCount) + 1 
        : length/columnCount
      return {"--row-count": rowCount}
    }
  }, [data])
  
  const [springs, setSprings] = useSprings(data ? data.allBooks.length : 0, i => ({
      opacity: 1,
      transform: 'rotateY(0deg)', 
      config: { mass: 5, tension: 500, friction: 80 }
  }), [data])
  const [flipped, setFlipped] = useState(false)
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

  useEffect(() => {
      getBook()
  }, [getBook])
  
  useEffect(() => {
    if(data){
      const booksGenres = _.reduce(data.allBooks, (res, book)=> _.union(res, book.genres),[])
      const newGenres = _.union(genres, booksGenres)
      setGenres(newGenres)
      const newBackground = _.reduce(
        data.allBooks, (res, book) => {
          const randomPalletteKey = Math.abs(hashCode(book.id) % colorPallette.length)
          res[book.id] = colorPallette[randomPalletteKey]
          return res
        }, {})
      setBackground(newBackground)
    }
  },[data]) //eslint-disable-line

  useEffect(() => {
    if(data && data.allBooks){
      setBooks(data.allBooks)
    }
  }, [data])

  if(!props.show) {
    return null 
  }

  if (loading || !bookToShow) {
    return <div>loading...</div>
  }

  const handleChange = ({ target }) => {
    setGenre(target.value)
    return target.value === 'all' ? getBook() : getBook({variables: {genres: target.value}})
  }

  return (
    <div>
      <h2>books</h2>
      <BooksSort genres = {genres} genre = {genre} onChange = {handleChange}/>
      <div className = "books-grid-container" style = {style}>
        {bookToShow.length === springs.length && springs.map(({ opacity, transform }, i) => 
          <a.div onClick = {() => handleItemClick(i)} key = {i} className = 'books-grid-item'>
            <a.div className = "books-grid-cover" style ={{ opacity, transform, backgroundColor: backgroundStyle[bookToShow[i].id] }}>
              <div className = "books-grid-img">
                <img src = "https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png" alt = "nothing"/>
              </div>
              <div className = "books-grid-title">{bookToShow[i].title} - {bookToShow[i].author.name}</div>
              <div className = "books-grid-footer">{bookToShow[i].published}</div>
            </a.div>
            <a.div 
              className = "books-grid-cover" 
              style ={{ opacity: opacity.interpolate(o => 1 - o), transform: transform.interpolate(t => `${t} rotateY(180deg)`), backgroundColor: backgroundStyle[bookToShow[i].id]}}
            >
              {bookToShow[i].genres.map(g => <h2 key = {g}>{g}</h2>)}
            </a.div>
          </a.div>
        )}
        {/* {bookToShow && bookToShow.map((a, i) =>
            <div className = 'books-grid-item' key={a.title}>
              <div className = "books-grid-cover front">
                <div className = "books-grid-img">
                  <img src = "https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png" alt = "nothing"/>
                </div>
                <div className = "books-grid-title">{a.title} - {a.author.name}</div>
                <div className = "books-grid-footer">{a.published}</div>
              </div>
              <div className = "books-grid-cover back">{a.genres.map(g => <h2 key = {g}>{g}</h2>)}</div>
            </div>
          )} */}
      </div>  
    </div>
  )
}

export default Books