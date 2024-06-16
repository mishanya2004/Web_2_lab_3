const Ship = require('./../models/ship')

module.exports = function (data) {
  const shipData = {
    name: data.name,
    number: data.number,
    country: data.country,
    tonnage: data.tonnage,
    draft: data.draft,
  }

  return new Promise((resolve, reject) => {
    Ship.findByIdAndUpdate(
      data.id,
      { $set: shipData },
      { new: true },
      function (err, updatedShip) {
        if (err) {
          reject(err)
        } else {
          resolve(updatedShip)
        }
      })
  })
}
