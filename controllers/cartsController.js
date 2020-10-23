const db = require('../models');
const { createSyncMiddelware, sendOkRes, Controller } = require('./utils');
const { Carts, CartItems, Products } = db;
const cartsController = new Controller(db.Carts);

// controller 應該是要建立很多模組提供 router 去串接

const TESTID = 20;
cartsController.checkCart = async function (req, res, next) {
    try {
        console.log('session', req.session);
        console.log('cookies', req.cookies);
        let cartItemsData = {};
        if (!req.session.cartId) {
            console.log("no cart ID");
            let cartData = await Carts.create();
            req.session.cartId = TESTID || cartData.id;
        } else {
            console.log("has cart ID");
            cartItemsData = await CartItems.findAll({
                attributes: ['qty'],
                include: {
                    model: Products,
                    attributes: ['name', 'price', ['qty', 'productQty'], 'status']
                },
                where: { cartId: req.session.cartId },
                raw: true
            })
        }
        res.cookie('cartItems', cartItemsData);
        next();
    } catch (err) {
        next(err)
    }
    // 這邊的 data 跟上面 if 裡面的 data 一樣這樣是可以的嗎？
}

cartsController.updateItem = async function (req, res, next) {
    console.log('add Cart');
    try {
        cartId = req.session.cartId;
        productId = req.params.productId;
        const qty = (typeof req.query.q === 'undefined') ? 0 : +req.query.q;
        // if no qty or 0, delete Item
        if (qty === 0) {
            let data = CartItems.destroy({
                where: { cartId, productId }
            })
            sendOkRes(res, data);
            return 
        }
        // check item exist
        const cartProductData = await CartItems.findOne({
            where: { cartId, productId }
        })
        console.log(cartProductData);

        // if exist, update QTY
        if (cartProductData) {
            let data = await CartItems.update({
                qty
            }, {
                where: { cartId, productId }
            })
            console.log('add success');
            sendOkRes(res, data);
            return 
        }
        // if not exist, add new Item
        let data = await CartItems.create({
            cartId,
            productId,
            qty: qty
        })
        sendOkRes(res, data);
        return 
    } catch (err){
        next(err);
    }
    
}

module.exports = cartsController



