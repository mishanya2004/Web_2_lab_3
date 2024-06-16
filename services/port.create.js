const Port = require('../models/port')

module.exports = function (data) {
  const port = new Port({
    code: data.code,
    name: data.name,
    country: data.country,
    address: data.address,
  })

  return new Promise((resolve, reject) => {
    port.save(function (err, createdPort) {
      if (err) {
        reject(err)
      } else {
        resolve(createdPort)
      }
    })
  })
}
