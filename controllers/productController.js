const express = require('express');

const model = require('../models');
const { Controller,  createSyncMiddelware} = require('./utils');

const Products = new Controller(model.Products);
// let update = 
Products.update = [
    createSyncMiddelware((req, res) => {
        if (req.body.name.length === 0) throw Error('No empty name');
    }),
    Products.update()
]

module.exports = Products;