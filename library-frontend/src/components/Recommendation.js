import React from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, CURRENT_USER } from '../queries'
import _ from 'lodash'

const Recomendation = (props) => {
  const result = useQuery(ALL_BOOKS)
  const user = useQuery(CURRENT_USER)
  
  if (!props.show || result.loading || !result.data || !user.data.me) {
    return null
  }
  const books = result.data.allBooks
  const favGenre = { genres: [user.data.me.favoriteGenre] }
  const booksToShow = _.filter(books, favGenre)

  return (
    <div>
      <h2>Recomendations </h2>
      <p>books in your favorite genre <strong>{favGenre.genres[0]}</strong></p>
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
          {booksToShow.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recomendation