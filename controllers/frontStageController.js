const db = require('../models');
const { Op } = require("sequelize"); 


module.exports = {
    index: async (req, res) => {
        res.render('frontStage/index', {})
    },
    lottery: (req, res) => {
        res.render('frontStage/lottery', {})
    },
    product: async (req, res) => {
        console.log(req.cookies);
        const productsData = await db.Products.findAll({
            attributes: ['id', 'name', 'price', 'imgURI', 'qty'],
            raw: true,
            where: {
                status: {[Op.not]: 'hide'}
            }
        });
        // console.log(productsData);
        res.render('frontStage/product', {products: productsData})
    },
    cart: async (req, res) => {
        if (!req.session.cartId) {
            res.redirect('/product');
            return 
        }
        const cartId = req.session.cartId;
        console.log(cartId);
        const cartItems = await db.CartItems.findAll({
            attributes: ['id', 'qty'],
            where: {
                cartId
            },
            include: [{
                model: db.Products,
                attributes: ['name', 'qty', 'imgURI', 'price'],
            }],
            raw: true
        })
        console.log(cartItems);
        const total = cartItems.reduce((acc, item) => {
            return acc + item['Product.qty'] * item['Product.price']
        }, 0)
        res.render('frontStage/cart', {cartItems, total})
    },
    orders: (req, res) => {
        res.render('frontStage/orders', {})
    },
    order: (req, res) => {
        res.render('frontStage/order', {})
    }
}