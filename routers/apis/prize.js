const express = require('express');
const router = express.Router();
const lottery = require('../../controllers/lotteryController');

// all URL is folloew by /api
router.get('/draw', lottery.draw)
router.route('/prizes')
    .get(lottery.getAll())
    .post(lottery.add)

router.route('/prizes/:id')
    .get(lottery.get())
    .delete(lottery.delete())
    .put(lottery.update)


module.exports = router;