const ShipOnDock = require('../models/shipOnDock')

module.exports = function (data) {
  return new Promise((resolve, reject) => {
    ShipOnDock.findByIdAndDelete(data.id, function (err, deletedShipOnDock) {
      if (err) {
        reject(err)
      } else {
        resolve(deletedShipOnDock)
      }
    })
  })
}
