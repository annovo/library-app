import React, {useState} from 'react'

const BookForm = ({ onSubmit, handleError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  // const [published, setPublished] = useState('')
  // const [genre, setGenre] = useState('')
  // const [genres, setGenres] = useState([])

  // const addGenre = () => {
  //   if(genre.trim() !== '' )
  //   {
  //     setGenres(genres.concat(genre))
  //     setGenre('')
  //   } else {
  //     handleError()
  //   }  
  // }

  const submit = (event) => {
    event.preventDefault()
    onSubmit(title, author)
    setTitle('')
    setAuhtor('')
    // setPublished('')
    // setGenres([])
    // setGenre('')
  }
  return(
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
        {/* <div>
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
        </div> */}
        <button type='submit'>create book</button>
      </form>
  )
}

export default BookForm