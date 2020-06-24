import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

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
    update: (store, response) => {
        props.updateCacheWith(response.data.addBook, response.data.addBook.author)
      }
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    if(
        title.trim() !== '' && 
        author.trim() !== '' &&
        published.trim() !== '' &&
        genres.length !== 0
      ) {
        createBook({variables: { title, author, published: Number(published), genres }})
        props.setPage('authors')
      } else {
        handleError()
      }

      setTitle('')
      setPublished('')
      setAuhtor('')
      setGenres([])
      setGenre('')
  }

  const addGenre = () => {
    if(genre.trim() !== '' )
    {
      setGenres(genres.concat(genre))
      setGenre('')
    } else {
      handleError()
    }  
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook