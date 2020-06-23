import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import _ from 'lodash'

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

  if (loading || !data) {
    return <div>loading...</div>
  }

  const handleChange = ({ target }) => {
    setGenre(target.value)
    return target.value === 'all' ? getBook() : getBook({variables: {genres: target.value}})
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {bookToShow && bookToShow.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <BooksSort genres = {genres} genre = {genre} onChange = {handleChange}/>
    </div>
  )
}

export default Books