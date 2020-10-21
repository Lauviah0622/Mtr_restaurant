const express = require('express');
const router = express.Router();
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
var multer = require('multer')
var upload = multer(
    {
        dest: 'uploads/',
    }
)


const lottery = require('../controllers/lotteryController');
const frontStage = require('../controllers/frontStageController')
const backStage = require('../controllers/backStageController');
const { default: Axios } = require('axios');

// frontStage
router.get('/', frontStage.index)
router.get('/lottery', frontStage.lottery)

// backStage
router.get('/admin/lottery', backStage.lottery)
router.get('/admin/lottery/:id', backStage.lottery)


// lottery API
router.get('/draw', lottery.draw)
router.get('/prizes', lottery.getAll)
router.get('/prize/:id', lottery.get)
router.post('/prizes', lottery.add)
router.delete('/prizes/:id', lottery.delete)
router.put('/prizes/:id', lottery.update)
router.post('/img', upload.single('image'), async function (req, res, next) {
    // console.log('img', req.file);
    var data = new FormData();
    const path = './uploads/' + req.file.filename;
    data.append('image', fs.createReadStream(path));
    var config = {
        method: 'post',
        url: 'https://api.imgur.com/3/image',
        headers: {
            'Authorization': 'Client-ID 3d7f318a3767e00',
            ...data.getHeaders()
        },
        data: data
    };

    const imgurData = await axios(config);
    console.log('imgur', imgurData.data.data.link);
    fs.unlink(path, (err) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(path, 'removed');
    })
    res.send({
        url: imgurData.data.data.link
    })
    res.end()
})





module.exports = router