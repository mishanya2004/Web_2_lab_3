const Dock = require('../models/dock')

/**
 * @param {Object} data
 */
module.exports = function (id) {
  return new Promise((resolve, reject) => {
    Dock.findById(id, function (err, dock) {
      if (err) {
        reject(err)
      } else {
        resolve(dock)
      }
    })
  })
}
