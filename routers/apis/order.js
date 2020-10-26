const express = require('express');
const router = express.Router();
const order = require('../../controllers/orderController');

// all URL is folloew by /api
router.delete('/order/:id', order.cancel);


router.post('/order/checkout', order.checkout);
router.post('/carts/checkout', order.create)


/* 
- 送出訂單 POST: /order/checkout  (cartId)
- 結帳購物車（建立訂單）這個之後再一去 route/cart.js POST: /cart/checkout 
- 修改訂單數量 PUT: () /order
- 取消訂單 DELETE /order


下面這兩個留給 serverside render
- 查詢訂單細節
- 查詢所有訂單
*/

module.exports = router;