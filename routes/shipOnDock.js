'use strict'

const express = require('express')
const router = express.Router()

const shipOnDockController = require('../controllers/shipOnDock')

router.get('/', shipOnDockController.index)
router.get('/list', shipOnDockController.shipOnDockList)
router.get('/add', shipOnDockController.createShipOnDockForm)
router.post('/add', shipOnDockController.postCreateShipOnDock)
router.get('/toShip/:id', shipOnDockController.toShipShipOnDockForm)
router.post('/toShip/:id', shipOnDockController.putToShipShipOnDock)
router.get('/toDock/:id', shipOnDockController.toShopShipOnDockForm)
router.post('/toDock/:id', shipOnDockController.putToShopShipOnDock)
router.get('/remove/:id', shipOnDockController.deleteShipOnDockFrom)
router.post('/remove/:id', shipOnDockController.deleteShipOnDock)

module.exports = router
