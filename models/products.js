'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Products.hasMany(models.CartItems);
      Products.hasMany(models.OrderItems);
      // define association here
    }
  };
  Products.init({
    name: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    imgURI: DataTypes.TEXT,
    status: DataTypes.ENUM(['supply', 'soldout', 'hide'])
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};