import React, {useState} from 'react'
import BookForm from './BookForm'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK } from '../queries'
import axios from 'axios'
import BookModal from './BookModal'

const NewBook = (props) => {
  const [show, setShow] = useState(false)
  const [books, setBooks] = useState([])

  const handleError = (error) => {
    if(error && error.graphQLErrors[0] && error.graphQLErrors[0].message){
      props.onError(error.graphQLErrors[0].message)
    } else {
      props.onError('Sorry, cant create a book with such parameters')
    }
    props.setPage('add')
  }

  const [ createBook ] = useMutation(CREATE_BOOK, {
    onError: (error) => handleError(error),
    update: (_, response) => {
        props.updateCacheWith(response.data.addBook, response.data.addBook.author)
      }
  })

  if (!props.show) {
    return null
  }

  const onClick = async (title, author, published, genres) => {
    if(
        title.trim() !== '' && 
        author.trim() !== '' 
        // published.trim() !== '' &&
        // genres.length !== 0
      ) {
        const bookTitle = title.trim().toLowerCase().replace(/\s+/g, '+')
        const bookAuthor = author.trim().toLowerCase().replace(/\s+/g, '+')
        const { data } = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${bookTitle}+inauthor:${bookAuthor}`)
        const newBooks = data.items ? data.items.reduce((res, book, i) => {
          if(i < 10) {
            let newBook = {
              title: book.volumeInfo.title,
              author: book.volumeInfo.authors[0],
              description: book.volumeInfo.description,
              rating: book.volumeInfo.averageRating,
              genres: book.volumeInfo.categories,
              published: book.volumeInfo.publishedDate,
            }
            res = res.concat(newBook)
          }
          return res
        }, []) : []
        setBooks(newBooks)
        setShow(true)
        //const { description, averageRating: rating } = data.items[0].volumeInfo
       // createBook({variables: { title, author, published: Number(published), genres, description, rating: Number(rating) }})
        //props.setPage('authors')
      } else {
        handleError()
      }
  }

  const onSubmit = (book) => {
    const {title, author, published, genres, description, rating} = book
    console.log(book)
    createBook({variables: { title, author, published, genres, description, rating: Number(rating) }})
    setShow(false)
    props.setPage('authors')
  }
  return (
    <div>
      <BookForm onSubmit = {onClick} handleError = {handleError} />
      {show && <BookModal books = {books} onSubmit = {onSubmit} />}
    </div>
  )
}

export default NewBook