const mongoose = require('mongoose')

const Schema = mongoose.Schema

const shipSchema = new Schema({
  name: { type: String, required: true, max: 250 },
  number: { type: Number, required: true, unique: true, max: 999 },
  country: { type: String, required: true, max: 250 },
  tonnage: { type: Number, required: true, max: 250 },
  draft: { type: Number, required: true, max: 250 }
})

module.exports = mongoose.model('Ship', shipSchema, 'ship')
