import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql `
query {
  allAuthors {
    name
    born
    bookCount
    id
  }
}
`
export const ALL_BOOKS = gql `
query getBooks($genres: String){
  allBooks(genres: $genres) {
    title
    published
    genres
    author {
      name
      bookCount
      id
    }
    id
  }
}
`
export const CREATE_BOOK = gql `
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!){
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title,
    author {
      name
      born
      bookCount
      id
    },
    published,
    id
  }
}
`

export const UPDATE_AUTHOR = gql `
mutation updateAuthor($name: String!, $born: Int!) {
  editAuthor(
    name: $name,
    setBornTo: $born
  ) {
    name,
    born
  }
}
`

export const LOGIN_USER = gql `
mutation loginUser($username: String!, $password: String!) {
  login(
    username: $username,
    password: $password
  ) {
    value
  }
}
`

export const CURRENT_USER = gql`
query {
  me {
    username
    favoriteGenre
  }
}
`