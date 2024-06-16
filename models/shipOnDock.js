const mongoose = require('mongoose')

const Schema = mongoose.Schema

const shipOnDockSchema = new Schema({
  ship: { type: String, required: true, max: 250 },
  dock: { type: String, required: true, max: 250 }
})

module.exports = mongoose.model('ShipOnDock', shipOnDockSchema, 'shipOnDock')
