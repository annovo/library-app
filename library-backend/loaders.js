const Book = require('./models/book')
const DataLoader = require('dataloader')
const _ = require('lodash')

const bookCountLoader = new DataLoader(async keys => {
  const books = await Book.find({}).populate('author')

  return _.map(keys, key => {
    const count = _.reduce(books, (count, book) => {
      if(book.author._id.toString() === key) {
        return count + 1
      }
      return count
    }, 0)
    return count
  })
})

module.exports = { bookCountLoader }