const mongoose = require('mongoose')

const Schema = mongoose.Schema

const portSchema = new Schema({
  code: { type: String, required: true, unique: true, max: 250 },
  name: { type: String, required: true, max: 250 },
  country: { type: String, required: true, max: 250 },
  address: { type: String, required: true, max: 250}
})

module.exports = mongoose.model('Port', portSchema, 'port')
