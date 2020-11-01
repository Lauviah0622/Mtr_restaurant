const express = require('express');
const router = express.Router();
const carts = require('../controllers/cartsController')

// Front Stage
router.use([carts.checkCart, require('./frontstage')]);
// Back Stage
router.use('/admin', require('./backstage'));
// APIs
router.use('/api', [
    require('./apis/prize'), 
    require('./apis/product'),
    require('./apis/img'),
    require('./apis/cart'),
    require('./apis/order'),
    require('./apis/qa')
])

// console.log(123123123123);

module.exports = (app) => {
    app.use(router)
}