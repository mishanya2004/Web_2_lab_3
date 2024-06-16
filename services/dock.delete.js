const Dock = require('../models/dock')

/**
 * @param {Object} data
 */
module.exports = function (data) {
  return new Promise((resolve, reject) => {
    Dock.findByIdAndDelete(data.id, function (err, deletedDock) {
      if (err) {
        reject(err)
      } else {
        resolve(deletedDock)
      }
    })
  })
}
