'use strict'

const express = require('express')
const router = express.Router()
const portController = require('../controllers/port')

router.get('/', portController.index)
router.get('/list', portController.portList)
router.get('/add', portController.createPortForm)
router.post('/add', portController.postCreatePort)
router.get('/edit/:id', portController.updatePortForm)
router.post('/edit/:id', portController.putUpdatePort)
router.get('/remove/:id', portController.deletePortFrom)
router.post('/remove/:id', portController.deletePort)

module.exports = router
