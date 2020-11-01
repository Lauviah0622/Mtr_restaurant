'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Qa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Qa.init({
    priority: DataTypes.INTEGER,
    question: DataTypes.TEXT,
    answer: DataTypes.TEXT
  }, {
    hooks: {
      afterCreate: async (qa, option) => {
        await qa.update({
          priority: +qa.id
        });
      }
    },
    sequelize,
    modelName: 'Qa',
  });
  return Qa;
};