import React, {useState} from 'react'

const BookForm = ({ onSubmit, handleError }) => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')

  const submit = (event) => {
    event.preventDefault()
    onSubmit(title, author)
    setTitle('')
    setAuhtor('')
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
        <button type='submit'>create book</button>
      </form>
  )
}

export default BookForm