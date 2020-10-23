'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      imgURI: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM(['supply', 'soldout', 'hide']),
        defaultValue: 'supply'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
  }
};