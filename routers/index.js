const express = require('express');
const router = express.Router();

// Front Stage
router.use('/', require('./frontstage'));
// Back Stage
router.use('/admin', require('./backstage'));
// APIs
router.use('/api', [
    require('./apis/prize'), 
    require('./apis/img'),
])

// console.log(123123123123);

module.exports = (app) => {
    app.use(router)
}