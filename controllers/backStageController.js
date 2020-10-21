const { query } = require('express');
const db = require('../models');
const Probability = db.Probability;



module.exports = {
    lottery: async (req, res) => {
        console.log(req.query);
        const editId = req.query.edit;
        const prizeData = await Probability.findAll({})
        res.render('backStage/lottery', { prizeData, editId })
        res.end()


        // console.log(prizeData);
    },
    lotteryEdit: async (req, res) => {
        const prizeData = await Probability.findAll({})
        // console.log(prizeData);
        res.render('backStage/lottery', { prizeData })
    }
}