const express = require('express');
const router = express.Router();

const frontStage = require('../controllers/frontStageController')

router.get('/', frontStage.index)
router.get('/lottery', frontStage.lottery)

module.exports = router;