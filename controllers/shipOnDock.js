'use strict'

const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

const shipOnDockListService = require('./../services/shipOnDock.all')
const shipOnDockCreateService = require('./../services/shipOnDock.create')
const shipOnDockUpdateService = require('./../services/shipOnDock.update')
const shipOnDockDeleteService = require('./../services/shipOnDock.delete')
const shipOnDockByIdService = require('./../services/shipOnDock.byId')
const dockListService = require('../services/dock.all')
const shipListService = require('../services/ship.all')
const shipByIdService = require('../services/ship.byId')

module.exports = {
  index (req, res) {
    res.render('pages/shipOnDock/index')
  },
  async shipOnDockList (req, res) {
    try {
      const shipOnDockList = await shipOnDockListService()
      res.render('pages/shipOnDock/list', {
        shipOnDocks: shipOnDockList
      })
    } catch (error) {
      res.render('pages/shipOnDock/list', {
        shipOnDocks: [],
        errors: [{ msg: error.message }]
      })
    }
  },
  async createShipOnDockForm (req, res) {
    try {
      const dockList = await dockListService()
      const shipList = await shipListService()
      res.render('pages/shipOnDock/add', { 
        docks: dockList,
        ships: shipList
       })
    } catch (error) {
      res.render('pages/shipOnDock/list', {
        docks: dockList,
        ships: shipList,
        errors: [{ msg: error.message }]
      })
    }
  },
  postCreateShipOnDock: [
    body('ship')
      .isLength({ min: 1 }).trim().withMessage('Ship field must be specified.'),
    body('dock')
      .isLength({ min: 1 }).trim().withMessage('Dock field must be specified.'),
    sanitizeBody('ship').escape(),
    sanitizeBody('dock').escape(),
    async (req, res) => {
      const shipOnDockData = req.body
      const errors = validationResult(req)
      const dockList = await dockListService()
      const shipList = await shipListService()
      const shipData = await shipList.find(s => s.number == req.body.ship)
      const shipOnDockList = await shipOnDockListService()
        if (errors.isEmpty()) {
          try {
            const updatedShipOnDock = await shipOnDockCreateService(shipOnDockData)
            req.flash('info', `Ship "${updatedShipOnDock.ship}" added to Dock "${updatedShipOnDock.dock}"`)
            res.redirect('/shipOnDock/list')
          } catch (error) {
            res.render('pages/shipOnDock/add', {
              docks: dockList,
              ships: shipList,
              errors: [{ msg: error.message }]
            })
          }
        } else {
          res.render('pages/shipOnDock/add', {
            docks: dockList,
            ships: shipList,
            errors: errors.array()
          })
        }
      }],
  async toShipShipOnDockForm (req, res, next) {
    try {
      const shipOnDock = await shipOnDockByIdService(req.params.id)
      let shipList = await shipListService()
      const ship = await shipByIdService(shipList.find(s => s.number === shipOnDock.ship).id)
      
      shipList = shipList.filter(e => e.dock === ship.dock)

      const dockList = await dockListService()
      if (!shipOnDock) {
        const errorServer = new Error('Not found')
        errorServer.status = 404
        next(errorServer)
        return
      }
      res.render('pages/shipOnDock/toShip', { 
        shipOnDock: shipOnDock,
        ships: shipList
       })
    } catch (error) {
      const errorServer = new Error(`Internal server error: ${error.message}`)
      errorServer.status = 500
      next(errorServer)
    }
  },
  putToShipShipOnDock: [
    body('ship')
    .isLength({ min: 1 }).trim().withMessage('Ship field must be specified.')
    .isNumeric().withMessage('Ship field must be a number.'),
    sanitizeBody('ship').escape(),
    async (req, res, next) => {
      const shipOnDockData = req.body
      const shipOnDock = await shipOnDockByIdService(req.body.id)
      const shipList = await shipListService()
      const shipOnDockList = await shipOnDockListService()
      shipOnDockData["dock"] = shipOnDock.dock
        const errors = validationResult(req)
      if (errors.isEmpty()) {
        try {
          const updatedShipOnDock = await shipOnDockUpdateService(shipOnDockData)
          req.flash('info', `Ship "${updatedShipOnDock.ship}" moved to Dock "${updatedShipOnDock.dock}"`)
          res.redirect('/shipOnDock/list')
        } catch (error) {
          res.render('pages/shipOnDock/toShip', {
            ships: shipList,
            shipOnDock: shipOnDockData,
            newShipOnDock: shipOnDockData,
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/shipOnDock/delete', {
          shipOnDock: {},
          newShipOnDock: shipOnDockData,
          errors: errors.array()
        })
      }
      }
  ],
  async toShopShipOnDockForm (req, res, next) {
    try {
      const shipOnDock = await shipOnDockByIdService(req.params.id)
      const dockList = await dockListService()
      if (!shipOnDock) {
        const errorServer = new Error('Not found')
        errorServer.status = 404
        next(errorServer)
        return
      }
      res.render('pages/shipOnDock/toShop', { 
        shipOnDock: shipOnDock,
        docks: dockList
       })
    } catch (error) {
      const errorServer = new Error(`Internal server error: ${error.message}`)
      errorServer.status = 500
      next(errorServer)
    }
  },
  putToShopShipOnDock: [
    body('dock')
    .isLength({ min: 1 }).trim().withMessage('Ship field must be specified.'),
    sanitizeBody('dock').escape(),
    async (req, res, next) => {
      let dockShopData = req.body
      const shipOnDock = await shipOnDockByIdService(req.body.id)
      const dockList = await dockListService()
      dockShopData["dock"] = shipOnDock.dock
      const errors = validationResult(req)
      if (errors.isEmpty()) {
        try {
          await shipOnDockDeleteService(req.body)
          await dockShopCreateService(dockShopData)
          req.flash('info', `Dock "${shipOnDock.dock}" moved to dock "${dockShopData.dock}"`)
          res.redirect('/shipOnDock/list')
        } catch (error) {
          res.render('pages/shipOnDock/toShop', {
            shipOnDock: shipOnDock,
            docks: dockList,
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/shipOnDock/delete', {
          shipOnDock: {},
          dockShopData: dockShopData,
          errors: errors.array()
        })
      }
      }
  ],
  deleteShipOnDockFrom (req, res, next) {
    shipOnDockByIdService(req.params.id)
      .then(shipOnDock => {
        if (shipOnDock) {
          res.render('pages/shipOnDock/delete', { shipOnDock: shipOnDock })
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
  deleteShipOnDock (req, res, next) {
    shipOnDockDeleteService(req.body)
      .then(shipOnDock => {
        req.flash('info', `Ship "${shipOnDock.ship}" deleted from Dock "${shipOnDock.dock}"`)
        res.redirect('/shipOnDock/list')
      })
      .catch(error => {
        res.render('pages/shipOnDock/delete', {
          shipOnDock: req.body,
          errors: [{ msg: error.message }]
        })
      })
  }
}
