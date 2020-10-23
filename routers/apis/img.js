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


router.post('/img', upload.single('image'), async function (req, res, next) {
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


module.exports = router;