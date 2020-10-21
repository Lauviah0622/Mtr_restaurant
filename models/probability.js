'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Probability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Probability.init({
    name: DataTypes.STRING,
    chance: DataTypes.INTEGER({
      length: 3
    }),
    imgURI: DataTypes.STRING,
    content: DataTypes.STRING,
    unReached: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Probability',
  });
  return Probability;
};