const Product = require('./../models/port')

module.exports = function () {
  return new Promise((resolve, reject) => {
    Product.find({})
      .exec(function (err, ports) {
        if (err) {
          reject(err)
        } else {
          resolve(ports)
        }
      })
  })
}
