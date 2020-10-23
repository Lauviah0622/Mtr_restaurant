const express = require('express');
const router = express.Router();

const carts = require('../../controllers/cartsController');

router.route('/carts')
    .get(carts.checkCart)
    
    
    router.route('/carts/:productId')
    .get([carts.checkCart, carts.updateItem])
    // .delete([carts.checkCart, carts.deleteItem])
    
// router 這邊應該是拿來接模組的，
module.exports = router