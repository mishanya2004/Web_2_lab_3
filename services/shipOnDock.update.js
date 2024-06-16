const ShipOnDock = require('../models/shipOnDock')

module.exports = function (data) {
  const shipOnDockData = {
    ship: data.ship,
    dock: data.dock
  }

  return new Promise((resolve, reject) => {
    ShipOnDock.findByIdAndUpdate(
      data.id,
      { $set: shipOnDockData },
      { new: true },
      function (err, updatedShipOnDock) {
        if (err) {
          reject(err)
        } else {
          resolve(updatedShipOnDock)
        }
      })
  })
}
