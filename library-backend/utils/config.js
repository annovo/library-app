require('dotenv').config()

let MONGODB_URI = process.env.MONGODB_URI
let JWT_STRING = process.env.JWT_STRING

module.exports = { MONGODB_URI, JWT_STRING }