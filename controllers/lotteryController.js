
const db = require('../models');
// const Probability = db.Probability;
const { createSyncMiddelware, sendOkRes, Controller } = require('./utils');

const Probability = new Controller(db.Probability);

Probability.draw = async (req, res, next) => {
    console.log('draw');
    try {
        const PrizesData = await db.Probability.findAll({
            attributes: ['name', 'chance', 'content', 'imgURI'],
            where: {
                unReached: false
            },
            order: [['id', 'DESC']],
            raw: true
        })

        let totalChance = PrizesData.reduce((acc, prize) => acc + prize.chance, 0);
        const magicNum = 300; // 最低 default 機率 30 %
        if (totalChance > 1000) {
            totalChance += totalChance * (magicNum / 1000) // 獎項總和大於 100%，增設機率給 default
        }
        if (totalChance > (1000 - magicNum) && totalChance <= 1000) {
            totalChance = totalChance * 1000 / (1000 - magicNum) // 總和大於 (100% - 最低 default)，增設機率給 default
        } else {
            totalChance = 1000;  // 總和小於 100% - 最低 default，直接設為 100%
        }

        const drawPrize = PrizesData.reduce((acc, prize) => {
            if (typeof acc !== 'number') return acc
            let reduce = acc - prize.chance;
            if (reduce < 0 || prize.chance === 0) {
                return prize
            } else {
                return reduce
            }
        }, Math.floor(Math.random() * totalChance))
        delete drawPrize.chance;
        sendOkRes(res, drawPrize)
    } catch (err) {
        next(err)
    }

}

const checkName = createSyncMiddelware((req, res) => {
    if (!req.body.name) throw Error('no name')
})

const checkData = createSyncMiddelware((req, res) => {
    const {name, chance} = req.body;

    if (!name || !chance) throw Error('lack basic data')
    if (isNaN(+chance)) throw Error('chance Data is in wrong data type');
    if ((chance + '').length > 3) throw Error('chance data need to lower than 3 digits');
    req.body.chance = +req.body.chance
} )

Probability.add = [checkData, Probability.add()];
Probability.update = [checkName, Probability.update()];

module.exports = Probability