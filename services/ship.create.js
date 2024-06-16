const Ship = require('../models/ship')

module.exports = function (data) {
  const ship = new Ship({
    name: data.name,
    number: data.number,
    country: data.country,
    tonnage: data.tonnage,
    draft: data.draft,
  })

  return new Promise((resolve, reject) => {
    ship.save(function (err, createdShip) {
      if (err) {
        reject(err)
      } else {
        resolve(createdShip)
      }
    })
  })
}
