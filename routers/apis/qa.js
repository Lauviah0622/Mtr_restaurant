const express = require('express');
const router = express.Router();
const qaControllers = require('../../controllers/qaControllers');

router.route('/qa')
    .post(qaControllers.add)
    .put(qaControllers.relocate)


router.put('/qa/:id', qaControllers.update);
router.delete('/qa/:id', qaControllers.delete);




module.exports = router;