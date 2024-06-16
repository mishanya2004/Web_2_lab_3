const mongoose = require('mongoose')

const Schema = mongoose.Schema

const dockSchema = new Schema({
  port: { type: String, required: true, max: 250 },
  number: { type: Number, required: true, unique: true, max: 250 },
  capacity: { type: Number, required: true, max: 999 },
  draft: { type: Number, required: true, max: 999 }
})

module.exports = mongoose.model('Dock', dockSchema, 'dock')
