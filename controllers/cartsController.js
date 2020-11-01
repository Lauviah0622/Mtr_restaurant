const db = require('../models');
const { sendOkRes, Controller, getValidId, isIdExist, isUndefined } = require('./utils');
const { Carts, CartItems, Products } = db;
const cartsController = new Controller(db.Carts);

const getCartItems = async (where = {}, attributes) => {
    let options = {}
    options.where = where;
    if (Array.isArray(attributes) && attributes.length > 0) {
        options.attributes = attributes;
    }
    return await CartItems.findAll(options);
}

const deleteCartItmes = async (where = {}) => {
    return await CartItems.destroy({where})
}

const getNewCart = async () => {
    return await Carts.create();
}

const addCartItem = async (cartId, productId, qty) => {
    return await CartItems.create({
        cartId,
        productId,
        qty
    })
}

const  updateCartItem = async (cartId, productId, props) => {
    return await CartItems.update(props, {where: {cartId, productId}});
}

const updateCartItems = async (cartId, cartItems) => {
    if (!Array.isArray(cartItems)) return false;
    // db.sequelize.transaction(async () => {

    // })
    const cartItemAddingList = {...cartItems};
    const oldCartItems = getCartItems({cartId}, ['productId', 'qty']);
    oldCartItems.forEach(oldcartItem => {
        cartItems.forEach(cartItem => {
            if (oldcartItem.productId === cartItem.productId) {
            // 舊的新地都有
            } else {
                
            }


        })

        // 就得有，新的沒有
    })
    console.log(oldCartItems);
    console.log("update!!");
}

const setCartItemCookie = (res, cartItems) => {
    if (!Array.isArray(cartItems)) {
        cartItems = [];
    }
    res.cookie('cartItems', cartItems)
}


const TESTID = 3;
cartsController.checkCart = async function (req, res, next) {
    // 流程圖 https://reurl.cc/A8pY2Z

    let cartId = getValidId(req.session.cartId)
    if (!cartId || !await (isIdExist(Carts, { id: cartId }))) {
        console.log('no Valid ID');
        let newCartData = await getNewCart();
        cartId = newCartData.id;
        setCartItemCookie(res, []);
        req.session.cartId = cartId;
        console.log(cartId);
        next();
        return
    }
    console.log('has valid ID');
    req.session.cartId = TESTCARTID || cartId;


    console.log('========cartItems origin cookie from express====');
    console.log(req.cookies.cartItems);
    console.log(typeof req.cookies.cartItems);
    console.log('===============================================');
    const cartItems = req.cookies.cartItems;

    const cartItemsData = await CartItems.findAll({
        attributes: ['productId', 'qty'],
        where: {
            cartId
        },
        raw: true
    })
    console.log('cartItems', cartItems);
    if (typeof cartItems === 'undefined' || cartItems.length < 1) {
        if (cartItemsData.length === 0) {
            console.log('no  Cart Item Data');
            setCartItemCookie(res, cartItemsData);
        } else {
            console.log('has Cart Item Data');
            setCartItemCookie(res, cartItems);
        }
    } else {
        console.log('has Cart Item');
        console.log('======', cartItems, '======');
        console.log('======', typeof cartItems, '======');
        updateCartItems(cartId, cartItems)
        setCartItemCookie(res, cartItems);
    }
    next();
    return
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
    } catch (err) {
        next(err);
    }

}

module.exports = cartsController



