const ShipOnDock = require('../models/shipOnDock')

module.exports = function (id) {
  return new Promise((resolve, reject) => {
    ShipOnDock.findById(id, function (err, shipOnDock) {
      if (err) {
        reject(err)
      } else {
        resolve(shipOnDock)
      }
    })
  })
}
