const Port = require('../models/port')

module.exports = function (data) {
  return new Promise((resolve, reject) => {
    Port.findByIdAndDelete(data.id, function (err, deletedPort) {
      if (err) {
        reject(err)
      } else {
        resolve(deletedPort)
      }
    })
  })
}
