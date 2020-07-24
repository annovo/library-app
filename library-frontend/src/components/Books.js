import React, { useState, useEffect, useMemo } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import _ from 'lodash'
import BooksGrid from './BooksGrid'

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
  const [bookToShow, setBooks] = useState(null)
  const [genres, setGenres] = useState([])
  const [genre, setGenre] = useState('all')

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
  
  useEffect(() => {
      getBook()
  }, [getBook])
  
  useEffect(() => {
    if(data){
      const booksGenres = _.reduce(data.allBooks, (res, book)=> _.union(res, book.genres),[])
      const newGenres = _.union(genres, booksGenres)
      setGenres(newGenres)
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
      <BooksGrid books = {bookToShow} style = {style} />
    </div>
  )
}

export default Books