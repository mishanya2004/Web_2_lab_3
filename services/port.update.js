const Port = require('../models/port')

module.exports = function (data) {
  const portData = {
    code: data.code,
    name: data.name,
    country: data.country,
    address: data.address
  }

  return new Promise((resolve, reject) => {
    Port.findByIdAndUpdate(
      data.id,
      { $set: portData },
      { new: true },
      function (err, updatedPort) {
        if (err) {
          reject(err)
        } else {
          resolve(updatedPort)
        }
      })
  })
}
