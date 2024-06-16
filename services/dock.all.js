const Dock = require('../models/dock')

/**
 * @param {Object} data
 */
module.exports = function () {
  return new Promise((resolve, reject) => {
    Dock.find({})
      .exec(function (err, docks) {
        if (err) {
          reject(err)
        } else {
          resolve(docks)
        }
      })
  })
}
