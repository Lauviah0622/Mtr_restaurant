const db = require('../models');
const { Orders, OrderItems, Products, Carts, CartItems } = db;
const { sendOkRes, isIdValid } = require('./utils');

// console.log(Orders1, OrderItems);


async function createEmptyOrder() {
  try {
    const newOrder = await Orders.create();
    return Promise.resolve(newOrder.id)
  } catch (err) {
    return Promise.reject(err);
  }
}

async function updateOrderPrice(id) {
  let orderItemsData;
  orderItemsData = await OrderItems.findAll({
    attributes: ['qty'],
    where: { orderId: id },
    include: {
      model: Products,
      attributes: ['price']
    },
    raw: true
  });
  let total = orderItemsData.reduce((acc, item) => {
    return acc + item.qty * item['Product.price']
  }, 0)
  const orderUpdateData = await Orders.update({ price: total }, {
    where: { id }
  });
  console.log(orderUpdateData);
  return Promise.resolve()
}

async function updateOrderInfo(id, data) {
  try {
    if (!checkIsUndefined(data.email) && !verifyEmail(data.email)) throw Error('wrong eamil format');
    if (!checkIsUndefined(data.phoneNum) && !verifyPhoneNum(data.phoneNum)) throw Error('wrong phoneNum format');

    const columns = ['status', 'name', 'email', 'phoneNum'];
    const updateData = filtObj(data, columns);
    console.log(data);
    return Orders.update(updateData, {
      where: { id }
    })
  } catch (err) {
    console.log(err);
    return Promise.reject(err.message);
  }
}

async function getOrderStatus(id) {
  try {
    let data = await Orders.findOne({
      attributes: ['id', 'status'],
      where: { id },
      raw: true
    });
    if (data === null ) throw Error('No order of this ID')
    return data.status
  } catch (err) {
    return err.message
  }
}


async function updateOrderItem(orderId, newOrderItems) {
  try {
    let orderStatus = getOrderStatus(orderid);

    if (orderData !== 'unpayed') throw Error('Order isnt unpayed');

    for (let newOrderItem of newOrderItems) {
      const productQtyData = await Products.findOne({
        where: { id: newOrderItem.productId },
        attributes: ['id', 'qty'],
        raw: true

      })
      const orderQtyData = await OrderItems.findOne({
        where: {
          productId: newOrderItem.productId,
          orderId
        },
        attributes: ['id', 'productId', 'qty'],
        raw: true

      })
      let productQty = productQtyData.qty;
      let orderQty = orderQtyData === null ? 0 : orderQtyData.qty || 0
      newOrderItem.newProductQty = productQty + orderQty - newOrderItem.qty
      newOrderItem.totalQty = productQty + orderQty;
      if (newOrderItem.newProductQty < 0) throw Error('Product Doesnt enough');


      if (orderQtyData !== null) {
        await OrderItems.destroy({
          where: { id: orderQtyData.id },

        })
      }

      await OrderItems.create({
        productId: newOrderItem.productId,
        orderId,
        qty: newOrderItem.qty
      })

      await Products.update({
        qty: newOrderItem.newProductQty
      }, {
        where: {
          id: newOrderItem.productId
        }
      })
    }


    await updateOrderPrice(orderId);
    return Promise.resolve(true);
  } catch (err) {
    console.log(err);
    return Promise.resolve(false);
  }
}

async function deleteCart(id) {
  return await Carts.destroy({
    where: { id }
  });
}



function filtObj(obj, validPropsArr) {
  let result = {};
  Object.keys(obj).forEach(key => {
    if (!obj[key] || !validPropsArr.includes(key)) return
    result[key] = obj[key];
  })
  return result
}

const checkIsUndefined = (variable) => typeof variable === 'undefined';

function verifyEmail(email) {
  if (typeof email !== 'string') return false;
  const result = email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  return Array.isArray(result) && result[0] === email;
}

function verifyPhoneNum(phoneNum) {
  if (typeof phoneNum !== 'string') return false;
  const result = phoneNum.match(/09\d{8}/)
  return Array.isArray(result) && result[0] === phoneNum;
}

function checkValidOrderInfo(orderInfo) {
  if (checkIsUndefined(orderInfo.name) || orderInfo.name.length === 0) {
    return false
  }
  if (checkIsUndefined(orderInfo.phoneNum)) return false
  if (checkIsUndefined(orderInfo.email)) return false
  if (orderInfo.price === 0) return false
  return true
}

module.exports = {
  checkout: async (req, res, next) => {
    try {
      if (typeof req.body.id === 'undefined') throw Error('no Id');

      const id = typeof req.body.id
      const newOrderItems = req.body.orderItems;
      if (!isIdValid(id)) throw Error('invalid Id');

      let orderInfo = await Orders.findOne({ where: { id } });
      if (orderInfo === null) throw Error('no this order');
      if (!checkValidOrderInfo(orderInfo)) throw Error('invalid checkout' + orderInfo);

      db.sequelize.transaction(async (t1) => {
        if (!checkIsUndefined(newOrderItems)) {
          await updateOrderItem(id, newOrderItems);
        }
        await updateOrderInfo(id, { status: 'payed' });
      });

      sendOkRes(ers, { message: 'checkout OK' }, true)
      return
    } catch (err) {
      console.log(err);
    }
  },
  create: async (req, res, next) => {
    try {
      if (typeof req.body.id === 'undefined') throw Error('no Id');

      const cartId = req.body.id;
      if (!isIdValid(cartId)) throw Error('invalid Id');

      // 看看有沒有這個 cart
      let cartData = await Carts.findOne({
        where: { id: cartId },
        include: CartItems
      })
      if (!cartData) throw Error(`the cart doesn't exist`);

      // 拿 cart 的所有東西。整理所有東西變成一個 obj
      let newCartItems = cartData.CartItems.map(cartItem => {
        return (({ qty, productId }) => ({ qty, productId }))(cartItem)
      });
      let newOrderId = db.sequelize.transaction(async (t) => {
        // 建立一個 emptyOrder
        let newOrderId = await createEmptyOrder();
        // 把 Cart 的內容更新進 emptyOrder
        await updateOrderItem(newOrderId, newCartItems);
        // 刪掉 cart
        await deleteCart(cartId);
        return newOrderId;
      })

      // 傳一個有 order ID 的 Response
      sendOkRes(res, {
        orderId: newOrderId
      }, true);
      return
    } catch (err) {
      console.log(err);
      next(err)
    }

  },
  cancel: async (req, res, next) => {
    // 確認 ID
    try {
      if (typeof req.params.id === 'undefined') throw Error('no Id');
  
      const orderId = +req.params.id;
      console.log(orderId);
      if (!isIdValid(orderId)) throw Error('invalid Id');
      
  
      // 拿 status
      let cartStatus = await getOrderStatus(orderId);
      // 檢查 status 是不是 unpayed
      if (cartStatus !== 'unpayed') throw Error(`${cartStatus} cannot cancel`);
      // 把 order 的 status 改成 cancel
      updateOrderInfo(orderId, { status: 'canceled' });
      // 給一個 OK 的 msg
      sendOkRes(res, 'cancel success', true);
    } catch (err) {
      next(err);
    }
  },
};