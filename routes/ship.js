'use strict';

const express = require('express');
const router = express.Router();
const shipController = require('../controllers/ship');

router.get('/', shipController.index);
router.get('/list', shipController.shipList);
router.get('/add', shipController.createShipForm);
router.post('/add', shipController.postCreateShip);
router.get('/edit/:id', shipController.updateShipForm);
router.post('/edit/:id', shipController.putUpdateShip);
router.get('/remove/:id', shipController.deleteShipFrom);
router.post('/remove/:id', shipController.deleteShip);

module.exports = router;
