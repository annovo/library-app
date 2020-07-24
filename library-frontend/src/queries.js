import { gql } from '@apollo/client'

const AUTHOR_DETAILS = gql `
  fragment authorDetails on Author {
    name
    born
    bookCount
    id
  }
`
const BOOK_DETAILS = gql `
 fragment bookDetails on Book {
   title
   published
   genres
   description
   rating
   id
   author {
    ...authorDetails
   }
 }
 ${AUTHOR_DETAILS}
`

export const ALL_AUTHORS = gql `
{
  allAuthors {
    ...authorDetails
  }
}
${AUTHOR_DETAILS}
`

export const ALL_BOOKS = gql `
query getBooks($genres: String){
  allBooks(genres: $genres) {
    ...bookDetails
  }
}
${BOOK_DETAILS}
`
export const CREATE_BOOK = gql `
mutation createBook($title: String!, $author: String!, $published: String!, $genres: [String!]!, $description: String, $rating: Float){
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres,
    description: $description,
    rating: $rating
  ) {
    ...bookDetails
  }
}
${BOOK_DETAILS}
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

export const LOGIN_USER = gql`
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

export const BOOK_ADDED = gql`
subscription {
  bookAdded {
    ...bookDetails
  }
}
${BOOK_DETAILS}
`