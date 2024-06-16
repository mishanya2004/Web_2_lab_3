const ShipOnDock = require('../models/shipOnDock')

module.exports = function () {
  return new Promise((resolve, reject) => {
    ShipOnDock.find({})
      .exec(function (err, shipOnDocks) {
        if (err) {
          reject(err)
        } else {
          resolve(shipOnDocks)
        }
      })
  })
}
