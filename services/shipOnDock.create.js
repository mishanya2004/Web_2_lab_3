const ShipOnDock = require('../models/shipOnDock')

module.exports = function (data) {
  const shipOnDock = new ShipOnDock({
    ship: data.ship,
    dock: data.dock
  })

  return new Promise((resolve, reject) => {
    shipOnDock.save(function (err, createdShipOnDock) {
      if (err) {
        reject(err)
      } else {
        resolve(createdShipOnDock)
      }
    })
  })
}
