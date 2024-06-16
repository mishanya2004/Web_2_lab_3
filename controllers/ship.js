'use strict'

const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

const shipListService = require('./../services/ship.all')
const shipCreateService = require('./../services/ship.create')
const shipUpdateService = require('./../services/ship.update')
const shipDeleteService = require('./../services/ship.delete')
const shipByIdService = require('./../services/ship.byId')

module.exports = {
  index (req, res) {
    res.render('pages/ship/index')
  },
  async shipList (req, res) {
    try {
      const shipList = await shipListService()
      res.render('pages/ship/list', {
        ships: shipList
      })
    } catch (error) {
      res.render('pages/ship/list', {
        ships: [],
        errors: [{ msg: error.message }]
      })
    }
  },
  createShipForm (req, res) {
    res.render('pages/ship/add')
  },
  postCreateShip: [
    body('name')
      .isLength({ min: 1 }).trim().withMessage('Name field must be specified.'),
    body('number')
      .isLength({ min: 1 }).trim().withMessage('Boarding number field must be specified.'),
    body('country')
      .isLength({ min: 1 }).trim().withMessage('Country field must be specified.'),
    body('tonnage')
      .isLength({ min: 1 }).trim().withMessage('Tonnage field must be specified.'),
    body('draft')
      .isLength({ min: 1 }).trim().withMessage('Draft field must be specified.'),
    sanitizeBody('name').escape(),
    sanitizeBody('number').escape(),
    sanitizeBody('country').escape(),
    sanitizeBody('tonnage').escape(),
    sanitizeBody('draft').escape(),
    async (req, res) => {
      const shipData = req.body
      const errors = validationResult(req)

      if (errors.isEmpty()) {
        try {
          const updatedShip = await shipCreateService(shipData)
          req.flash('info', `Ship ${updatedShip.name}" "${updatedShip.number}" "${updatedShip.country}" "${updatedShip.tonnage}" "${updatedShip.draft}" is Added`)
          res.redirect('/ship/list')
        } catch (error) {
          res.render('pages/ship/add', {
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/ship/add', {
          errors: errors.array()
        })
      }
    }
  ],
  async updateShipForm (req, res, next) {
    try {
      const ship = await shipByIdService(req.params.id)
      if (!ship) {
        const errorServer = new Error('Not found')
        errorServer.status = 404
        next(errorServer)
        return
      }
      res.render('pages/ship/update', { ship: ship })
    } catch (error) {
      const errorServer = new Error(`Internal server error: ${error.message}`)
      errorServer.status = 500
      next(errorServer)
    }
  },
  putUpdateShip: [
    body('name')
      .isLength({ min: 1 }).trim().withMessage('Name field must be specified.'),
    body('number')
      .isLength({ min: 1 }).trim().withMessage('Boarding number field must be specified.'),
    body('country')
      .isLength({ min: 1 }).trim().withMessage('Country field must be specified.'),
    body('tonnage')
      .isLength({ min: 1 }).trim().withMessage('Tonnage field must be specified.'),
    body('draft')
      .isLength({ min: 1 }).trim().withMessage('Draft field must be specified.'),
    sanitizeBody('name').escape(),
    sanitizeBody('number').escape(),
    sanitizeBody('country').escape(),
    sanitizeBody('tonnage').escape(),
    sanitizeBody('draft').escape(),
    async (req, res, next) => {
      const shipData = req.body

      const errors = validationResult(req)
      if (errors.isEmpty()) {
        try {
          const updatedShip = await shipUpdateService(shipData)
          req.flash('info', `Ship "${updatedShip.name}" "${updatedShip.number}" "${updatedShip.country}" "${updatedShip.tonnage}" "${updatedShip.draft}" is Updated`)
          res.redirect('/ship/list')
        } catch (error) {
          res.render('pages/ship/update', {
            ship: shipData,
            newShip: shipData,
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/ship/delete', {
          ship: {},
          newShip: shipData,
          errors: errors.array()
        })
      }
    }
  ],
  deleteShipFrom (req, res, next) {
    shipByIdService(req.params.id)
      .then(ship => {
        if (ship) {
          res.render('pages/ship/delete', { ship: ship })
        } else {
          const errorNotFound = new Error('Not found')
          errorNotFound.status = 404
          next(errorNotFound)
        }
      })
      .catch(error => {
        const errorServer = new Error(`Internal server error: ${error.message}`)
        errorServer.status = 500
        next(errorServer)
      })
  },
  deleteShip (req, res, next) {
    shipDeleteService(req.body)
      .then(ship => {
        req.flash('info', `Ship "${ship.name} ${ship.number} ${ship.country} ${ship.tonnage} ${ship.draft}" is Deleted`)
        res.redirect('/ship/list')
      })
      .catch(error => {
        res.render('pages/ship/delete', {
          ship: req.body,
          errors: [{ msg: error.message }]
        })
      })
  }
}
