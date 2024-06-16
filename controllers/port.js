'use strict'

const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

const portListService = require('./../services/port.all')
const portCreateService = require('./../services/port.create')
const portUpdateService = require('./../services/port.update')
const portDeleteService = require('./../services/port.delete')
const portByIdService = require('./../services/port.byId')

module.exports = {
  index (req, res) {
    res.render('pages/port/index')
  },
  async portList (req, res) {
    try {
      const portList = await portListService()
      res.render('pages/port/list', {
        ports: portList
      })
    } catch (error) {
      res.render('pages/port/list', {
        ports: [],
        errors: [{ msg: error.message }]
      })
    }
  },
  createPortForm (req, res) {
    res.render('pages/port/add')
  },
  postCreatePort: [
    body('code')
      .isLength({ min: 1 }).trim().withMessage('Code field must be specified.'),
    body('name')
      .isLength({ min: 1 }).trim().withMessage('Name field must be specified.'),
    body('country')
      .isLength({ min: 1 }).trim().withMessage('Country field must be specified.'),
    body('address')
      .isLength({ min: 1 }).trim().withMessage('Address field must be specified.'),
    sanitizeBody('code').escape(),
    sanitizeBody('name').escape(),
    sanitizeBody('country').escape(),
    sanitizeBody('address').escape(),
    async (req, res) => {
      const portData = req.body
      const errors = validationResult(req)

      if (errors.isEmpty()) {
        try {
          const port = await portCreateService(portData)
          req.flash('info', `Port "${port.code}" "${port.name}" "${port.country}" "${port.address}" is Added`)
          res.redirect('/port/list')
        } catch (error) {
          res.render('pages/port/add', {
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/port/add', {
          errors: errors.array()
        })
      }
    }
  ],
  async updatePortForm (req, res, next) {
    try {
      const port = await portByIdService(req.params.id)
      if (!port) {
        const errorServer = new Error('Not found')
        errorServer.status = 404
        next(errorServer)
        return
      }
      res.render('pages/port/update', { port: port })
    } catch (error) {
      const errorServer = new Error(`Internal server error: ${error.message}`)
      errorServer.status = 500
      next(errorServer)
    }
  },
  putUpdatePort: [
    body('code')
      .isLength({ min: 1 }).trim().withMessage('Code field must be specified.'),
    body('name')
      .isLength({ min: 1 }).trim().withMessage('Name field must be specified.'),
    body('country')
      .isLength({ min: 1 }).trim().withMessage('Country field must be specified.'),
    body('address')
      .isLength({ min: 1 }).trim().withMessage('Address field must be specified.'),
    sanitizeBody('code').escape(),
    sanitizeBody('name').escape(),
    sanitizeBody('country').escape(),
    sanitizeBody('address').escape(),
    async (req, res, next) => {
      const portData = req.body

      const errors = validationResult(req)
      if (errors.isEmpty()) {
        try {
          const updatedPort = await portUpdateService(portData)
          req.flash('info', `Port "${updatedPort.code}" "${updatedPort.name}" "${updatedPort.country}" "${updatedPort.address}" is Updated`)
          res.redirect('/port/list')
        } catch (error) {
          res.render('pages/port/update', {
            port: portData,
            newPort: portData,
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/port/delete', {
          port: {},
          newPort: portData,
          errors: errors.array()
        })
      }
    }
  ],
  deletePortFrom (req, res, next) {
    portByIdService(req.params.id)
      .then(port => {
        if (port) {
          res.render('pages/port/delete', { port: port })
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
  deletePort (req, res, next) {
    portDeleteService(req.body)
      .then(port => {
        req.flash('info', `Port "${port.code} ${port.name} ${port.country} ${port.address}" is Deleted`)
        res.redirect('/port/list')
      })
      .catch(error => {
        res.render('pages/port/delete', {
          port: req.body,
          errors: [{ msg: error.message }]
        })
      })
  }
}
