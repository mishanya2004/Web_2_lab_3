const Ship = require('./../models/ship')

module.exports = function (id) {
  return new Promise((resolve, reject) => {
    Ship.findById(id, function (err, ship) {
      if (err) {
        reject(err)
      } else {
        resolve(ship)
      }
    })
  })
}
