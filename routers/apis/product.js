const express = require('express');
const router = express.Router();

const product = require('../../controllers/productController')

router.route('/products')
    .get(product.getAll())
    .post(product.add());
    
router.route('/products/:id')
    .get(product.get())
    .delete(product.delete())
    .put(product.update);

module.exports = router;