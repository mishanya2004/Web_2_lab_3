'use strict'

const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

const dockListService = require('./../services/dock.all')
const dockCreateService = require('./../services/dock.create')
const dockUpdateService = require('./../services/dock.update')
const dockDeleteService = require('./../services/dock.delete')
const dockByIdService = require('./../services/dock.byId')
const portListService = require('./../services/port.all')

module.exports = {
  index (req, res) {
    res.render('pages/dock/index')
  },
  async dockList (req, res) {
    try {
      const dockList = await dockListService()
      res.render('pages/dock/list', {
        docks: dockList
      })
    } catch (error) {
      res.render('pages/dock/list', {
        docks: [],
        errors: [{ msg: error.message }]
      })
    }
  },
  async createDockForm (req, res) {
    try {
      const portList = await portListService()
      res.render('pages/dock/add', { ports: portList })
    } catch (error) {
      res.render('pages/dock/list', {
        ports: portList,
        errors: [{ msg: error.message }]
      })
    }
  },
  postCreateDock: [
    body('port')
      .isLength({ min: 1 }).trim().withMessage('Port field must be specified.'),
    body('number')
      .isLength({ min: 1 }).trim().withMessage('Name field must be specified.')
      .isNumeric().withMessage('Number field must be a number.'),
    body('capacity')
      .isLength({ min: 1 }).trim().withMessage('Capacity field must be specified.'),
      body('draft')
      .isLength({ min: 1 }).trim().withMessage('Draft field must be specified.')
      .isNumeric().withMessage('Draft field must be a number.'),
    sanitizeBody('port').escape(),
    sanitizeBody('number').escape(),
    sanitizeBody('capacity').escape(),
    sanitizeBody('draft').escape(),
    async (req, res) => {
      const dockData = req.body
      const errors = validationResult(req)
      const portList = await portListService()
      if (errors.isEmpty()) {
        try {
          const dock = await dockCreateService(dockData)
          req.flash('info', `Dock "${dock.port}" "${dock.number}" "${dock.capacity}" "${dock.draft}" is Added`)
          res.redirect('/dock/list')
        } catch (error) {
          res.render('pages/dock/add', {
            ports: portList,
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/dock/add', {
          ports: portList,
          errors: errors.array()
        })
      }
    }
  ],
  async updateDockForm (req, res, next) {
    try {
      const dock = await dockByIdService(req.params.id)
      const portList = await portListService()
      if (!dock) {
        const errorServer = new Error('Not found')
        errorServer.status = 404
        next(errorServer)
        return
      }
      res.render('pages/dock/update', {
        newDock: dock,
        dock: dock,
        ports: portList
       })
    } catch (error) {
      const errorServer = new Error(`Internal server error: ${error.message}`)
      errorServer.status = 500
      next(errorServer)
    }
  },
  putUpdateDock: [
    body('port')
      .isLength({ min: 1 }).trim().withMessage('Port field must be specified.'),
    body('number')
      .isLength({ min: 1 }).trim().withMessage('Name field must be specified.')
      .isNumeric().withMessage('Number field must be a number.'),
    body('capacity')
      .isLength({ min: 1 }).trim().withMessage('Capacity field must be specified.'),
      body('draft')
      .isLength({ min: 1 }).trim().withMessage('Draft field must be specified.')
      .isNumeric().withMessage('Draft field must be a number.'),
    sanitizeBody('port').escape(),
    sanitizeBody('number').escape(),
    sanitizeBody('capacity').escape(),
    sanitizeBody('draft').escape(),
    async (req, res, next) => {
      const dockData = req.body
      const portList = await portListService()
      const errors = validationResult(req)
      if (errors.isEmpty()) {
        try {
          const updatedDock = await dockUpdateService(dockData)
          req.flash('info', `Dock "${dock.port}" "${dock.number}" "${dock.capacity}" "${dock.draft}" is Updated`)
          res.redirect('/dock/list')
        } catch (error) {
          res.render('pages/dock/update', {
            ports: portList,
            dock: dockData,
            newDock: dockData,
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/dock/list', {
          ports: portList,
          dock: dockData,
          newDock: dockData,
          errors: errors.array()
        })
      }
    }
  ],
  deleteDockFrom (req, res, next) {
    dockByIdService(req.params.id)
      .then(dock => {
        if (dock) {
          res.render('pages/dock/delete', { dock: dock })
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
  deleteDock (req, res, next) {
    dockDeleteService(req.body)
      .then(dock => {
        req.flash('info', `Dock "${dock.port} ${dock.number} ${dock.capacity} ${dock.draft}" is Deleted`)
        res.redirect('/dock/list')
      })
      .catch(error => {
        res.render('pages/dock/delete', {
          dock: req.body,
          errors: [{ msg: error.message }]
        })
      })
  }
}
