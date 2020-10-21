
const db = require('../models');
const Probability = db.Probability;
const axios = require('axios');

const okRes = (data) => ({
    ok: true,
    data
})

const uploadImg = (img) => {
    let res = axios({
        method: 'POST',
        url: 'https://api.imgur.com/3/image',
    })
}

module.exports = {
    draw: async (req, res, next) => {
        console.log('draw');
        try {
            const PrizesData = await Probability.findAll({
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
            res.send({
                ok: true,
                data: drawPrize
            })
            res.end()
        } catch (err) {
            next(err)
        }

    },
    getAll: async (req, res, next) => {
        try {
            const allPrizesData = await Probability.findAll();
            res.send(okRes(allPrizesData))
        } catch (err) {
            next(err)
        }
    },
    get: async (req, res, next) => {
        const id = req.params.id;
        try {
            const prizeData = await Probability.findOne({
                where: {
                    id
                },
                raw: true
            });
            console.log(prizeData);
            res.send(okRes(prizeData));
        } catch (err) {
            next(err)
        }
    },
    add: async (req, res, next) => {
        console.log('prize add');
        const { name, chance, imgURI, content, unReached } = req.body;
        try {
            if (!name || !chance) throw Error('lack basic data')
            if (isNaN(+chance)) throw Error('chance Data is in wrong data type');
            if ((chance + '').length > 3) throw Error('chance data need to lower than 3 digits');
            const newPrizeData = await Probability.create({
                name,
                chance: +chance,
                imgURI,
                content,
                unReached
            });
            // console.log(newPrizeData);
            res.send({
                ok: true,
                data: newPrizeData
            })
            res.end();

        } catch (err) {
            next(err)
        }
    },
    delete: async (req, res, next) => {
        console.log('prize delete: ', id);
        const id = req.params.id;
        try {
            const deletePrize = await Probability.destroy({
                where: {
                    deletedId: id
                }
            });
            if (deletePrize < 1) throw Error('wrong ID')
        } catch (err) {
            next(err)
        }
    },
    update: async (req, res, next) => {
        console.log('prize update: ', id);
        const id = +req.params.id;
        try {
            if (!id) throw Error('no Id');
            const newPrizeData = await Probability.update(req.body, {
                where: {
                    id
                }
            });
            if (newPrizeData < 1) throw Error('Wrong ID')
            res.send({
                ok: true,
                data: {
                    affectedRows: newPrizeData[0]
                }
            })
            res.end();

        } catch (err) {
            next(err)
        }


    },
    img:  async (req, res, next) => {
        console.log(req.files);
        res.end()
    }

}