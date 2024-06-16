const Ship = require('./../models/ship')

module.exports = function () {
  return new Promise((resolve, reject) => {
    Ship.find({})
      .exec(function (err, ships) {
        if (err) {
          reject(err)
        } else {
          resolve(ships)
        }
      })
  })
}
