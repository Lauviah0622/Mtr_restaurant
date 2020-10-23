const express = require('express');
const router = express.Router();

// Front Stage
router.use(require('./frontstage'));
// Back Stage
router.use('/admin', require('./backstage'));
// APIs
router.use('/api', [
    require('./apis/prize'), 
    require('./apis/product'),
    require('./apis/img'),
    require('./apis/cart')
])

module.exports = (app) => {
    app.use(router)
}