const express = require('express');
const router = express.Router();

const backStage = require('../controllers/backStageController');

// all URL is folloew by /backstage
router.get('/lottery', backStage.lottery)

module.exports = router