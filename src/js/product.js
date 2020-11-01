const {getCartItemsCookie, Cookie} = require('./utils')

class Cart {
    constructor (cookie) {
        this.cookie = cookie;
        this.items = {};
        cookie.cartItems.forEach(item => {
            this.items[item.productId] = item.qty
        })
    }

    addItem (itemId) {
        this.items[itemId] = this.items[itemId] ? this.items[itemId] += 1 : 1;
        this.syncToCookie()
        
        // return this.items[itemId];
    }

    syncToCookie () {
        let transCartData = Object.entries(this.items).map(([id, qty]) => {
            return {productId: +id, qty}
        })
        this.cookie.setCookie('cartItems', transCartData);
    }
}
const cookie = new Cookie(document.cookie);
const cart = new Cart(cookie);

document.querySelectorAll('.product__btn').forEach(element => {
    element.addEventListener('click', function (e) {
        cart.addItem(this.dataset.id)
        // console.log(this.dataset.id);
    })
})




