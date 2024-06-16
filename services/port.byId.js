const Port = require('../models/port')

module.exports = function (id) {
  return new Promise((resolve, reject) => {
    Port.findById(id, function (err, port) {
      if (err) {
        reject(err)
      } else {
        resolve(port)
      }
    })
  })
}
