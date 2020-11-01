const db = require('../models/index');
const { get } = require('../routers/apis/qa');
const Qa = db.Qa;
const { getValidId, sendOkRes } = require('./utils');


async function createQa(question, answer) {
    try {
        if (typeof question !== 'string') throw Error('invalid question format');
        if (typeof answer !== 'string') throw Error('invalid question format');
        return Qa.create({
            question,
            answer
        });

    } catch (err) {
        console.log(err); 
    }
}

async function relocatePriority (newPriority) {
    if (!Array.isArray(newPriority)) throw Error('invalid Priority');
    let {count, rows: qas} = await Qa.findAndCountAll();
    if (newPriority.length !== count) throw Error('invalid Priority length');
    
    await Promise.all(qas.map(async qa => {
        return qa.update({priority: null});
    }))
    
    let res =  await Promise.all(newPriority.map(async (qa, i) => {
        return Qa.update({priority: i + 1}, {where: {id: qa.id}})
    }))
    return res
}

async function updateQaContent (id, question, answer) {
    if (typeof question !== 'string') throw Error('invalid question format');
    if (typeof answer !== 'string') throw Error('invalid question format');
    return await Qa.update({
        question, answer
    }, {where: {id}})
}
module.exports = {
    add: async (req, res, next) => {
        try {
            const newQa = (({question, answer}) => {
                return ({question: question + '', answer: answer + ''})
            })(req.body);
            const addRes = await createQa(newQa.question, newQa.answer);
            sendOkRes(res, addRes, true);
        } catch (err) {
            console.log(err);
            next(err);

        }
    },
    relocate: async (req, res, next) => {
        try {
            const newPriority = req.body;
            const relocateRes = db.sequelize.transaction(async (t) => {
                return await relocatePriority(newPriority);
            })

            // 想問這裡有沒有更好的算法，關於改變排序這部分，如果要改變極大數量的排序的話
            sendOkRes(res, relocateRes, true);
        } catch(err) {
            console.log(err);
            next(err);
        }
    },
    delete: async (req, res, next) => {
        try {
            const id = getValidId(+req.params.id);
            let deleteRes = await Qa.destroy({where: {id}});
            if (deleteRes < 1) throw Error('no this QA');
            sendOkRes(res, {affectedRows: deleteRes}, true);
        } catch (err) {
            next(err)
        }
    },
    update: async (req, res, next) => {
        try {
            const id = getValidId(req.params.id);
            const newQaContent = (({question, answer}) => {
                return ({question: question + '', answer: answer + ''})
            })(req.body);
            const updateRes = await updateQaContent(id, newQaContent.question, newQaContent.answer);
            sendOkRes(res, {affectedRows: updateRes}, true);

        } catch (err) {
            console.log(err);
            next(err)
        }
    }
};