import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'

const AuthorForm = ({ authors, updateBornyear }) => {

  const [name, setName] = useState('')
  const [bornyear, setBornyear] = useState('')

  useEffect(() => {
    if(authors)
    {
      setName(authors[0].name)
    }
  }, [authors])

  const updateAuthor = (e) => {
    e.preventDefault()
    const born = bornyear.trim() === '' ? null : Number(bornyear)

    updateBornyear({variables: {name, born }})

    setName(authors[0].name)
    setBornyear('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      name
      <select value = {name} onChange = {({target}) => setName(target.value)} >
          {authors.map(a =>
            <option key = {a.id} value = {a.name}>{a.name}</option>
          )}
      </select>
      <br />
      born 
      <input value = {bornyear} onChange = {({target}) => setBornyear(target.value)} />
      <br />
      <button type = 'button' onClick = {updateAuthor}>update author</button>
    </div>
  )
}

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)

  const [ updateBornyear ] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{query: ALL_AUTHORS}],
    onError: error => {
      if(error.graphQLErrors[0] && error.graphQLErrors[0].message){
        props.onError(error.graphQLErrors[0].message)
      } else {
        props.onError('Birth date should be a number')
      }
    }
  })

 
  if (!props.show || !result.data) {
    return null
  }

  if(result.loading) {
    return <div>loading ... </div>
  }

  const authors = result.data.allAuthors


  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      {
        props.user
        ? <AuthorForm authors = {authors} updateBornyear ={updateBornyear} />
        : null
      }
    </div>
  )
}

export default Authors
