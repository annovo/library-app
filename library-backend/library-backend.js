const { ApolloServer, gql, UserInputError, AuthenticationError, PubSub } = require('apollo-server')
const pubsub = new PubSub()
const _ = require('lodash')
const config = require('./utils/config')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const loaders = require('./loaders')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

mongoose.set('useFindAndModify', false)
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to mongo..'))
  .catch(e => console.log('error connection', e.message))


const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int
    id: ID!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genres: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!,
      author: String!,
      published: Int!,
      genres:[String!]!
    ): Book
    editAuthor(
      name: String!,
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
  Query: {
    authorCount: () => Author.collection.countDocuments(),
    bookCount: () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      const books = await Book.find({}).populate('author')
    
      if(_.isEmpty(args)) {
        return books
      }

      if(args.genres) {
        args.genres = _.toArray({genres: args.genres})
      }

      if(args.author) {
        args.author = {name: args.author }
      }
    
      return _.filter(books, args)
    },
    allAuthors: () => {
      return Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Author: {
    bookCount: async (root, args, { loaders }) => {
      return await loaders.bookCountLoader.load(root.id)
    }
  },

  Mutation : {
    addBook: async (root, args, { currentUser }) => {
      if(!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      let author = await Author.findOne({ name: args.author })
      
      if(!author) {
        const newAuthor = new Author({ name: args.author })
        try {
          author = await newAuthor.save()
        } catch (error) {
          throw new UserInputError(error.message, { invalidArgs: args })
        }
      }

      const book = new Book ({ ...args, author: author._id })

      try {
        await book.save()
        await book.populate('author').execPopulate()
      } catch (error) {
        await Author.findByIdAndDelete(author._id)
        throw new UserInputError(error.message, { invalidArgs: args })
      }
      pubsub.publish('BOOK_ADDED', {bookAdded: book})
      return book
    },
    editAuthor: async (root, args, { currentUser }) => {
      if(!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      let author = await Author.findOne({ name: args.name })
      
      author.born = args.setBornTo
      try {
        await author.save()  
      } catch(error) {
        throw new UserInputError (error.message, { invalidArgs: args })
      }
      
      return author
    },
    createUser: (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      return user.save()
        .catch(e => {
          throw new UserInputError(e.message, { invalidArgs: args })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if(!user || args.password !== 'somepass') {
        throw new UserInputError('wrong username or password')
      }

      const userForToken = { username: user.username, id: user._id }
      return { value: jwt.sign(userForToken, config.JWT_STRING) }
    }
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if(auth && auth.toLowerCase().startsWith('bearer ')){
      const decodedToken = jwt.verify(auth.substring(7), config.JWT_STRING)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser, loaders }
    }
    return { loaders }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
.catch(e => console.log('some error occurs: ',e.message))