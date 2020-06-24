
import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notification from './components/Notification'
import Login from './components/Login'
import { useApolloClient, useSubscription } from '@apollo/client'
import Recomendation from './components/Recommendation'
import { BOOK_ADDED, ALL_BOOKS, ALL_AUTHORS } from './queries'

const ButtonSet = ({ setPage, logout }) => {
  return(
    <>
      <button onClick={() => setPage('add')}>add book</button>
      <button onClick={() => setPage('recommend')}>recommend</button>
      <button onClick = {logout}>logout</button>
    </>
  )
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [message, setMessage] = useState(null)
  const [timerId, setTimer] = useState(null)
  const [user, setUser] = useState()
  const client = useApolloClient()

  const notify = (text, success) => {
    clearInterval(timerId)

    const newMessage = success ? { text, success: true } : { text }
    setMessage(newMessage)
    const id = setTimeout(() => setMessage(null), 3000)
    setTimer(id)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  useEffect(() => {
    const token = window.localStorage.getItem('library-app-user')
    if(token) {
      setUser(token)
    }
  }, [])

  const updateCacheWith = (book, author) => {
    const booksInStore = client.readQuery({ query: ALL_BOOKS })

    if(!_.find(booksInStore.allBooks, book)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: {
          booksInStore, allBooks: [ ...booksInStore.allBooks, book ]} 
      })
    }

    const authorsInStore = client.readQuery({ query: ALL_AUTHORS })

    if(!_.find(authorsInStore.allAuthors, author)){
      client.writeQuery({
        query: ALL_AUTHORS,
        data: {
          authorsInStore,
          allAuthors: [ ...authorsInStore.allAuthors, author ]
        }
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} added`, 'success')
      updateCacheWith(addedBook, addedBook.author)
    }
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {
          user
          ? <ButtonSet setPage = {setPage} logout = {handleLogout} />
          : <button onClick={()=>setPage('login')}>login</button>
        }

      </div>

      <Notification message = {message} />
      <Authors
        show={page === 'authors'}
        onError = {notify}
        user = {user}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
        onError = {notify}
        setPage = {setPage}
        updateCacheWith = {updateCacheWith}
      />

      <Login show = {page === 'login'} onError = {notify} setUser = {setUser} setPage = {setPage} />
      <Recomendation show = {page === 'recommend'} />
    </div>
  )
}

export default App