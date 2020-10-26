const sendOkRes = (res, data = {}, resEnd = true) => {
    res.send({
        ok: true,
        data
    })
    if (resEnd) {
        res.end()
    }
}

const createSyncMiddelware = (cb) => {
    return (req, res, next) => {
        try {
            cb(req, res)
            next()
        } catch(err) {
            next(err)
        }
    }
}

const isIdValid = (id) => {
    return typeof id === 'number' && !isNaN(id)
};

const getValidId = (from) => {
    if (typeof from === 'undefined') throw Error('no Id');
    if (typeof from !== 'number' || isNaN(from)) throw Error('invalid ID')
    return from
};


class Controller {
    constructor(module) {
        this.module = module;
    }
}

Controller.prototype.get = function () {
    return async function (req, res, next) {
        console.log('get');
        console.log(this);
        const id = req.params.id;
        try {
            if (typeof id === 'undefined') throw Error('no ID');
            let data = await this.module.findOne({
                where: {
                    id
                }
            });
            if (!data) throw Error('no Data of id');
            sendOkRes(res, data)
        } catch (err) {
            next(err)
        }
    }.bind(this)
}

Controller.prototype.getAll = function () {
    return async function (req, res, next) {
        console.log('getAll');
        let data = await this.module.findAll();
        sendOkRes(res, data);
    }.bind(this)
}

Controller.prototype.delete = function () {
    return async function (req, res, next) {
        console.log('delete');
        const id = req.params.id;
        try {
            if (typeof id === 'undefined') throw Error('no ID');
            let data = await this.module.destroy({
                where: {
                    id
                }
            });
            sendOkRes(res, {
                affectedRows: data
            })
        } catch (err) {
            next(err)
        }
    }.bind(this)
}

Controller.prototype.update = function () {
    return async function (req, res, next) {
        console.log('product update');
        const id = req.params.id;
        try {
            const reqData = req.body;
            if (typeof id === 'undefined') throw Error('no ID');
            let productData = await this.module.update(reqData, {
                where: {
                    id
                }
            });
            if (productData < 1) throw Error('no Data of id')
            res.send({
                ok: true,
                data: {
                    affectedRows: productData
                }
            })
        } catch (err) {
            next(err)
        }
    }.bind(this);
}

Controller.prototype.add = function () {
    return async function (req, res, next) {
        console.log('product add');
        try {
            const reqData = req.body;
            let productData = await this.module.create(req.body);
            if (reqData.name.length < 0) throw Error('No empty name');
            sendOkRes(res, productData)
        } catch (err) {
            next(err)
        }
    }.bind(this);
}


module.exports = {
    sendOkRes,
    createSyncMiddelware,
    Controller,
    isIdValid
}