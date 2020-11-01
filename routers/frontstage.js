const express = require('express');
const router = express.Router();

const frontStage = require('../controllers/frontStageController')

router.get('/', frontStage.index)
router.get('/lottery', frontStage.lottery)
router.get('/product', frontStage.product)
router.get('/cart', frontStage.cart)
router.get('/order', frontStage.orders)
router.get('/order/:id', frontStage.order)

module.exports = router;