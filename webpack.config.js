module.exports = {
    entry: {
        lottery: './src/js/lottery.js',
        product: './src/js/product.js',
        cart: './src/js/cart.js',
        orders: './src/js/orders.js',
        order: './src/js/order.js',

    },
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/dist/js'
      },
      devtool: 'inline-source-map'
};